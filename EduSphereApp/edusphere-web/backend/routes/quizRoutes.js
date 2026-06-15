const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/submit', quizController.submitQuizResult);
router.get('/performance', quizController.getPerformance);
router.get('/leaderboard', quizController.getLeaderboard);
router.post('/certificate', quizController.generateCertificate);
router.get('/certificates', quizController.getCertificates);

module.exports = router;
