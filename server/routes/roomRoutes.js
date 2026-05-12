import express from 'express';
import {
  addRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
  assignStudentToRoom,
  getVacantRooms,
  getMyRoom
} from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { addRoomValidator, assignStudentValidator, idParamValidator } from '../validators/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Student route for room details
router.get('/my-room', protect, asyncHandler(getMyRoom));

// Apply protect and admin middleware to all routes below
router.use(protect, admin);

router.route('/')
  .post(addRoomValidator, validate, asyncHandler(addRoom))
  .get(asyncHandler(getAllRooms));

router.get('/vacant', asyncHandler(getVacantRooms));

router.route('/:id')
  .put(idParamValidator, validate, asyncHandler(updateRoom))
  .delete(idParamValidator, validate, asyncHandler(deleteRoom));

router.post('/:id/assign', assignStudentValidator, validate, asyncHandler(assignStudentToRoom));

export default router;
