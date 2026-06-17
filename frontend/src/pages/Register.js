/**
 * @file pages/Register.js
 * @description User registration page with password strength meter.
 *
 * Form: name, email, password + strength meter (5 levels), confirm password
 * Strength: Weak → Fair → Good → Strong → Excellent (color-coded bars)
 * Background: 3 animated floating gradient orbs (purple dominant)
 *
 * Data: registerUser() API → saves JWT → redirects to home
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const c = getColors(isDark);

  const inp = { width: '100%', padding: '0.75rem 1rem', background: c.bgInput, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.88rem', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#d4af37'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      toast.success('OTP sent to your email! Please verify.');
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const focusStyle = (e) => { e.target.style.borderColor = 'rgba(212,175,55,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)'; };
  const blurStyle = (e) => { e.target.style.borderColor = c.borderGold; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Animated orbs */}
      <motion.div animate={{ x: [0, -35, 20, 0], y: [0, 30, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '10%', right: '10%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 65%)', pointerEvents: 'none' }} />
      <motion.div animate={{ x: [0, 30, -15, 0], y: [0, -25, 20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{ position: 'absolute', bottom: '15%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(212,175,55,0.08), transparent 65%)', pointerEvents: 'none' }} />
      <motion.div animate={{ x: [0, 15, -25, 0], y: [0, 20, -10, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        style={{ position: 'absolute', top: '55%', right: '35%', width: 220, height: 220, background: 'radial-gradient(circle, rgba(212,175,55,0.05), transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0 }} />

      <motion.div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <motion.div whileHover={{ scale: 1.05, rotate: 3 }} style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #7c3aed, #d4af37)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '1.4rem', color: '#fff', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>Z</motion.div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 700, color: c.text, letterSpacing: '0.1em' }}>ZORVEX</span>
          </Link>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: c.text, marginTop: '1.25rem', fontWeight: 700 }}>Create Account</h1>
          <p style={{ color: c.textDim, marginTop: '0.35rem', fontSize: '0.84rem' }}>Join 12,000+ students at Zorvex Institute</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: c.bgCardAlpha, backdropFilter: 'blur(20px)', border: `1px solid ${c.borderGold}`, borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Full Name *</label>
            <input type="text" placeholder="e.g. Varun Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inp} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Email Address *</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={inp} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ ...inp, paddingRight: '3rem' }} onFocus={focusStyle} onBlur={blurStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: c.textDim, cursor: 'pointer', fontSize: '1rem', padding: 0 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Strength meter */}
            {form.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.08)', transition: 'all 0.3s' }} />
                  ))}
                </div>
                <p style={{ color: strengthColors[strength], fontSize: '0.7rem', fontWeight: 600 }}>{strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Confirm Password *</label>
            <div style={{ position: 'relative' }}>
              <input type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required style={{ ...inp, borderColor: form.confirmPassword && form.confirmPassword !== form.password ? 'rgba(239,68,68,0.5)' : undefined }} onFocus={focusStyle} onBlur={blurStyle} />
              {form.confirmPassword && (
                <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>
                  {form.confirmPassword === form.password ? '✅' : '❌'}
                </span>
              )}
            </div>
            {form.confirmPassword && form.confirmPassword !== form.password && (
              <p style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.3rem' }}>Passwords do not match</p>
            )}
          </div>

          <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.015 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
            style={{ marginTop: '0.5rem', padding: '0.95rem', background: loading ? c.textDim : 'linear-gradient(135deg, #7c3aed, #d4af37)', color: '#fff', fontWeight: 800, borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', letterSpacing: '0.05em', fontFamily: 'Sora, sans-serif', boxShadow: loading ? 'none' : '0 6px 20px rgba(124,58,237,0.3)' }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </motion.button>

          <p style={{ textAlign: 'center', color: c.textDim, fontSize: '0.82rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 700 }}>Sign in →</Link>
          </p>
        </form>

        <p style={{ textAlign: 'center', color: c.textDim, fontSize: '0.7rem', marginTop: '1.25rem' }}>
          By creating an account, you agree to our{' '}
          <Link to="/about" style={{ color: c.textMuted, textDecoration: 'none' }}>Terms & Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
