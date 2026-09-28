const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { ok, httpError, wrap } = require('../utils/helpers');
const sign = u => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const pub = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });
exports.login = wrap(async (req, res) => {
  const user = await Admin.findOne({ email: req.body.email.toLowerCase() }).select('+password');
  if (!user || !(await user.matches(req.body.password))) throw httpError(401, 'Invalid email or password');
  if (user.role !== 'admin') throw httpError(403, 'Admin access required');
  ok(res, { token: sign(user), user: pub(user) }, 'Login successful');
});
// Only allowed for initial setup (when no admin exists yet)
exports.register = wrap(async (req, res) => {
  if (await Admin.countDocuments()) throw httpError(403, 'Admin registration is disabled');
  const user = await Admin.create(req.body);
  ok(res, { token: sign(user), user: pub(user) }, 'Admin created', 201);
});
exports.me = wrap(async (req, res) => ok(res, pub(req.user)));
