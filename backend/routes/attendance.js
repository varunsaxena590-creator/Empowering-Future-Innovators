const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAttendance, markAttendance, getAttendanceStats, deleteAttendance,
} = require('../controllers/attendanceController');

router.get('/', protect, adminOnly, getAttendance);
router.post('/', protect, adminOnly, markAttendance);
router.get('/stats', protect, adminOnly, getAttendanceStats);
router.delete('/:id', protect, adminOnly, deleteAttendance);

module.exports = router;
