export const errorHandler = (error, req, res, next) => {
  console.error(error);
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'Email already exists' });
  }
  res.status(error.status || 500).json({
    message: error.status ? error.message : 'Internal server error'
  });
};
