/**
 * @file components/CourseCard.js
 * @description Reusable course display card.
 *
 * Shows: image/gradient placeholder, department badge, title, description (2-line),
 *        duration, seats, fees. Buttons: "View Details" + "Apply Now"
 * Props: course object, onCompare callback for comparison feature
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

/* Department → color map */
const deptColor = {
  Technology: '#d4af37',
  Security: '#ef4444',
  Engineering: '#7c3aed',
  Business: '#3b82f6',
  Science: '#10b981',
  Default: '#94a3b8',
};

const CourseCard = ({ course, index }) => {
  const color = deptColor[course.department] || deptColor.Default;
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
    <motion.div
      className="hover-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', boxShadow: c.cardShadow }}
    >
      {/* Image / Placeholder */}
      <div style={{ height: 160, background: isDark ? `linear-gradient(135deg, #0a0a14, #14142a)` : `linear-gradient(135deg, #eef0f5, #e0e2e8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {course.image ? (
          <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        ) : (
          <>
            {/* Decorative background circles */}
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: `${color}12`, top: -20, right: -20 }} />
            <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: `${color}08`, bottom: -10, left: 10 }} />
            <span style={{ fontSize: '2.5rem', position: 'relative', zIndex: 1 }}>🎓</span>
          </>
        )}
        {/* Dept badge */}
        <span style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', padding: '0.2rem 0.7rem', background: `${color}20`, border: `1px solid ${color}50`, color: color, fontSize: '0.7rem', fontWeight: 600, borderRadius: '999px', letterSpacing: '0.05em' }}>
          {course.department}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ color: c.text, marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>{course.title}</h3>
        </Link>
        <p style={{ color: c.textDim, fontSize: '0.82rem', marginBottom: '1.1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
          {course.description}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: c.textDim, marginBottom: '1rem', padding: '0.75rem 0', borderTop: `1px solid ${c.borderGold}`, borderBottom: `1px solid ${c.borderGold}` }}>
          <span>⏱ {course.duration || '—'}</span>
          <span>💺 {course.seats ? `${course.seats} seats` : '—'}</span>
          <span style={{ color: '#d4af37', fontWeight: 700 }}>₹{course.fees ? Number(course.fees).toLocaleString() : '—'}/yr</span>
        </div>

        {/* Action */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/courses/${course._id}`} style={{ flex: 1, padding: '0.45rem 0.75rem', background: 'transparent', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.03em', textAlign: 'center' }}>
            View Details
          </Link>
          <Link to="/admission" style={{ flex: 1, padding: '0.45rem 0.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.03em', textAlign: 'center' }}>
            Apply Now →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
