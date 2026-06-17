const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  description: { type: String },
  duration: { type: String },
  seats: { type: Number },
  fees: { type: Number },
  category: { type: String },
  eligibility: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
