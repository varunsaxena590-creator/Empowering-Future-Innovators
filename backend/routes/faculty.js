/**
 * @file routes/faculty.js
 * @description Faculty management API routes.
 *
 * GET    /api/faculty       — Get all faculty (public)
 * POST   /api/faculty       — Add faculty with photo (admin)
 * PUT    /api/faculty/:id   — Update faculty (admin)
 * DELETE /api/faculty/:id   — Delete faculty (admin)
 */
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadFaculty } = require('../config/cloudinary');
const { getFaculty, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');

router.get('/', getFaculty);
router.post('/', protect, adminOnly, uploadFaculty.single('image'), createFaculty);
router.put('/:id', protect, adminOnly, updateFaculty);
router.delete('/:id', protect, adminOnly, deleteFaculty);

module.exports = router;
