import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, uploadProfileImage, deleteProfileImage } from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { registerValidator, loginValidator } from '../validators/index.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

// Public Routes
router.post('/register', registerValidator, validate, asyncHandler(registerUser));
router.post('/login', loginValidator, validate, asyncHandler(loginUser));

// Protected Routes Example
// The user must provide a valid JWT token to access their profile
router.get('/profile', protect, asyncHandler(getUserProfile));
router.put('/profile', protect, asyncHandler(updateUserProfile));
router.post('/profile/image', protect, upload.single('image'), asyncHandler(uploadProfileImage));
router.delete('/profile/image', protect, asyncHandler(deleteProfileImage));

// Admin Protected Route Example
// The user must provide a valid token AND have role === 'admin'
router.get('/admin-dashboard', protect, admin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});

export default router;
