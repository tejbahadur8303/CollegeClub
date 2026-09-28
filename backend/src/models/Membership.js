const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  membershipId: { type: String, unique: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  college: { type: String, required: true, trim: true },
  year: { type: String, required: true, enum: ['1st Year','2nd Year','3rd Year','4th Year'] },
  phone: { type: String, required: true, match: /^\d{10}$/ },
  joinedAt: { type: Date, default: Date.now },
});
schema.index({ club: 1, email: 1 }, { unique: true });
schema.pre('validate', function (next) {
  if (!this.membershipId) this.membershipId = `MEM-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
  next();
});
module.exports = mongoose.models.Membership || mongoose.model('Membership', schema);
