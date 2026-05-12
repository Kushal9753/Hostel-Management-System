import { validationResult } from 'express-validator';

/**
 * Middleware to check for validation errors from express-validator
 * If errors exist, it returns a formatted 400 response.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  // Returning a 400 Bad Request
  return res.status(400).json({
    success: false,
    message: 'Validation Error',
    error: extractedErrors,
  });
};
