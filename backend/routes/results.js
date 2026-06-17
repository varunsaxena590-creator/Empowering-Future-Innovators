/**
 * @file routes/results.js
 * @description Student results/marksheet API routes.
 *
 * GET    /api/results              — Get all results (admin)
 * GET    /api/results/roll/:roll   — Get result by roll number (student search)
 * POST   /api/results              — Create result (admin)
 * DELETE /api/results/:id          — Delete result (admin)
 */
const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { protect, adminOnly } = require('../middleware/auth');

// GET result by roll number (public)
router.get('/roll/:rollNumber', async (req, res) => {
  try {
    const results = await Result.find({ rollNumber: req.params.rollNumber.toUpperCase() })
      .populate('course', 'title')
      .sort({ semester: 1 });
    if (!results.length) return res.status(404).json({ success: false, message: 'No results found for this roll number' });
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all results (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const results = await Result.find().populate('course', 'title').sort({ createdAt: -1 });
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create result (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update result (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
