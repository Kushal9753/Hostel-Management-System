import Leave from '../models/Leave.js';

// @desc    Create new leave request
// @route   POST /api/leaves
// @access  Private (Student)
export const createLeaveRequest = async (req, res) => {
  try {
    const { fromDate, toDate, reason, destination } = req.body;

    if (!fromDate || !toDate || !reason || !destination) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ message: 'From Date cannot be after To Date' });
    }

    const leave = await Leave.create({
      student: req.user._id,
      fromDate,
      toDate,
      reason,
      destination
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating leave request', error: error.message });
  }
};

// @desc    Get logged in student's leave requests
// @route   GET /api/leaves/my-leaves
// @access  Private (Student)
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching leaves', error: error.message });
  }
};

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private/Admin
export const getAllLeaves = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.reason = { $regex: req.query.search, $options: 'i' };
    }

    const sortParams = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sortParams[field] = order === 'asc' ? 1 : -1;
    } else {
      sortParams.createdAt = -1;
    }

    const leaves = await Leave.find(query)
      .populate('student', 'name email course year phone')
      .sort(sortParams)
      .skip(skip)
      .limit(limit);

    const total = await Leave.countDocuments(query);

    res.status(200).json({
      leaves,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLeaves: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all leaves', error: error.message });
  }
};

// @desc    Update leave status
// @route   PUT /api/leaves/:id/status
// @access  Private/Admin
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status || leave.status;
    if (adminComment) {
      leave.adminComment = adminComment;
    }

    const updatedLeave = await leave.save();
    
    // Populate before returning so frontend gets the user details back instantly
    const populatedLeave = await Leave.findById(updatedLeave._id).populate('student', 'name email');
    
    res.status(200).json(populatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating leave status', error: error.message });
  }
};
