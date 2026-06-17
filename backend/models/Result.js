const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  grade: { type: String },
});

const resultSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, uppercase: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  semester: { type: Number, required: true },
  subjects: [subjectSchema],
  totalMarks: { type: Number },
  percentage: { type: Number },
  grade: { type: String },
  status: { type: String, enum: ['Pass', 'Fail', 'Withheld'], default: 'Pass' },
  remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
