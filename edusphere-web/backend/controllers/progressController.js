const db = require('../config/db');

// Helper to get formatted date string (YYYY-MM-DD)
const getLocalDateString = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get yesterday's date string (YYYY-MM-DD)
const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
};

// 1. Mark a topic completed
exports.markTopicCompleted = async (req, res) => {
  const { subject_name, topic_name } = req.body;
  const userId = req.user.id;

  if (!subject_name || !topic_name) {
    return res.status(400).json({ message: 'Subject and topic name are required' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Try inserting completion (will ignore if already exists)
    const [insertResult] = await connection.query(
      'INSERT IGNORE INTO topic_completions (user_id, subject_name, topic_name) VALUES (?, ?, ?)',
      [userId, subject_name, topic_name]
    );

    const isNewCompletion = insertResult.affectedRows > 0;

    if (isNewCompletion) {
      // 1. Increment total_completed in user_progress
      await connection.query(
        'UPDATE user_progress SET total_completed = total_completed + 1 WHERE user_id = ?',
        [userId]
      );

      // 2. Increment daily completions
      const today = getLocalDateString();
      await connection.query(
        'INSERT INTO daily_progress (user_id, date, count) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1',
        [userId, today]
      );

      // 3. Update streaks
      const [progressRecords] = await connection.query(
        'SELECT streak, last_streak_date FROM user_progress WHERE user_id = ?',
        [userId]
      );

      let currentStreak = 0;
      let lastStreakDate = '';
      if (progressRecords.length > 0) {
        currentStreak = progressRecords[0].streak || 0;
        lastStreakDate = progressRecords[0].last_streak_date 
          ? getLocalDateString(new Date(progressRecords[0].last_streak_date))
          : '';
      }

      let newStreak = currentStreak;
      const yesterday = getYesterdayDateString();

      if (lastStreakDate !== today) {
        if (lastStreakDate === yesterday) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1; // streak reset or starter
        }
        await connection.query(
          'UPDATE user_progress SET streak = ?, last_active_date = ?, last_streak_date = ? WHERE user_id = ?',
          [newStreak, today, today, userId]
        );
      } else {
        await connection.query(
          'UPDATE user_progress SET last_active_date = ? WHERE user_id = ?',
          [today, userId]
        );
      }
    }

    await connection.commit();
    connection.release();

    res.status(200).json({
      message: 'Topic completion tracked successfully',
      isNewCompletion
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Track progress error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 2. Get progress summary
exports.getProgressSummary = async (req, res) => {
  const userId = req.user.id;
  try {
    const [progress] = await db.query(
      'SELECT streak, total_completed, total_quizzes, total_quiz_score FROM user_progress WHERE user_id = ?',
      [userId]
    );

    if (progress.length === 0) {
      return res.status(200).json({
        streak: 0,
        totalCompleted: 0,
        totalQuizzes: 0,
        avgScore: 0,
        level: 'Starter 👋'
      });
    }

    const { streak, total_completed, total_quizzes, total_quiz_score } = progress[0];
    const avgScore = total_quizzes > 0 ? Math.round(total_quiz_score / total_quizzes) : 0;

    // Level calculation (matching Android)
    let level = 'Starter 👋';
    if (total_completed >= 50) level = 'Expert 🏆';
    else if (total_completed >= 30) level = 'Advanced ⭐';
    else if (total_completed >= 15) level = 'Intermediate 📚';
    else if (total_completed >= 5) level = 'Beginner 🌱';

    res.status(200).json({
      streak,
      totalCompleted: total_completed,
      totalQuizzes: total_quizzes,
      avgScore,
      level
    });
  } catch (error) {
    console.error('Progress summary error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 3. Get subject-wise completions
exports.getSubjectProgress = async (req, res) => {
  const userId = req.user.id;
  try {
    const [completions] = await db.query(
      'SELECT subject_name, COUNT(*) as count FROM topic_completions WHERE user_id = ? GROUP BY subject_name',
      [userId]
    );

    const progressMap = {};
    completions.forEach(row => {
      progressMap[row.subject_name] = row.count;
    });

    res.status(200).json(progressMap);
  } catch (error) {
    console.error('Subject progress error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get list of completed topics (to show checkmarks in topic listing)
exports.getCompletedTopics = async (req, res) => {
  const userId = req.user.id;
  try {
    const [completions] = await db.query(
      'SELECT subject_name, topic_name FROM topic_completions WHERE user_id = ?',
      [userId]
    );
    res.status(200).json(completions);
  } catch (error) {
    console.error('Completed topics error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 4. Get weekly logs for the last 7 days
exports.getWeeklyData = async (req, res) => {
  const userId = req.user.id;
  try {
    const daysData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = getLocalDateString(date);
      const dayName = dayNames[date.getDay()];

      const [log] = await db.query(
        'SELECT count FROM daily_progress WHERE user_id = ? AND date = ?',
        [userId, dateString]
      );

      const count = log.length > 0 ? log[0].count : 0;
      daysData.push({ day: dayName, count });
    }

    res.status(200).json(daysData);
  } catch (error) {
    console.error('Weekly data error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 5. Toggle bookmark state
exports.toggleBookmark = async (req, res) => {
  const { subject_name, topic_name } = req.body;
  const userId = req.user.id;

  if (!subject_name || !topic_name) {
    return res.status(400).json({ message: 'Subject and topic name are required' });
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM bookmarks WHERE user_id = ? AND subject_name = ? AND topic_name = ?',
      [userId, subject_name, topic_name]
    );

    if (existing.length > 0) {
      // Remove bookmark
      await db.query(
        'DELETE FROM bookmarks WHERE user_id = ? AND subject_name = ? AND topic_name = ?',
        [userId, subject_name, topic_name]
      );
      return res.status(200).json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      // Add bookmark
      await db.query(
        'INSERT INTO bookmarks (user_id, subject_name, topic_name) VALUES (?, ?, ?)',
        [userId, subject_name, topic_name]
      );
      return res.status(200).json({ bookmarked: true, message: 'Bookmark added' });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 6. Get all bookmarks for a user
exports.getBookmarks = async (req, res) => {
  const userId = req.user.id;
  try {
    const [list] = await db.query(
      'SELECT subject_name, topic_name, bookmarked_at FROM bookmarks WHERE user_id = ? ORDER BY bookmarked_at DESC',
      [userId]
    );
    res.status(200).json(list);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
