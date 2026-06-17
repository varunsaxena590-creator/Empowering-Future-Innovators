/**
 * @file routes/auth.js
 * @description Authentication API routes.
 *
 * POST   /api/auth/register          — Register new user
 * POST   /api/auth/login             — Login & get JWT token
 * GET    /api/auth/me                — Get current user (protected)
 * PUT    /api/auth/profile           — Update profile (protected)
 * PUT    /api/auth/change-password   — Change password (protected)
 * POST   /api/auth/forgot-password   — Request password reset email
 * PUT    /api/auth/reset-password/:token — Reset password with token
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  register, login, getMe, updateProfile,
  changePassword, forgotPassword, resetPassword,
  verifyOTP, resendOTP
} = require('../controllers/authController');

router.post('/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validate, register
);
router.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate, login
);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);
router.put('/reset-password/:token', [body('password').isLength({ min: 6 })], validate, resetPassword);
router.post('/verify-otp', [body('email').isEmail(), body('otp').isLength({ min: 6, max: 6 })], validate, verifyOTP);
router.post('/resend-otp', [body('email').isEmail()], validate, resendOTP);

module.exports = router;
