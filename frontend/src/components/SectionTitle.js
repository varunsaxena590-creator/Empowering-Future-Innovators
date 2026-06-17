/**
 * @file components/SectionTitle.js
 * @description Reusable section heading component.
 *
 * Displays: subtitle badge (small uppercase), main title (Orbitron font),
 *           optional description text. Centered with gold gradient underline.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const SectionTitle = ({ subtitle, title, description, center = true }) => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  return (
  <motion.div
    className={`mb-12 ${center ? 'text-center' : ''}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {subtitle && <span style={{ color: '#d4af37', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', display: 'block', marginBottom: '0.6rem' }}>{subtitle}</span>}
    <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: c.text, marginBottom: '1rem', fontWeight: 700 }}>{title}</h2>
    {description && <p style={{ color: c.textMuted, maxWidth: '580px', margin: center ? '0 auto' : '0', lineHeight: 1.8, fontSize: '0.92rem' }}>{description}</p>}
    <div style={{ height: '3px', width: '48px', background: 'linear-gradient(90deg, #d4af37, #f0c040)', borderRadius: '2px', margin: center ? '1rem auto 0' : '1rem 0 0' }} />
  </motion.div>
  );
};

export default SectionTitle;
