const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  registrationId: { type: String, unique: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  college: { type: String, required: true, trim: true },
  year: { type: String, required: true, enum: ['1st Year','2nd Year','3rd Year','4th Year'] },
  phone: { type: String, required: true, match: /^\d{10}$/ },
  status: { type: String, default: 'Confirmed' },
  registeredAt: { type: Date, default: Date.now },
});
schema.index({ event: 1, email: 1 }, { unique: true });
schema.pre('validate', function (next) {
  if (!this.registrationId) this.registrationId = `REG-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
  next();
});
module.exports = mongoose.models.Registration || mongoose.model('Registration', schema);
