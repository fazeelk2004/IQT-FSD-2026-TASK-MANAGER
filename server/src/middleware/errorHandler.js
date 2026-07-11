export default function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for '${err.path}'`;
  }

  if (status >= 500) {
    console.error('[Error]', err);
  } else {
    console.error('[Error]', message);
  }

  if (status >= 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  res.status(status).json({ success: false, message });
}
