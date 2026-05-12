import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a complaint title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a complaint description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify the complaint type'],
      enum: ['Electricity', 'Water', 'Internet', 'Cleaning', 'Other'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: false,
    },
    adminResponse: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
