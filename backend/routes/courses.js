/**
 * @file routes/courses.js
 * @description Course management API routes.
 *
 * GET    /api/courses       — Get all active courses (public)
 * GET    /api/courses/:id   — Get single course (public)
 * POST   /api/courses       — Create course (admin only)
 * PUT    /api/courses/:id   — Update course (admin only)
 * DELETE /api/courses/:id   — Delete course (admin only)
 */
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;
