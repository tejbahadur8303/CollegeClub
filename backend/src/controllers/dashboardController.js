const Event = require('../models/Event'), Club = require('../models/Club'), Membership = require('../models/Membership'), Registration = require('../models/Registration');
const { ok, wrap } = require('../utils/helpers');
exports.stats = wrap(async (req, res) => {
  const now = new Date(), start = new Date(); start.setHours(0, 0, 0, 0);
  const from = new Date(start); from.setDate(from.getDate() - 6);
  const [totalClubs, totalEvents, upcomingEvents, totalMembers, totalRegistrations, todayRegistrations, todayMembers, raw] = await Promise.all([
    Club.countDocuments(), Event.countDocuments(), Event.countDocuments({ date: { $gte: now } }), Membership.countDocuments(), Registration.countDocuments(),
    Registration.countDocuments({ registeredAt: { $gte: start } }), Membership.countDocuments({ joinedAt: { $gte: start } }),
    Registration.aggregate([{ $match: { registeredAt: { $gte: from } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' } }, count: { $sum: 1 } } }]),
  ]);
  const map = Object.fromEntries(raw.map(r => [r._id, r.count]));
  const trends = Array.from({ length: 7 }, (_, i) => { const d = new Date(from); d.setDate(d.getDate() + i); const k = d.toISOString().slice(0, 10); return { date: k, count: map[k] || 0 }; });
  ok(res, { totalClubs, totalEvents, upcomingEvents, totalMembers, totalRegistrations, todayRegistrations, todayMembers, trends });
});
exports.recentEvents = wrap(async (req, res) => ok(res, await Event.find().populate('club', 'name').sort({ createdAt: -1 }).limit(5)));
exports.recentRegistrations = wrap(async (req, res) => ok(res, await Registration.find().populate('event', 'title').populate('club', 'name').sort({ registeredAt: -1 }).limit(8)));
exports.recentMembers = wrap(async (req, res) => ok(res, await Membership.find().populate('club', 'name').sort({ joinedAt: -1 }).limit(8)));
exports.clubBreakdown = wrap(async (req, res) => {
  const [clubs, regs] = await Promise.all([Club.find().select('name memberCount').lean(), Registration.aggregate([{ $group: { _id: '$club', n: { $sum: 1 } } }])]);
  const m = Object.fromEntries(regs.map(r => [String(r._id), r.n]));
  ok(res, clubs.map(c => ({ _id: c._id, name: c.name, members: c.memberCount, registrations: m[String(c._id)] || 0 })));
});
