const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { tokenBlocklist } = require('../middleware/authMiddleware');
require('dotenv').config();

// Fail hard if JWT_SECRET is not configured
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server cannot start securely.');
  process.exit(1);
}

// Password complexity validation helper
const validatePasswordComplexity = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one digit';
  }
  return null; // valid
};

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  // Validate password complexity
  const passwordError = validatePasswordComplexity(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
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

    // Insert user — always 'student' role; admins are created via DB seed only
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'student']
    );

    const userId = result.insertId;

    // Initialize user progress summary
    await connection.query(
      'INSERT INTO user_progress (user_id, streak, total_completed, total_quizzes, total_quiz_score) VALUES (?, 0, 0, 0, 0)',
      [userId]
    );

    await connection.commit();
    connection.release();

    // Generate JWT — store only the user ID; role is fetched from DB on each request
    const token = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      token,
      user: { id: userId, name, email, role: 'student' }
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

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Generic message to prevent user enumeration
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Same generic message to prevent user enumeration
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Store only user ID in token — role is fetched from DB by authMiddleware
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
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

// Logout — revoke the current token
exports.logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    tokenBlocklist.add(token);
  }

  res.status(200).json({ message: 'Logged out successfully' });
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
