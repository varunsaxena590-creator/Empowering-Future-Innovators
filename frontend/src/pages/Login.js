/**
 * @file pages/Login.js
 * @description User login page with animated background.
 *
 * Form: email, password (with show/hide toggle), Remember Me checkbox
 * Links: Forgot Password, Create Account
 * Background: 3 animated floating gradient orbs
 *
 * Data: loginUser() API → saves JWT → redirects to /admin or /portal
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const inp = { width: '100%', padding: '0.85rem 1.2rem', background: c.bgInput, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.9rem', boxSizing: 'border-box' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ ...form, rememberMe: remember });
      login(res.data.token, res.data.user, remember);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/portal');
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        toast.error('Please verify your email first');
        navigate('/verify-otp', { state: { email: err.response.data.email } });
      } else {
        toast.error(err.response?.data?.message || 'Login failed');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Animated orbs */}
      <motion.div animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '15%', left: '15%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(212,175,55,0.09), transparent 65%)', pointerEvents: 'none' }} />
      <motion.div animate={{ x: [0, -30, 25, 0], y: [0, 25, -15, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ position: 'absolute', bottom: '20%', right: '15%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 65%)', pointerEvents: 'none' }} />
      <motion.div animate={{ x: [0, 20, -10, 0], y: [0, -20, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ position: 'absolute', top: '60%', left: '60%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(212,175,55,0.05), transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0 }} />

      <motion.div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '1.4rem', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Z</motion.div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 700, color: c.text, letterSpacing: '0.1em' }}>ZORVEX</span>
          </Link>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', color: c.text, marginTop: '1.5rem', fontWeight: 600 }}>Welcome Back</h1>
          <p style={{ color: c.textDim, marginTop: '0.4rem', fontSize: '0.85rem' }}>Sign in to your Zorvex account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: c.bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${c.borderGold}`, borderRadius: '20px', padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div>
            <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inp}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.25)'; e.target.style.boxShadow = 'none'; }} />
          </div>
          <div>
            <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ ...inp, paddingRight: '3rem' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.25)'; e.target.style.boxShadow = 'none'; }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: c.textDim, cursor: 'pointer', fontSize: '1rem', padding: 0 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <div onClick={() => setRemember(!remember)}
                style={{ width: 18, height: 18, borderRadius: '5px', border: `2px solid ${remember ? '#d4af37' : 'rgba(212,175,55,0.3)'}`, background: remember ? '#d4af37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                {remember && <span style={{ color: c.bgPrimary, fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ color: c.textDim, fontSize: '0.82rem' }}>Remember me</span>
            </label>
            <Link to="/forgot-password" style={{ color: c.textMuted, textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}>
              Forgot password?
            </Link>
          </div>

          <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.015 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
            style={{ marginTop: '0.5rem', padding: '0.95rem', background: loading ? c.textDim : 'linear-gradient(135deg, #d4af37, #f0c040)', color: loading ? c.textMuted : c.bgPrimary, fontWeight: 800, borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', letterSpacing: '0.05em', fontFamily: 'Sora, sans-serif', boxShadow: loading ? 'none' : '0 6px 20px rgba(212,175,55,0.25)' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </motion.button>
          <p style={{ textAlign: 'center', color: c.textDim, fontSize: '0.83rem', marginTop: '0.25rem' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 700 }}>Create one →</Link>
          </p>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <p style={{ color: c.textDim, fontSize: '0.72rem' }}>
            Need help?{' '}
            <a href="mailto:support@zorvexinstitute.edu" style={{ color: '#d4af37', textDecoration: 'none' }}>support@zorvexinstitute.edu</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

