const mongoose = require('mongoose');
const Club = require('../models/Club'), Event = require('../models/Event'), Registration = require('../models/Registration'), Membership = require('../models/Membership');
const { ok, httpError, wrap } = require('../utils/helpers');
const pick = b => ({ name: b.name, category: b.category, description: b.description, logo: b.logo || '' });
exports.list = wrap(async (req, res) => ok(res, await Club.find().sort({ name: 1 })));
exports.get = wrap(async (req, res) => {
  const id = req.params.id;
  const c = await Club.findOne(mongoose.isValidObjectId(id) ? { _id: id } : { slug: id });
  if (!c) throw httpError(404, 'Club not found');
  ok(res, c);
});
exports.create = wrap(async (req, res) => ok(res, await Club.create(pick(req.body)), 'Club created successfully', 201));
exports.update = wrap(async (req, res) => {
  const c = await Club.findById(req.params.id);
  if (!c) throw httpError(404, 'Club not found');
  c.set(pick(req.body)); await c.save();
  ok(res, c, 'Club updated successfully');
});
exports.remove = wrap(async (req, res) => {
  const c = await Club.findByIdAndDelete(req.params.id);
  if (!c) throw httpError(404, 'Club not found');
  await Promise.all([Event.deleteMany({ club: c._id }), Registration.deleteMany({ club: c._id }), Membership.deleteMany({ club: c._id })]);
  ok(res, {}, 'Club deleted successfully');
});
