import User from '../models/User.js';
import Room from '../models/Room.js';
import Complaint from '../models/Complaint.js';
import Leave from '../models/Leave.js';

// @desc    Get dashboard stats for admin
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: { $ne: 'Available' } });
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const leaveRequests = await Leave.countDocuments({ status: 'Pending' });

    // Recent activity - combine latest from different models
    const latestStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(2);
    const latestComplaints = await Complaint.find().sort({ createdAt: -1 }).limit(2);
    const latestLeaves = await Leave.find().sort({ createdAt: -1 }).limit(2);

    res.status(200).json({
      totalStudents,
      totalRooms,
      occupiedRooms,
      pendingComplaints,
      leaveRequests,
      recentActivity: {
        students: latestStudents,
        complaints: latestComplaints,
        leaves: latestLeaves
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard stats', error: error.message });
  }
};
