/**
 * @file routes/notices.js
 * @description Notice board API routes.
 *
 * GET    /api/notices       — Get notices (public, filterable by category/search)
 * POST   /api/notices       — Create notice (admin)
 * PUT    /api/notices/:id   — Update notice (admin)
 * DELETE /api/notices/:id   — Delete notice (admin)
 */
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, adminOnly } = require('../middleware/auth');

// GET all notices (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { content: { $regex: escaped, $options: 'i' } },
      ];
    }
    const notices = await Notice.find(query).sort({ pinned: -1, createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create notice (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update notice (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE notice (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
