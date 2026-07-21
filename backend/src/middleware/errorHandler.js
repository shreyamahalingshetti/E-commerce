const errorHandler = (err, req, res, next) => {
  console.error('Server error details:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.error?.description || err.message || 'Internal server error';

  res.status(status).json({
    error: message
  });
};

module.exports = errorHandler;
