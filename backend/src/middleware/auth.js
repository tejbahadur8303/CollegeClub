const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const fail = (res, code, message) => res.status(code).json({ success: false, message });
exports.protect = async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) return fail(res, 401, 'Not authenticated');
    const { id } = jwt.verify(h.slice(7), process.env.JWT_SECRET);
    const user = await Admin.findById(id);
    if (!user) return fail(res, 401, 'User no longer exists');
    req.user = user; next();
  } catch (e) { next(e); }
};
exports.adminOnly = (req, res, next) => req.user?.role === 'admin' ? next() : fail(res, 403, 'Admin access required');
