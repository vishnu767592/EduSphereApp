const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No authentication token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'edusphere_jwt_secret_token_key_2026_db');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token is not valid or has expired' });
  }
};

module.exports = authMiddleware;
