const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Per-user AI rate limiter — 20 requests per minute per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { message: 'AI rate limit exceeded. Please wait a moment before sending another request.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.use(aiLimiter);

router.post('/chat', aiController.chat);
router.post('/lesson', aiController.getLessonContent);
router.post('/notes', aiController.getNotes);
router.post('/planner', aiController.getStudyPlan);

module.exports = router;
