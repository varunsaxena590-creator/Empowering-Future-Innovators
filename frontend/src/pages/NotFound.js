/**
 * @file pages/NotFound.js
 * @description 404 Not Found page shown for invalid routes.
 *
 * Features:
 *   - Large "404" text with decorative gradient orbs
 *   - Animated content with framer-motion
 *   - Go Home + Go Back navigation buttons
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const NotFound = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <motion.div
          animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ fontSize: '7rem', marginBottom: '1.5rem', lineHeight: 1 }}>
          🎓
        </motion.div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(4rem, 12vw, 8rem)', color: '#d4af37', fontWeight: 800, lineHeight: 1, marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: c.text, marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: c.textDim, fontSize: '1rem', marginBottom: '2.5rem', maxWidth: 420, margin: '0 auto 2.5rem' }}>
          Looks like this page graduated and moved on. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.95rem' }}>
            Go Home
          </Link>
          <button onClick={() => navigate(-1)} style={{ padding: '0.8rem 2rem', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', background: 'transparent', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.95rem' }}>
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
