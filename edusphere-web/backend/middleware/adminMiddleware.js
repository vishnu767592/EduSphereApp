// Middleware that enforces admin role.
// Must be used AFTER authMiddleware (which populates req.user from DB).
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin privilege required' });
  }
  next();
};

module.exports = adminMiddleware;
