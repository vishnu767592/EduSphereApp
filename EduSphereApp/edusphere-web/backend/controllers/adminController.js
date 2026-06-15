const db = require('../config/db');

// Get system dashboard summary (admin overview)
exports.getDashboardStats = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin privilege required' });
  }

  try {
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role != ?', ['admin']);
    const [completionsCount] = await db.query('SELECT COUNT(*) as count FROM topic_completions');
    const [quizzesCount] = await db.query('SELECT COUNT(*) as count FROM quiz_results');
    const [avgScore] = await db.query('SELECT AVG(percentage) as average FROM quiz_results');

    res.status(200).json({
      totalUsers: userCount[0].count,
      totalCompletions: completionsCount[0].count,
      totalQuizzes: quizzesCount[0].count,
      avgScore: avgScore[0].average ? Math.round(avgScore[0].average) : 0
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// List all registered students and their aggregate study progress
exports.getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin privilege required' });
  }

  try {
    const [users] = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at, up.streak, up.total_completed, up.total_quizzes,
              CASE WHEN up.total_quizzes > 0 THEN ROUND(up.total_quiz_score / up.total_quizzes) ELSE 0 END as avg_score
       FROM users u
       LEFT JOIN user_progress up ON u.id = up.user_id
       WHERE u.role != 'admin'
       ORDER BY u.created_at DESC`
    );
    res.status(200).json(users);
  } catch (error) {
    console.error('Admin get all users error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a user (moderation)
exports.deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin privilege required' });
  }

  const { userId } = req.params;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ? AND role != ?', [userId, 'admin']);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or cannot delete an admin' });
    }
    res.status(200).json({ message: 'User and all related records deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
