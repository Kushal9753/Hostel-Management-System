import express from 'express';

const router = express.Router();

// Basic test route
router.get('/test', (req, res) => {
  res.json({ message: 'Backend connection successful! The API is working perfectly.' });
});

export default router;
