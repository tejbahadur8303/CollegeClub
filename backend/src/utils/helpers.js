exports.ok = (res, data, message = 'Success', code = 200) => res.status(code).json({ success: true, message, data });
exports.httpError = (status, message) => Object.assign(new Error(message), { status });
exports.wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
