/**
 * @file components/CourseComparison.js
 * @description Course comparison feature — floating bar + modal.
 *
 * Floating bar: shows selected courses (max 3), "Compare Now" button
 * Modal table: side-by-side comparison of Duration, Fee, Seats, Rating, etc.
 * Best values highlighted with green checkmark.
 *
 * Exports: CourseComparison component + useComparison() hook
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Hook ─────────────────────────────────────────────────────────────── */
export const useComparison = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const addCourse = (course) =>
    setSelectedCourses((prev) => {
      if (prev.find((c) => c._id === course._id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, course];
    });

  const removeCourse = (id) =>
    setSelectedCourses((prev) => prev.filter((c) => c._id !== id));

  const clearAll = () => setSelectedCourses([]);

  const toggleCourse = (course) => {
    setSelectedCourses((prev) => {
      if (prev.find((c) => c._id === course._id))
        return prev.filter((c) => c._id !== course._id);
      if (prev.length >= 3) return prev;
      return [...prev, course];
    });
  };

  return { selectedCourses, addCourse, removeCourse, clearAll, toggleCourse };
};

/* ─── Comparison criteria ───────────────────────────────────────────────── */
const parseDuration = (d) => {
  if (!d) return null;
  const m = String(d).match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};

const criteria = [
  {
    label: 'Course Name',
    fn: (c) => c.title || '—',
    best: null,
  },
  {
    label: 'Duration',
    fn: (c) => c.duration || '—',
    numFn: (c) => parseDuration(c.duration),
    best: 'min',
  },
  {
    label: 'Fee / Year',
    fn: (c) => (c.fees ? `₹${Number(c.fees).toLocaleString()}` : '—'),
    numFn: (c) => c.fees || null,
    best: 'min',
  },
  {
    label: 'Eligibility',
    fn: (c) => c.eligibility || '10+2 / Equivalent',
    best: null,
  },
  {
    label: 'Seats',
    fn: (c) => (c.seats ? String(c.seats) : '—'),
    numFn: (c) => c.seats || null,
    best: 'max',
  },
  {
    label: 'Rating',
    fn: (c) => `${c.rating || '4.5'}/5 ⭐`,
    numFn: (c) => c.rating || 4.5,
    best: 'max',
  },
  {
    label: 'Placement %',
    fn: (c) => `${c.placement || 95}%`,
    numFn: (c) => c.placement || 95,
    best: 'max',
  },
];

const getBestIndex = (courses, crit) => {
  if (!crit.best || !crit.numFn) return -1;
  const nums = courses.map((c) => crit.numFn(c));
  if (nums.every((n) => n === null)) return -1;
  const filtered = nums.filter((n) => n !== null);
  const target =
    crit.best === 'max' ? Math.max(...filtered) : Math.min(...filtered);
  return nums.indexOf(target);
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const CourseComparison = ({ selectedCourses = [], onRemove, onClear }) => {
  const [showModal, setShowModal] = useState(false);

  if (!selectedCourses.length) return null;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      [...selectedCourses].forEach((c) => onRemove(c));
    }
  };

  return (
    <>
      {/* ── Floating Compare Bar ── */}
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 150,
          background: 'rgba(14,14,28,0.95)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '14px',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)',
          backdropFilter: 'blur(20px)',
          maxWidth: 'calc(100vw - 3rem)',
        }}
      >
        <span style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
          ⚖️ Comparing:
        </span>

        {selectedCourses.map((c) => (
          <span
            key={c._id}
            style={{
              fontSize: '0.78rem',
              color: '#f1f5f9',
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.22)',
              borderRadius: '6px',
              padding: '0.22rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
            }}
          >
            {c.title}
            <button
              onClick={() => onRemove(c)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '0.65rem',
                padding: 0,
                lineHeight: 1,
                display: 'flex',
              }}
            >
              ✕
            </button>
          </span>
        ))}

        <button
          onClick={() => setShowModal(true)}
          disabled={selectedCourses.length < 2}
          style={{
            padding: '0.45rem 1.1rem',
            background:
              selectedCourses.length >= 2
                ? 'linear-gradient(135deg, #d4af37, #f0c040)'
                : '#1e293b',
            color: selectedCourses.length >= 2 ? '#050509' : '#475569',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            cursor: selectedCourses.length >= 2 ? 'pointer' : 'not-allowed',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s',
          }}
        >
          Compare Now →
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '0.45rem 0.85rem',
            border: '1px solid rgba(212,175,55,0.2)',
            color: '#64748b',
            background: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
          }}
        >
          Clear
        </button>
      </motion.div>

      {/* ── Comparison Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              overflowY: 'auto',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#0f0f1e',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '18px',
                padding: '2rem',
                width: '100%',
                maxWidth: 920,
                maxHeight: '88vh',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                    ⚖️ Course Comparison
                  </h2>
                  <p style={{ color: '#475569', fontSize: '0.75rem' }}>
                    ✅ = best value in category
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: '#d4af37',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    padding: '0.38rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  ✕ Close
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                  <thead>
                    <tr>
                      <th style={{
                        padding: '0.75rem 1rem',
                        color: '#334155',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        textAlign: 'left',
                        width: '22%',
                      }}>
                        Criteria
                      </th>
                      {selectedCourses.map((c, i) => (
                        <th
                          key={c._id}
                          style={{
                            padding: '0.9rem 1rem',
                            color: '#d4af37',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            textAlign: 'center',
                            background: i % 2 === 0
                              ? 'rgba(212,175,55,0.06)'
                              : 'rgba(124,58,237,0.05)',
                            borderRadius: '8px 8px 0 0',
                          }}
                        >
                          {c.title}
                          <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 400, marginTop: '0.2rem' }}>
                            {c.department || ''}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((crit) => {
                      const bestIdx = getBestIndex(selectedCourses, crit);
                      return (
                        <tr
                          key={crit.label}
                          style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}
                        >
                          <td style={{
                            padding: '0.9rem 1rem',
                            color: '#64748b',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                          }}>
                            {crit.label}
                          </td>
                          {selectedCourses.map((c, i) => {
                            const isBest = bestIdx === i;
                            return (
                              <td
                                key={c._id}
                                style={{
                                  padding: '0.9rem 1rem',
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                  verticalAlign: 'top',
                                  color: isBest ? '#22c55e' : '#f1f5f9',
                                  fontWeight: isBest ? 700 : 400,
                                  background: isBest
                                    ? 'rgba(34,197,94,0.04)'
                                    : 'transparent',
                                }}
                              >
                                {isBest ? '✅ ' : ''}{crit.fn(c)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseComparison;
