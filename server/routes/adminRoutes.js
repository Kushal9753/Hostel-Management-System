import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', asyncHandler(getDashboardStats));

export default router;
