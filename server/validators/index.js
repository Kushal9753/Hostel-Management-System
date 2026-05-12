import { body, param } from 'express-validator';

// --- AUTH VALIDATORS ---
export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// --- COMPLAINT VALIDATORS ---
export const createComplaintValidator = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['Electricity', 'Water', 'Internet', 'Cleaning', 'Other']).withMessage('Invalid complaint type'),
];

export const updateComplaintStatusValidator = [
  param('id').isMongoId().withMessage('Invalid complaint ID'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Resolved']).withMessage('Invalid status'),
];

// --- STUDENT VALIDATORS ---
export const updateStudentValidator = [
  param('id').isMongoId().withMessage('Invalid student ID'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
];

// --- LEAVE VALIDATORS ---
export const createLeaveValidator = [
  body('fromDate').isISO8601().withMessage('Valid fromDate is required'),
  body('toDate').isISO8601().withMessage('Valid toDate is required'),
  body('reason').notEmpty().withMessage('Reason is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
];

export const updateLeaveStatusValidator = [
  param('id').isMongoId().withMessage('Invalid leave ID'),
  body('status').optional().isIn(['Approved', 'Rejected', 'Pending']).withMessage('Invalid status'),
];

// --- ROOM VALIDATORS ---
export const addRoomValidator = [
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('floor').notEmpty().withMessage('Floor is required'),
  body('block').notEmpty().withMessage('Block is required'),
];

export const assignStudentValidator = [
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('studentId').isMongoId().withMessage('Invalid student ID'),
];

// --- ID VALIDATOR ---
export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];
