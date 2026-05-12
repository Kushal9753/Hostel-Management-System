import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Room from '../models/Room.js';
import Leave from '../models/Leave.js';

// Get all students with pagination, search, and filtering
// GET /api/students
// Private/Admin
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { role: 'student' };

    // Filter unassigned
    if (req.query.unassigned === 'true') {
      query.$or = [{ roomId: { $exists: false } }, { roomId: null }];
    }

    // Search query
    if (req.query.search) {
      if (!query.$or) query.$or = [];
      const searchConditions = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { course: { $regex: req.query.search, $options: 'i' } }
      ];
      
      if (query.$or.length > 0) {
         // If there's already an $or from unassigned, we must combine them using $and
         query.$and = [
           { $or: query.$or },
           { $or: searchConditions }
         ];
         delete query.$or;
      } else {
         query.$or = searchConditions;
      }
    }

    // Filter by course
    if (req.query.course && req.query.course !== 'All') {
      query.course = req.query.course;
    }

    // Sorting
    const sortParams = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sortParams[field] = order === 'asc' ? 1 : -1;
    } else {
      sortParams.createdAt = -1;
    }

    const students = await User.find(query)
      .select('-password')
      .populate('roomId', 'number')
      .skip(skip)
      .limit(limit)
      .sort(sortParams);

    const total = await User.countDocuments(query);

    res.status(200).json({
      students,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get single student details with room, complaints, leaves
// GET /api/students/:id
// Private/Admin
export const getStudentDetails = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('-password')
      .populate('roomId');

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const complaints = await Complaint.find({ student: student._id }).sort({ createdAt: -1 });
    
    // Use dynamic import for Leave model since it might not be imported at the top if it was created in a separate step by user
    // Assuming model is named Leave based on typical MERN patterns
    let leaves = [];
    try {
      const { default: Leave } = await import('../models/Leave.js');
      leaves = await Leave.find({ student: student._id }).sort({ createdAt: -1 });
    } catch(e) {
      // Leave model might be named differently or not accessible, ignore if it throws
    }

    res.status(200).json({
      student,
      complaints,
      leaves
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update student details
// PUT /api/students/:id
// Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const { name, email, phone, course, year } = req.body;

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.course = course || student.course;
    student.year = year || student.year;

    const updatedStudent = await student.save();

    res.status(200).json({
      _id: updatedStudent._id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      phone: updatedStudent.phone,
      course: updatedStudent.course,
      year: updatedStudent.year,
      roomId: updatedStudent.roomId
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid data' });
  }
};

// Delete student
// DELETE /api/students/:id
// Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Unassign room before deleting if they have one
    if (student.roomId) {
      const room = await Room.findById(student.roomId);
      if (room) {
        room.occupied = Math.max(0, room.occupied - 1);
        if (room.occupied < room.capacity) {
          room.status = 'Available';
        }
        await room.save();
      }
    }

    await student.deleteOne();
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get dashboard stats for student
// GET /api/students/dashboard
// Private/Student
export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    const activeLeaves = await Leave.countDocuments({ student: studentId, status: { $in: ['Pending', 'Approved'] } });
    const openComplaints = await Complaint.countDocuments({ student: studentId, status: { $in: ['Pending', 'In Progress'] } });
    
    // For pending dues, we can hardcode 0 or implement a fee system later.
    const pendingDues = 0; 

    res.status(200).json({
      activeLeaves,
      openComplaints,
      pendingDues,
      roomId: req.user.roomId // also return roomId from user context
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching student dashboard stats', error: error.message });
  }
};
