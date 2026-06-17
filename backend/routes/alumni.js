/**
 * @file routes/alumni.js
 * @description Alumni network API routes.
 *
 * GET    /api/alumni       — Get alumni (public, filterable by batch/company)
 * POST   /api/alumni       — Create alumni record (admin)
 * DELETE /api/alumni/:id   — Delete alumni (admin)
 */
const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');
const { protect, adminOnly } = require('../middleware/auth');

// GET all alumni (public)
router.get('/', async (req, res) => {
  try {
    const { batch, featured, search } = req.query;
    let query = {};
    if (batch) query.batch = Number(batch);
    if (featured === 'true') query.featured = true;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { company: { $regex: escaped, $options: 'i' } },
        { currentRole: { $regex: escaped, $options: 'i' } },
      ];
    }
    const alumni = await Alumni.find(query).sort({ featured: -1, batch: -1 });
    res.json({ success: true, data: alumni });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create alumni (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const alumni = await Alumni.create(req.body);
    res.status(201).json({ success: true, data: alumni });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE alumni (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Alumni record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
