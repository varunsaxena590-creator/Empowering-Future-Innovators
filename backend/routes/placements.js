/**
 * @file routes/placements.js
 * @description Placement records API routes.
 *
 * GET    /api/placements       — Get placements (public, filterable)
 * GET    /api/placements/stats  — Get placement statistics
 * POST   /api/placements       — Create placement record (admin)
 * DELETE /api/placements/:id   — Delete placement (admin)
 */
const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement');
const { protect, adminOnly } = require('../middleware/auth');

// GET all placements (public)
router.get('/', async (req, res) => {
  try {
    const { batch, featured } = req.query;
    let query = {};
    if (batch) query.batch = Number(batch);
    if (featured === 'true') query.featured = true;
    const placements = await Placement.find(query).sort({ package: -1 });
    res.json({ success: true, data: placements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET placement stats (public)
router.get('/stats', async (req, res) => {
  try {
    const total = await Placement.countDocuments();
    const agg = await Placement.aggregate([
      { $group: { _id: null, avgPackage: { $avg: '$package' }, maxPackage: { $max: '$package' }, totalPlaced: { $sum: 1 } } }
    ]);
    const companies = await Placement.distinct('company');
    res.json({ success: true, data: { total, companies: companies.length, ...(agg[0] || {}) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create placement (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const placement = await Placement.create(req.body);
    res.status(201).json({ success: true, data: placement });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE placement (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Placement record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
