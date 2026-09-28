const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});
schema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
  next();
});
schema.methods.matches = function (pw) { return bcrypt.compare(pw, this.password); };
module.exports = mongoose.models.Admin || mongoose.model('Admin', schema);
