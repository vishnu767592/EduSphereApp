const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/chat', aiController.chat);
router.post('/lesson', aiController.getLessonContent);
router.post('/notes', aiController.getNotes);
router.post('/planner', aiController.getStudyPlan);

module.exports = router;
