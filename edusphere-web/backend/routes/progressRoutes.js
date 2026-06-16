const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/complete', progressController.markTopicCompleted);
router.get('/summary', progressController.getProgressSummary);
router.get('/subjects', progressController.getSubjectProgress);
router.get('/completions', progressController.getCompletedTopics);
router.get('/weekly', progressController.getWeeklyData);
router.post('/bookmark', progressController.toggleBookmark);
router.get('/bookmarks', progressController.getBookmarks);

module.exports = router;
