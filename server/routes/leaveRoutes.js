import express from 'express';
import {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createLeaveValidator, updateLeaveStatusValidator } from '../validators/index.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

// Require auth for all routes
router.use(protect);

// Student routes
router.post('/', createLeaveValidator, validate, asyncHandler(createLeaveRequest));
router.get('/my-leaves', asyncHandler(getMyLeaves));

// Admin routes
router.get('/', admin, asyncHandler(getAllLeaves));
router.put('/:id/status', admin, updateLeaveStatusValidator, validate, asyncHandler(updateLeaveStatus));

export default router;
