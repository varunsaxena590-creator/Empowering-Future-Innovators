const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect, adminOnly } = require('../middleware/auth');

// GET all active chats (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const chats = await Chat.find({ status: 'active' }).sort('-lastActivity');
    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single chat by sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: req.params.sessionId });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    res.json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT close chat (admin)
router.put('/:sessionId/close', protect, adminOnly, async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { status: 'closed' },
      { new: true }
    );
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    res.json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE chat (admin)
router.delete('/:sessionId', protect, adminOnly, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ success: true, message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
