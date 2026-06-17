/**
 * @file routes/students.js
 * @description Student admission & management API routes.
 *
 * POST   /api/students/apply        — Submit admission application (public)
 * GET    /api/students              — Get all students (admin, paginated)
 * PUT    /api/students/:id/status   — Approve/reject application (admin)
 * DELETE /api/students/:id          — Delete student (admin)
 * POST   /api/students/bulk-import  — Bulk import from CSV (admin)
 */
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { applyAdmission, getStudents, updateStatus, deleteStudent, bulkImportStudents, getMyApplications } = require('../controllers/studentController');

router.post('/apply', applyAdmission);
router.get('/my-applications', protect, getMyApplications);
router.get('/', protect, adminOnly, getStudents);
router.put('/:id/status', protect, adminOnly, updateStatus);
router.delete('/:id', protect, adminOnly, deleteStudent);
router.post('/bulk-import', protect, adminOnly, bulkImportStudents);

module.exports = router;
