import express from 'express';
import {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createComplaintValidator, updateComplaintStatusValidator, idParamValidator } from '../validators/index.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = express.Router();

router.route('/')
  .post(protect, createComplaintValidator, validate, asyncHandler(createComplaint))
  .get(protect, admin, asyncHandler(getComplaints));

router.route('/my-complaints').get(protect, asyncHandler(getMyComplaints));

router.route('/:id')
  .get(protect, idParamValidator, validate, asyncHandler(getComplaintById))
  .delete(protect, admin, idParamValidator, validate, asyncHandler(deleteComplaint));

router.route('/:id/status').put(protect, admin, updateComplaintStatusValidator, validate, asyncHandler(updateComplaintStatus));

export default router;
