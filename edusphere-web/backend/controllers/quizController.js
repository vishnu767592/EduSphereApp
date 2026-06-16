const db = require('../config/db');
const crypto = require('crypto');

// 1. Submit quiz results
exports.submitQuizResult = async (req, res) => {
  const { subject_name, topic_name, score, total } = req.body;
  const userId = req.user.id;

  if (!subject_name || !topic_name || score === undefined || !total) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Server-side validation — don't trust client-supplied scores blindly
  const parsedScore = parseInt(score, 10);
  const parsedTotal = parseInt(total, 10);

  if (isNaN(parsedScore) || isNaN(parsedTotal)) {
    return res.status(400).json({ message: 'Score and total must be valid numbers' });
  }

  if (parsedTotal < 1 || parsedTotal > 50) {
    return res.status(400).json({ message: 'Total must be between 1 and 50' });
  }

  if (parsedScore < 0 || parsedScore > parsedTotal) {
    return res.status(400).json({ message: 'Score must be between 0 and total' });
  }

  const percentage = Math.round((parsedScore * 100) / parsedTotal);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert quiz result
    await connection.query(
      'INSERT INTO quiz_results (user_id, subject_name, topic_name, score, total, percentage) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, subject_name, topic_name, parsedScore, parsedTotal, percentage]
    );

    // Update aggregate progress stats
    await connection.query(
      'UPDATE user_progress SET total_quizzes = total_quizzes + 1, total_quiz_score = total_quiz_score + ? WHERE user_id = ?',
      [percentage, userId]
    );

    await connection.commit();
    connection.release();

    res.status(200).json({
      message: 'Quiz result submitted successfully',
      percentage,
      score: parsedScore,
      total: parsedTotal
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Submit quiz result error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 2. Get quiz performance statistics
exports.getPerformance = async (req, res) => {
  const userId = req.user.id;
  try {
    // Subject wise highest quiz score
    const [rows] = await db.query(
      'SELECT subject_name, MAX(percentage) as highest_score, COUNT(*) as attempts FROM quiz_results WHERE user_id = ? GROUP BY subject_name',
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Get performance stats error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 3. Get leaderboard ranks
exports.getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.name, up.streak, up.total_completed, up.total_quizzes, 
              CASE WHEN up.total_quizzes > 0 THEN ROUND(up.total_quiz_score / up.total_quizzes) ELSE 0 END as avg_score
       FROM users u
       JOIN user_progress up ON u.id = up.user_id
       WHERE u.role != 'admin'
       ORDER BY up.total_completed DESC, avg_score DESC, up.streak DESC
       LIMIT 10`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 4. Generate Certificate for Subject Completion
exports.generateCertificate = async (req, res) => {
  const { subject_name } = req.body;
  const userId = req.user.id;

  if (!subject_name) {
    return res.status(400).json({ message: 'Subject name is required' });
  }

  // Get total topics for subject (matching Android lists)
  const totalTopicsMap = {
    'Quantum Physics': 12,
    'Human Anatomy': 15,
    'Organic Chemistry': 10,
    'Ancient History': 8,
    'Calculus III': 14,
    'Astrophysics': 11,
    'Marine Biology': 9,
    'Computer Science': 20,
    'Artificial Intelligence': 18,
    'Psychology 101': 10
  };

  const requiredCount = totalTopicsMap[subject_name] || 10;

  try {
    // Count user's completed topics in this subject
    const [completions] = await db.query(
      'SELECT COUNT(*) as count FROM topic_completions WHERE user_id = ? AND subject_name = ?',
      [userId, subject_name]
    );

    const completedCount = completions[0].count;

    if (completedCount < requiredCount) {
      return res.status(400).json({
        message: `Subject incomplete. You completed ${completedCount}/${requiredCount} topics. Master all topics to unlock the certificate!`
      });
    }

    // Check if certificate already exists
    const [existing] = await db.query(
      'SELECT * FROM certificates WHERE user_id = ? AND subject_name = ?',
      [userId, subject_name]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        message: 'Certificate already unlocked!',
        certificate: existing[0]
      });
    }

    // Generate unique certificate verification code — 128-bit entropy (16 bytes)
    const certCode = 'CERT-' + crypto.randomBytes(16).toString('hex').toUpperCase();

    const [result] = await db.query(
      'INSERT INTO certificates (user_id, subject_name, certificate_code) VALUES (?, ?, ?)',
      [userId, subject_name, certCode]
    );

    res.status(201).json({
      message: 'Congratulations! Certificate unlocked successfully.',
      certificate: {
        id: result.insertId,
        user_id: userId,
        subject_name,
        certificate_code: certCode,
        issued_at: new Date()
      }
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 5. Get all certificates for user
exports.getCertificates = async (req, res) => {
  const userId = req.user.id;
  try {
    const [list] = await db.query(
      'SELECT id, subject_name, certificate_code, issued_at FROM certificates WHERE user_id = ? ORDER BY issued_at DESC',
      [userId]
    );
    res.status(200).json(list);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
