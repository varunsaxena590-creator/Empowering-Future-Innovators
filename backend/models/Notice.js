const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['General', 'Exam', 'Admission', 'Event', 'Holiday', 'Result', 'Placement'],
    default: 'General',
  },
  pinned: { type: Boolean, default: false },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
