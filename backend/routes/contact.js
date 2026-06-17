/**
 * @file routes/contact.js
 * @description Contact form API routes.
 *
 * POST   /api/contact          — Submit contact message (public)
 * GET    /api/contact          — Get all messages (admin)
 * PUT    /api/contact/:id/read — Mark as read (admin)
 * DELETE /api/contact/:id      — Delete message (admin)
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const { submitContact, getContacts, markRead, deleteContact } = require('../controllers/contactController');

router.post('/',
  [body('name').notEmpty(), body('email').isEmail(), body('subject').notEmpty(), body('message').notEmpty()],
  validate, submitContact
);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markRead);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
