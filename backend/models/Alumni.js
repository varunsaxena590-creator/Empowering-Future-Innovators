const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  batch: { type: Number },
  course: { type: String },
  company: { type: String },
  currentRole: { type: String },
  location: { type: String },
  image: { type: String },
  linkedin: { type: String },
  featured: { type: Boolean, default: false },
  testimonial: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
