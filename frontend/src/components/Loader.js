/**
 * @file components/Loader.js
 * @description Full-screen loading spinner component.
 *
 * Shows centered spinning gold ring with "Loading..." text.
 * Used by ProtectedRoute while checking authentication.
 */
import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => (
  <div style={{ position: 'fixed', inset: 0, background: '#050509', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999, gap: '1.5rem' }}>
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#fff' }}
    >
      Z
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.2em' }}>ZORVEX</p>
      <p style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '0.2rem' }}>Institute</p>
    </motion.div>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      style={{ width: 32, height: 32, border: '2px solid rgba(212,175,55,0.15)', borderTop: '2px solid #d4af37', borderRadius: '50%' }}
    />
  </div>
);

export default Loader;
