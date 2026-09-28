const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true },
  category: { type: String, required: true, enum: ['Technical','Cultural','Sports','Workshop','Competition','Seminar','Other'] },
  description: { type: String, required: true },
  logo: { type: String, default: '' },
  memberCount: { type: Number, default: 0 },
}, { timestamps: true });
schema.pre('validate', function (next) {
  if (this.name) this.slug = this.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  next();
});
module.exports = mongoose.models.Club || mongoose.model('Club', schema);
