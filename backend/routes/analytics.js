/**
 * @file routes/analytics.js
 * @description Admin analytics & reporting API routes.
 *
 * GET /api/analytics/summary — Dashboard stats: total students, courses, contacts,
 *     application status breakdown, monthly trends (6 months), course popularity
 *
 * Protected: admin only
 */
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// GET analytics summary (admin only)
router.get('/summary', protect, adminOnly, async (req, res) => {
  try {
    const [totalStudents, totalCourses, totalContacts] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Contact.countDocuments(),
    ]);

    // Applications by status
    const statusAgg = await Student.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Applications per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyAgg = await Student.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Course popularity (students per course)
    const courseAgg = await Student.aggregate([
      { $match: { course: { $exists: true } } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'courseInfo' } },
      { $unwind: { path: '$courseInfo', preserveNullAndEmptyArrays: true } },
    ]);

    res.json({
      success: true,
      data: {
        totals: { students: totalStudents, courses: totalCourses, contacts: totalContacts },
        statusBreakdown: statusAgg,
        monthlyApplications: monthlyAgg,
        coursePopularity: courseAgg,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
