const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, trim: true },
  url: { type: String, required: true },
  publicId: { type: String },
  category: {
    type: String,
    enum: ['Campus', 'Events', 'Sports', 'Cultural', 'Labs', 'Library', 'Other'],
    default: 'Other',
  },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
