export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const status = err?.status || err?.statusCode || 500;
  const message = err?.message || 'Server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ error: message });
};

