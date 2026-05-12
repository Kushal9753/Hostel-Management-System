import Room from '../models/Room.js';
import User from '../models/User.js';

// @desc    Add a new room
// @route   POST /api/rooms
// @access  Private/Admin
export const addRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity } = req.body;

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = await Room.create({
      roomNumber,
      block,
      floor,
      capacity
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server Error adding room', error: error.message });
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private/Admin
export const getAllRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    if (req.query.block && req.query.block !== 'All') {
      query.block = req.query.block;
    }

    if (req.query.search) {
      query.roomNumber = { $regex: req.query.search, $options: 'i' };
    }

    const sortParams = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sortParams[field] = order === 'asc' ? 1 : -1;
    } else {
      sortParams.roomNumber = 1;
    }

    const rooms = await Room.find(query)
      .populate('students', 'name email course year phone')
      .sort(sortParams)
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments(query);

    res.status(200).json({
      rooms,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRooms: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching rooms', error: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity, status } = req.body;
    
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only allow lowering capacity if it doesn't violate current occupancy
    if (capacity && capacity < room.occupiedBeds) {
       return res.status(400).json({ message: `Cannot lower capacity below current occupancy (${room.occupiedBeds})` });
    }

    room.roomNumber = roomNumber || room.roomNumber;
    room.block = block || room.block;
    room.floor = floor || room.floor;
    room.capacity = capacity || room.capacity;
    
    if (status) {
      room.status = status;
    }

    const updatedRoom = await room.save();
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating room', error: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.occupiedBeds > 0) {
      return res.status(400).json({ message: 'Cannot delete a room that is currently occupied' });
    }

    await room.deleteOne();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting room', error: error.message });
  }
};

// @desc    Assign a student to a room
// @route   POST /api/rooms/:id/assign
// @access  Private/Admin
export const assignStudentToRoom = async (req, res) => {
  try {
    const { studentId } = req.body;
    
    const room = await Room.findById(req.params.id);
    const student = await User.findById(studentId);

    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (room.status === 'Under Maintenance') {
      return res.status(400).json({ message: 'Cannot assign student to room under maintenance' });
    }

    if (room.occupiedBeds >= room.capacity || room.status === 'Full') {
      return res.status(400).json({ message: 'Room is already at full capacity' });
    }

    // Check if student is already in a room
    if (student.roomId) {
      return res.status(400).json({ message: 'Student is already assigned to a room' });
    }

    // Update Room
    room.students.push(student._id);
    room.occupiedBeds += 1;
    await room.save();

    // Update Student
    student.roomId = room._id;
    await student.save();

    const populatedRoom = await Room.findById(room._id).populate('students', 'name email course year phone');
    res.status(200).json({ message: 'Student assigned successfully', room: populatedRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server Error assigning student', error: error.message });
  }
};

// @desc    Get vacant/available rooms
// @route   GET /api/rooms/vacant
// @access  Private/Admin
export const getVacantRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'Available' });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching vacant rooms', error: error.message });
  }
};

// @desc    Get current user's room details
// @route   GET /api/rooms/my-room
// @access  Private
export const getMyRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'roomId',
      populate: {
        path: 'students',
        select: 'name course email profileImage phone year'
      }
    });

    if (!user || !user.roomId) {
      return res.status(200).json(null);
    }

    res.status(200).json(user.roomId);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching room details', error: error.message });
  }
};
