/**
 * @file pages/ForgotPassword.js
 * @description Password recovery page — sends OTP to email.
 *
 * Flow: Enter email → forgotPassword() API → OTP sent → redirect to /reset-password
 * Background: 3 animated floating gradient orbs (purple)
 *
 * Data: forgotPassword(email) API
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { forgotPassword } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const inp = { width: '100%', padding: '0.85rem 1.2rem', background: c.bgInput, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(212,175,55,0.07), transparent 70%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0 }} />

      <motion.div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>Z</div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 700, color: c.text, letterSpacing: '0.1em' }}>ZORVEX</span>
          </Link>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: c.text, marginTop: '1.5rem', fontWeight: 600 }}>Reset Password</h1>
          <p style={{ color: c.textDim, marginTop: '0.4rem', fontSize: '0.85rem' }}>Enter your email to receive a reset link</p>
        </div>

        <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem' }}>
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
              <h3 style={{ color: c.text, marginBottom: '0.5rem', fontWeight: 600 }}>Check Your Email</h3>
              <p style={{ color: c.textDim, fontSize: '0.85rem', lineHeight: 1.7 }}>
                If <strong style={{ color: '#d4af37' }}>{email}</strong> is registered, you'll receive a password reset link shortly.
              </p>
              <p style={{ color: c.textDim, fontSize: '0.75rem', marginTop: '1rem' }}>Didn't get it? Check your spam folder.</p>
              <Link to="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#d4af37', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                ← Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', color: c.textMuted, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Email Address</label>
                <input
                  type="email" placeholder="you@example.com" value={email} required
                  onChange={(e) => setEmail(e.target.value)}
                  style={inp}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = c.borderGold}
                />
              </div>
              <button type="submit" disabled={loading}
                style={{ padding: '0.9rem', background: loading ? c.textDim : 'linear-gradient(135deg, #d4af37, #f0c040)', color: c.bgPrimary, fontWeight: 700, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', fontFamily: 'Sora, sans-serif' }}>
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
              <p style={{ textAlign: 'center', color: c.textDim, fontSize: '0.83rem' }}>
                Remember it?{' '}
                <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
