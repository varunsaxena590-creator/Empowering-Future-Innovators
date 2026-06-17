const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String },
  department: { type: String },
  qualification: { type: String },
  experience: { type: String },
  email: { type: String, lowercase: true },
  phone: { type: String },
  image: { type: String },
  bio: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
