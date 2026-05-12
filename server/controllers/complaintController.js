import Complaint from '../models/Complaint.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student only)
export const createComplaint = async (req, res) => {
  try {
    const { title, description, type, room } = req.body;

    const complaint = await Complaint.create({
      student: req.user._id,
      title,
      description,
      type,
      room,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid complaint data' });
  }
};

// @desc    Get all complaints for a student
// @route   GET /api/complaints/my-complaints
// @access  Private (Student only)
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private/Admin
export const getComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { type: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const sortParams = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sortParams[field] = order === 'asc' ? 1 : -1;
    } else {
      sortParams.createdAt = -1;
    }

    const complaints = await Complaint.find(query)
      .populate('student', 'name email roomNumber')
      .populate('room', 'number')
      .sort(sortParams)
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments(query);

    res.status(200).json({
      complaints,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComplaints: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email')
      .populate('room', 'number');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user is admin or the complaint owner
    if (req.user.role !== 'admin' && complaint.student._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this complaint' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status || complaint.status;
    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
    }

    const updatedComplaint = await complaint.save();

    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid data' });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.status(200).json({ message: 'Complaint removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
