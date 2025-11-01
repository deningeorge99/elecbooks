const adminErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.code === '23505') { // Unique violation in PostgreSQL
    return res.status(400).json({ message: 'Duplicate entry' });
  }
  
  if (err.code === '23503') { // Foreign key violation in PostgreSQL
    return res.status(400).json({ message: 'Referenced entity not found' });
  }
  
  res.status(500).json({ message: 'Internal server error' });
};

module.exports = adminErrorHandler;