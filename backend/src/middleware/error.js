const { validationResult } = require('express-validator');
exports.validate = (req, res, next) => {
  const r = validationResult(req);
  if (r.isEmpty()) return next();
  res.status(400).json({ success: false, message: r.array()[0].msg, errors: r.array().map(e => ({ field: e.path, message: e.msg })) });
};
exports.sanitize = (req, res, next) => {
  const clean = o => { if (o && typeof o === 'object') for (const k of Object.keys(o)) { if (k.startsWith('$') || k.includes('.')) delete o[k]; else clean(o[k]); } };
  clean(req.body); clean(req.query); clean(req.params); next();
};
exports.notFound = (req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
exports.errorHandler = (err, req, res, next) => {
  let code = err.status || 500, message = err.message || 'Something went wrong';
  if (err.name === 'ValidationError') { code = 400; message = Object.values(err.errors)[0].message; }
  if (err.name === 'CastError') { code = 404; message = 'Resource not found'; }
  if (err.code === 11000) { code = 409; message = 'Duplicate entry'; }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') { code = 401; message = 'Invalid or expired token'; }
  if (code === 500) console.error(err);
  res.status(code).json({ success: false, message: code === 500 && process.env.NODE_ENV === 'production' ? 'Something went wrong' : message });
};
