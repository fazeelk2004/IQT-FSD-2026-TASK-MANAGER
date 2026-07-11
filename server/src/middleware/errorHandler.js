export default function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  console.error('Error', err.message);

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
