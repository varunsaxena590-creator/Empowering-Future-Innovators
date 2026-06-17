const express = require('express');
const rateLimit = require('express-rate-limit');
const { chatWithAssistant } = require('../controllers/assistantController');

const router = express.Router();

const assistantLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { success: false, message: 'Too many assistant requests. Please try again in a few minutes.' },
});

router.post('/chat', assistantLimiter, chatWithAssistant);

module.exports = router;

