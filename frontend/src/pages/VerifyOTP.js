import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { verifyOTP, resendOTP } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { isDark } = useTheme();
  const c = getColors(isDark);

  useEffect(() => {
    if (!email) { navigate('/register'); return; }
    inputsRef.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || '';
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Please enter the 6-digit OTP');
    setLoading(true);
    try {
      const res = await verifyOTP({ email, otp: code });
      login(res.data.token, res.data.user);
      toast.success('Email verified! Welcome to Zorvex Institute! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await resendOTP({ email });
      toast.success('New OTP sent to your email!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally { setResending(false); }
  };

  const gold = '#d4af37';

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Animated orbs */}
      <motion.div animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '20%', left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(212,175,55,0.08), transparent 65%)', pointerEvents: 'none' }} />
      <motion.div animate={{ x: [0, -20, 25, 0], y: [0, 20, -15, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{ position: 'absolute', bottom: '15%', right: '15%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0 }} />

      <motion.div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '1.4rem', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Z</motion.div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 700, color: c.text, letterSpacing: '0.1em' }}>ZORVEX</span>
          </Link>
          <div style={{ fontSize: '3rem', marginTop: '1rem' }}>✉️</div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.35rem', color: c.text, marginTop: '0.75rem', fontWeight: 700 }}>Verify Your Email</h1>
          <p style={{ color: c.textDim, marginTop: '0.4rem', fontSize: '0.84rem', lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: gold }}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: c.bgCardAlpha || c.bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${c.borderGold}`, borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

          {/* OTP Inputs */}
          <div style={{ display: 'flex', gap: '0.6rem' }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 52, height: 60, textAlign: 'center', fontSize: '1.5rem', fontWeight: 800,
                  fontFamily: 'Orbitron, monospace', color: gold,
                  background: isDark ? '#14142a' : '#f9fafb',
                  border: `2px solid ${digit ? 'rgba(212,175,55,0.5)' : (isDark ? 'rgba(255,255,255,0.08)' : '#d1d5db')}`,
                  borderRadius: '12px', outline: 'none', transition: 'all 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = gold; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = digit ? 'rgba(212,175,55,0.5)' : (isDark ? 'rgba(255,255,255,0.08)' : '#d1d5db'); e.target.style.boxShadow = 'none'; }}
              />
            ))}
          </div>

          {/* Timer + Resend */}
          <div style={{ textAlign: 'center' }}>
            {countdown > 0 ? (
              <p style={{ color: c.textMuted, fontSize: '0.82rem' }}>
                Resend code in <strong style={{ color: gold }}>{countdown}s</strong>
              </p>
            ) : (
              <button type="button" onClick={handleResend} disabled={resending}
                style={{ background: 'none', border: 'none', color: gold, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'underline' }}>
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          {/* Submit */}
          <motion.button type="submit" disabled={loading || otp.join('').length !== 6}
            whileHover={!loading ? { scale: 1.015 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              width: '100%', padding: '0.95rem',
              background: (loading || otp.join('').length !== 6) ? c.textDim : 'linear-gradient(135deg, #d4af37, #f0c040)',
              color: (loading || otp.join('').length !== 6) ? '#fff' : '#050509',
              fontWeight: 800, borderRadius: '12px', border: 'none',
              cursor: (loading || otp.join('').length !== 6) ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem', letterSpacing: '0.05em', fontFamily: 'Sora, sans-serif',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(212,175,55,0.3)',
            }}>
            {loading ? 'Verifying...' : 'Verify Email →'}
          </motion.button>

          <p style={{ color: c.textDim, fontSize: '0.78rem', textAlign: 'center' }}>
            Wrong email?{' '}
            <Link to="/register" style={{ color: gold, textDecoration: 'none', fontWeight: 700 }}>Go back</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
