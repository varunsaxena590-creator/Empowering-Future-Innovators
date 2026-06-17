const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  role: { type: String },
  package: { type: Number }, // in LPA
  batch: { type: Number },
  course: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Placement', placementSchema);
