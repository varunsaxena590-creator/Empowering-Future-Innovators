/**
 * @file routes/reviews.js
 * @description Course review & rating API routes.
 *
 * GET    /api/reviews            — Get approved reviews (public)
 * POST   /api/reviews            — Submit a review (public, pending approval)
 * GET    /api/reviews/pending    — Get pending reviews (admin)
 * PUT    /api/reviews/:id/approve— Approve a review (admin)
 * DELETE /api/reviews/:id        — Delete review (admin)
 */
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams for nested routes
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/reviews?course=<id>   OR   /api/courses/:courseId/reviews
router.get('/', async (req, res) => {
  try {
    const courseId = req.params.courseId || req.query.course;
    const filter = { isApproved: true };
    if (courseId) filter.course = courseId;
    const reviews = await Review.find(filter).sort('-createdAt').limit(50);
    const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    res.json({ success: true, count: reviews.length, averageRating: Math.round(avg * 10) / 10, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews  (public — anyone can submit)
router.post('/', async (req, res) => {
  try {
    const { course, name, email, rating, title, comment, batch } = req.body;
    if (!course || !name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'course, name, rating and comment are required' });
    }
    // Check duplicate
    if (email) {
      const exists = await Review.findOne({ course, email });
      if (exists) return res.status(400).json({ success: false, message: 'You have already submitted a review for this course' });
    }
    const review = await Review.create({ course, name, email, rating, title, comment, batch, user: req.user?._id });
    res.status(201).json({ success: true, message: 'Review submitted and pending approval', data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/pending  (admin — all unapproved reviews)
router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false }).populate('course', 'title').sort('-createdAt');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/reviews/:id/approve  (admin)
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await Review.calcAverageRating(review.course);
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/reviews/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
