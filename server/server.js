import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('Hostel Management System API is running...');
});

// Use Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Integration of DB connection before starting the server (Production ready practice)
const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();

  // Start the server only after a successful DB connection
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
