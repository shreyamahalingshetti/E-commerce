const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err);

  const status = err.status || err.statusCode || 500;
  // If status is 500 or it's a database error, sanitize message to avoid leaking raw DB details
  const isDbError = err.code || err.routine || err.severity;
  const message = (isDbError || status === 500) ? 'Internal server error' : (err.message || 'Internal server error');

  res.status(status).json({
    error: message
  });
};

module.exports = errorHandler;
