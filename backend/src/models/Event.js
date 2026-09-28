const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Technical','Cultural','Sports','Workshop','Competition','Seminar','Other'] },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  organizer: { type: String, required: true },
  registrationDeadline: { type: Date, required: true },
  maxParticipants: { type: Number, required: true, min: 1 },
  registrationCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true } });
schema.virtual('availableSeats').get(function () { return Math.max(0, this.maxParticipants - this.registrationCount); });
schema.virtual('registrationOpen').get(function () { return new Date() <= this.registrationDeadline && this.registrationCount < this.maxParticipants; });
module.exports = mongoose.models.Event || mongoose.model('Event', schema);
