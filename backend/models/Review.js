const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  comment: { type: String, required: true },
  batch: { type: String },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.statics.calcAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId, isApproved: true } },
    { $group: { _id: '$course', avgRating: { $avg: '$rating' }, total: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await mongoose.model('Course').findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].total,
    });
  } else {
    await mongoose.model('Course').findByIdAndUpdate(courseId, { averageRating: 0, totalReviews: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.course);
});

reviewSchema.post('deleteOne', { document: true }, function () {
  this.constructor.calcAverageRating(this.course);
});

module.exports = mongoose.model('Review', reviewSchema);
