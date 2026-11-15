export function notFound(req,res) { res.status(404).json({ message: `Route ${req.originalUrl} not found` }); }
export function errorHandler(err,req,res,next) {
  if (res.headersSent) return next(err);
  let code = err.statusCode || err.status || 500;
  let message = err.message || 'Server error';
  if (err.name === 'ValidationError') { code = 400; message = Object.values(err.errors).map(v=>v.message).join(', '); }
  if (err.name === 'CastError') { code = 400; message = 'Invalid ID or value'; }
  if (err.code === 11000) { code = 409; message = `Already exists: ${Object.keys(err.keyPattern || {}).join(', ')}`; }
  if (err.code === 'LIMIT_FILE_SIZE') { code = 400; message = 'Image maximum size is 5 MB'; }
  if (code >= 500) console.error(err);
  res.status(code).json({ message: code >= 500 && process.env.NODE_ENV === 'production' ? 'Server error' : message });
}
