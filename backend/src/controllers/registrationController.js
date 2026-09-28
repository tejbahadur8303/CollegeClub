const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { ok, httpError, wrap, esc } = require('../utils/helpers');
exports.create = wrap(async (req, res) => {
  const { event: eventId, name, email, college, year, phone } = req.body;
  const ev = await Event.findById(eventId).populate('club', 'name');
  if (!ev) throw httpError(404, 'Event not found');
  if (new Date() > ev.registrationDeadline) throw httpError(400, 'Registration deadline has passed');
  if (await Registration.exists({ event: eventId, email: email.toLowerCase() })) throw httpError(409, 'This email is already registered for this event');
  const reserved = await Event.findOneAndUpdate({ _id: eventId, registrationCount: { $lt: ev.maxParticipants } }, { $inc: { registrationCount: 1 } });
  if (!reserved) throw httpError(400, 'Event is full');
  try {
    const reg = await Registration.create({ event: eventId, club: ev.club._id, name, email, college, year, phone });
    ok(res, { registrationId: reg.registrationId, eventTitle: ev.title, clubName: ev.club.name, name: reg.name }, 'Registration successful', 201);
  } catch (e) {
    await Event.updateOne({ _id: eventId }, { $inc: { registrationCount: -1 } });
    if (e.code === 11000) throw httpError(409, 'This email is already registered for this event');
    throw e;
  }
});
exports.list = wrap(async (req, res) => {
  const { search, event, year, date, club } = req.query;
  const page = Math.max(1, +req.query.page || 1), limit = Math.min(2000, +req.query.limit || 20);
  const q = {};
  if (search) { const r = { $regex: esc(search), $options: 'i' }; q.$or = [{ name: r }, { email: r }, { registrationId: r }]; }
  if (event) q.event = event;
  if (club) q.club = club;
  if (year) q.year = year;
  if (date) { const d = new Date(date); q.registeredAt = { $gte: d, $lt: new Date(+d + 864e5) }; }
  const total = await Registration.countDocuments(q);
  const registrations = await Registration.find(q).populate('event', 'title').populate('club', 'name').sort({ registeredAt: -1 }).skip((page - 1) * limit).limit(limit);
  ok(res, { registrations, total, page, pages: Math.ceil(total / limit) });
});
exports.get = wrap(async (req, res) => {
  const r = await Registration.findById(req.params.id).populate('event', 'title date venue').populate('club', 'name');
  if (!r) throw httpError(404, 'Registration not found');
  ok(res, r);
});
exports.remove = wrap(async (req, res) => {
  const r = await Registration.findByIdAndDelete(req.params.id);
  if (!r) throw httpError(404, 'Registration not found');
  await Event.updateOne({ _id: r.event, registrationCount: { $gt: 0 } }, { $inc: { registrationCount: -1 } });
  ok(res, {}, 'Registration deleted');
});
