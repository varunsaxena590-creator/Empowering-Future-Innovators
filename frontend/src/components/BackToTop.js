/**
 * @file components/BackToTop.js
 * @description Floating "scroll to top" button.
 *
 * Appears when page is scrolled > 400px.
 * Gold gradient background, animates in/out with Framer Motion.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SIZE = 52;
const STROKE = 3;
const RADIUS = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
      setVisible(scrollTop > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashOffset = CIRCUMFERENCE * (1 - scrollPct);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title="Back to top"
          style={{
            position: 'fixed',
            bottom: '1.75rem',
            left: '1.75rem',
            zIndex: 90,
            width: SIZE,
            height: SIZE,
            cursor: 'pointer',
          }}
        >
          {/* SVG progress ring */}
          <svg
            width={SIZE}
            height={SIZE}
            style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          >
            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="rgba(212,175,55,0.18)"
              strokeWidth={STROKE}
            />
            {/* Progress */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#d4af37"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>

          {/* Button face */}
          <div style={{
            position: 'absolute',
            inset: STROKE + 2,
            borderRadius: '50%',
            background: hovered ? 'rgba(30,30,56,0.98)' : 'rgba(14,14,30,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hovered
              ? '0 0 18px rgba(212,175,55,0.45)'
              : '0 0 8px rgba(212,175,55,0.2)',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}>
            <span style={{
              color: '#d4af37',
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1,
              transform: 'translateY(-1px)',
              display: 'block',
            }}>↑</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
