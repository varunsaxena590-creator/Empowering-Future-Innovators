/**
 * @file pages/ResetPassword.js
 * @description Password reset page — enter OTP + new password.
 *
 * Flow: Enter email + OTP + new password → resetPassword() API → redirect /login
 * Background: 3 animated floating gradient orbs (purple)
 *
 * Data: resetPassword(email, otp, newPassword) API
 */
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { resetPassword } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const ResetPassword = () => {
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const inp = { width: '100%', padding: '0.85rem 1.2rem', background: c.bgInput, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, form.password);
      if (res.data.token) {
        login(res.data.token, res.data.user);
        toast.success('Password reset! You are now logged in.');
        navigate(res.data.user?.role === 'admin' ? '/admin' : '/portal');
      } else {
        setDone(true);
        toast.success('Password reset successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token invalid or expired. Request a new link.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (pwd) => {
    if (!pwd) return { label: '', color: 'transparent', width: '0%' };
    if (pwd.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' };
    if (pwd.length < 8) return { label: 'Weak', color: '#f59e0b', width: '50%' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: 'Strong', color: '#22c55e', width: '100%' };
    return { label: 'Medium', color: '#3b82f6', width: '75%' };
  };

  const s = strength(form.password);

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(212,175,55,0.07), transparent 70%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0 }} />

      <motion.div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>Z</div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 700, color: c.text, letterSpacing: '0.1em' }}>ZORVEX</span>
          </Link>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: c.text, marginTop: '1.5rem', fontWeight: 600 }}>Set New Password</h1>
          <p style={{ color: c.textDim, marginTop: '0.4rem', fontSize: '0.85rem' }}>Choose a strong password for your account</p>
        </div>

        <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem' }}>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: c.text, marginBottom: '0.5rem', fontWeight: 600 }}>Password Updated!</h3>
              <p style={{ color: c.textDim, fontSize: '0.85rem' }}>Your password has been changed successfully.</p>
              <Link to="/login" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: c.bgPrimary, fontWeight: 700, borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem' }}>
                Go to Login →
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* New Password */}
              <div>
                <label style={{ display: 'block', color: c.textMuted, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} required
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ ...inp, paddingRight: '3rem' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                    onBlur={(e) => e.target.style.borderColor = c.borderGold}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: c.textDim, cursor: 'pointer', fontSize: '1rem', padding: 0 }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <motion.div animate={{ width: s.width }} style={{ height: '100%', background: s.color, borderRadius: 4 }} transition={{ duration: 0.3 }} />
                    </div>
                    <p style={{ color: s.color, fontSize: '0.72rem', marginTop: '0.2rem' }}>{s.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', color: c.textMuted, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Confirm Password</label>
                <input type={showPass ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} required
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  style={{ ...inp, borderColor: form.confirm && form.confirm !== form.password ? 'rgba(239,68,68,0.5)' : c.borderGold }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.6)'}
                  onBlur={(e) => e.target.style.borderColor = form.confirm && form.confirm !== form.password ? 'rgba(239,68,68,0.5)' : c.borderGold}
                />
                {form.confirm && form.confirm !== form.password && (
                  <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.3rem' }}>Passwords don't match</p>
                )}
              </div>

              <button type="submit" disabled={loading || (form.confirm && form.password !== form.confirm)}
                style={{ padding: '0.9rem', background: loading ? c.textDim : 'linear-gradient(135deg, #d4af37, #f0c040)', color: c.bgPrimary, fontWeight: 700, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', fontFamily: 'Sora, sans-serif' }}>
                {loading ? 'Resetting...' : 'Reset Password →'}
              </button>
              <p style={{ textAlign: 'center', color: c.textDim, fontSize: '0.83rem' }}>
                <Link to="/forgot-password" style={{ color: c.textMuted, textDecoration: 'none' }}>Request new link</Link>
                {' · '}
                <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
