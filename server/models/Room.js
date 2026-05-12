import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  block: {
    type: String,
    required: true,
    trim: true
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 2,
    min: 1
  },
  occupiedBeds: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Full', 'Under Maintenance'],
    default: 'Available'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Middleware to automatically update status based on occupancy
roomSchema.pre('save', function() {
  if (this.status !== 'Under Maintenance') {
    if (this.occupiedBeds >= this.capacity) {
      this.status = 'Full';
    } else {
      this.status = 'Available';
    }
  }
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
