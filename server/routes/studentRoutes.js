import express from 'express';
import {
  getStudents,
  getStudentDetails,
  updateStudent,
  deleteStudent,
  getStudentDashboardStats
} from '../controllers/studentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { updateStudentValidator, idParamValidator } from '../validators/index.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

// Student routes
router.get('/dashboard', protect, asyncHandler(getStudentDashboardStats));

// All routes below are protected and require admin role
router.use(protect, admin);

router.route('/')
  .get(asyncHandler(getStudents));

router.route('/:id')
  .get(idParamValidator, validate, asyncHandler(getStudentDetails))
  .put(updateStudentValidator, validate, asyncHandler(updateStudent))
  .delete(idParamValidator, validate, asyncHandler(deleteStudent));

export default router;
