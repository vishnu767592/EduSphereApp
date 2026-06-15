const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'edusphere_jwt_secret_token_key_2026_db';

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Check if user already exists
    const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, email === 'admin' ? 'admin' : 'student']
    );

    const userId = result.insertId;

    // Initialize user progress summary
    await connection.query(
      'INSERT INTO user_progress (user_id, streak, total_completed, total_quizzes, total_quiz_score) VALUES (?, 0, 0, 0, 0)',
      [userId]
    );

    await connection.commit();
    connection.release();

    // Generate JWT
    const token = jwt.sign({ id: userId, name, email, role: email === 'admin' ? 'admin' : 'student' }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      token,
      user: { id: userId, name, email, role: email === 'admin' ? 'admin' : 'student' }
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Backup admin local verification
  if (email === 'admin' && password === '1234') {
    // Check if admin exists in DB first, otherwise create or just return custom JWT
    try {
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', ['admin']);
      let userId;
      if (users.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('1234', salt);
        const [result] = await db.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Administrator', 'admin', hashedPassword, 'admin']
        );
        userId = result.insertId;
        await db.query(
          'INSERT INTO user_progress (user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id=user_id',
          [userId]
        );
      } else {
        userId = users[0].id;
      }

      const token = jwt.sign({ id: userId, name: 'Administrator', email: 'admin', role: 'admin' }, JWT_SECRET, {
        expiresIn: '24h'
      });

      return res.status(200).json({
        token,
        user: { id: userId, name: 'Administrator', email: 'admin', role: 'admin' }
      });
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials. User does not exist.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get current user profile info
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
