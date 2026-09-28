const Club = require('../models/Club'), Membership = require('../models/Membership');
const { ok, httpError, wrap, esc } = require('../utils/helpers');
exports.create = wrap(async (req, res) => {
  const { club: clubId, name, email, college, year, phone } = req.body;
  const club = await Club.findById(clubId);
  if (!club) throw httpError(404, 'Club not found');
  try {
    const m = await Membership.create({ club: clubId, name, email, college, year, phone });
    await Club.updateOne({ _id: clubId }, { $inc: { memberCount: 1 } });
    ok(res, { membershipId: m.membershipId, clubName: club.name, name: m.name }, 'Joined club successfully', 201);
  } catch (e) {
    if (e.code === 11000) throw httpError(409, 'This email has already joined this club');
    throw e;
  }
});
exports.list = wrap(async (req, res) => {
  const { search, club } = req.query;
  const page = Math.max(1, +req.query.page || 1), limit = Math.min(2000, +req.query.limit || 20);
  const q = {};
  if (club) q.club = club;
  if (search) { const r = { $regex: esc(search), $options: 'i' }; q.$or = [{ name: r }, { email: r }, { membershipId: r }]; }
  const total = await Membership.countDocuments(q);
  const memberships = await Membership.find(q).populate('club', 'name').sort({ joinedAt: -1 }).skip((page - 1) * limit).limit(limit);
  ok(res, { memberships, total, page, pages: Math.ceil(total / limit) });
});
exports.remove = wrap(async (req, res) => {
  const m = await Membership.findByIdAndDelete(req.params.id);
  if (!m) throw httpError(404, 'Membership not found');
  await Club.updateOne({ _id: m.club, memberCount: { $gt: 0 } }, { $inc: { memberCount: -1 } });
  ok(res, {}, 'Membership deleted');
});
