const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// In-memory token blocklist for logout support.
// In production, use Redis or a database table instead.
const tokenBlocklist = new Set();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No authentication token, authorization denied' });
  }

  // Fail hard if JWT_SECRET is not configured — never use a hardcoded fallback
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('FATAL: JWT_SECRET environment variable is not set.');
    return res.status(500).json({ message: 'Server misconfiguration' });
  }

  // Check if token has been revoked (logout)
  if (tokenBlocklist.has(token)) {
    return res.status(401).json({ message: 'Token has been revoked' });
  }

  try {
    const decoded = jwt.verify(token, secret);

    // Fetch the current role from the database instead of trusting the JWT payload.
    // This prevents privilege escalation via forged tokens and supports real-time role changes.
    const [users] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token is not valid or has expired' });
  }
};

// Export the blocklist so the logout controller can add tokens to it
module.exports = authMiddleware;
module.exports.tokenBlocklist = tokenBlocklist;
