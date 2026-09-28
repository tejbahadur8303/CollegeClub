const Event = require('../models/Event'), Club = require('../models/Club'), Registration = require('../models/Registration');
const { ok, httpError, wrap, esc } = require('../utils/helpers');
const FIELDS = ['club','title','category','description','image','date','time','venue','organizer','registrationDeadline','maxParticipants','featured'];
const pick = b => Object.fromEntries(FIELDS.filter(f => b[f] !== undefined).map(f => [f, b[f]]));
exports.list = wrap(async (req, res) => {
  const { search, category, status, featured, club } = req.query;
  const page = Math.max(1, +req.query.page || 1), limit = Math.min(100, +req.query.limit || 10);
  const q = {};
  if (search) q.title = { $regex: esc(search), $options: 'i' };
  if (club) q.club = club;
  if (category && category.toLowerCase() !== 'all') q.category = { $regex: `^${esc(category)}$`, $options: 'i' };
  const now = new Date();
  if (status === 'upcoming') q.date = { $gte: now };
  if (status === 'past') q.date = { $lt: now };
  if (featured === 'true') q.featured = true;
  const total = await Event.countDocuments(q);
  const events = await Event.find(q).populate('club', 'name slug').sort({ date: status === 'past' ? -1 : 1 }).skip((page - 1) * limit).limit(limit);
  ok(res, { events, total, page, pages: Math.ceil(total / limit) });
});
exports.publicStats = wrap(async (req, res) => {
  const now = new Date();
  const [totalClubs, totalEvents, upcomingEvents, workshops, agg] = await Promise.all([
    Club.countDocuments(), Event.countDocuments(), Event.countDocuments({ date: { $gte: now } }), Event.countDocuments({ category: 'Workshop' }),
    Event.aggregate([{ $group: { _id: null, n: { $sum: '$registrationCount' } } }]),
  ]);
  ok(res, { totalClubs, totalEvents, upcomingEvents, workshops, participants: agg[0]?.n || 0 });
});
exports.get = wrap(async (req, res) => {
  const e = await Event.findById(req.params.id).populate('club', 'name slug');
  if (!e) throw httpError(404, 'Event not found');
  ok(res, e);
});
exports.create = wrap(async (req, res) => {
  if (!(await Club.exists({ _id: req.body.club }))) throw httpError(400, 'Selected club does not exist');
  ok(res, await Event.create(pick(req.body)), 'Event created successfully', 201);
});
exports.update = wrap(async (req, res) => {
  const e = await Event.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!e) throw httpError(404, 'Event not found');
  if (req.body.club) await Registration.updateMany({ event: e._id }, { club: e.club });
  ok(res, e, 'Event updated successfully');
});
exports.remove = wrap(async (req, res) => {
  const e = await Event.findByIdAndDelete(req.params.id);
  if (!e) throw httpError(404, 'Event not found');
  await Registration.deleteMany({ event: e._id });
  ok(res, {}, 'Event deleted successfully');
});
