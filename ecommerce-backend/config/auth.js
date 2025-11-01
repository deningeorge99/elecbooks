const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await query('SELECT id, username, email, role FROM users WHERE id = $1', [decoded.id]);
    
    if (!user.rows.length) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { auth, authorize };