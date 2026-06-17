/**
 * @file pages/Result.js
 * @description Student result lookup page.
 *
 * Features:
 *   - Enter roll number to search results
 *   - Result card: student info, SGPA, subjects, marks, grade, status
 *   - Print-friendly receipt layout
 *
 * Data: getResultByRoll(rollNumber) API
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { getResultByRoll } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const gradeColor = { 'O': '#22c55e', 'A+': '#3b82f6', 'A': '#6366f1', 'B+': '#8b5cf6', 'B': '#d4af37', 'C': '#f59e0b', 'F': '#ef4444' };

const getGrade = (pct) => {
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  if (pct >= 40) return 'C';
  return 'F';
};

const mockResult = [
  {
    _id: 'r1', rollNumber: 'ZI2025CS001', studentName: 'Aarav Sharma', academicYear: '2025-26',
    semester: 1, course: { title: 'B.Tech Computer Science' },
    subjects: [
      { name: 'Mathematics I', code: 'MA101', maxMarks: 100, obtainedMarks: 88, credits: 4 },
      { name: 'Physics', code: 'PH101', maxMarks: 100, obtainedMarks: 76, credits: 3 },
      { name: 'C Programming', code: 'CS101', maxMarks: 100, obtainedMarks: 93, credits: 4 },
      { name: 'Digital Logic', code: 'CS102', maxMarks: 100, obtainedMarks: 82, credits: 3 },
      { name: 'English Communication', code: 'EN101', maxMarks: 100, obtainedMarks: 79, credits: 2 },
    ],
    cgpa: 8.6, status: 'Pass',
  },
  {
    _id: 'r2', rollNumber: 'ZI2025CS001', studentName: 'Aarav Sharma', academicYear: '2025-26',
    semester: 2, course: { title: 'B.Tech Computer Science' },
    subjects: [
      { name: 'Mathematics II', code: 'MA102', maxMarks: 100, obtainedMarks: 91, credits: 4 },
      { name: 'Data Structures', code: 'CS201', maxMarks: 100, obtainedMarks: 95, credits: 4 },
      { name: 'OOP with Java', code: 'CS202', maxMarks: 100, obtainedMarks: 87, credits: 4 },
      { name: 'Database Systems', code: 'CS203', maxMarks: 100, obtainedMarks: 80, credits: 3 },
      { name: 'Computer Networks', code: 'CS204', maxMarks: 100, obtainedMarks: 74, credits: 3 },
    ],
    cgpa: 8.9, status: 'Pass',
  },
];

const ResultCard = ({ result, c }) => {
  const totalMax = result.subjects.reduce((s, sub) => s + sub.maxMarks, 0);
  const totalObt = result.subjects.reduce((s, sub) => s + sub.obtainedMarks, 0);
  const pct = ((totalObt / totalMax) * 100).toFixed(1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(124,58,237,0.08))', padding: '1.5rem', borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{result.studentName}</h3>
          <p style={{ color: c.textMuted, fontSize: '0.8rem' }}>{result.course?.title} • Roll No: {result.rollNumber}</p>
          <p style={{ color: c.textDim, fontSize: '0.75rem', marginTop: '0.2rem' }}>Semester {result.semester} • {result.academicYear}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#d4af37', lineHeight: 1 }}>{result.cgpa}</p>
          <p style={{ color: c.textMuted, fontSize: '0.72rem' }}>CGPA</p>
          <span style={{ display: 'inline-block', marginTop: '0.3rem', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: result.status === 'Pass' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: result.status === 'Pass' ? '#22c55e' : '#ef4444' }}>
            {result.status}
          </span>
        </div>
      </div>

      {/* Subject Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['Code', 'Subject', 'Credits', 'Max', 'Obtained', 'Grade'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: c.textDim, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${c.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.subjects.map((sub, i) => {
              const g = sub.grade || getGrade((sub.obtainedMarks / sub.maxMarks) * 100);
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.75rem 1rem', color: c.textDim, fontSize: '0.78rem' }}>{sub.code}</td>
                  <td style={{ padding: '0.75rem 1rem', color: c.text, fontSize: '0.85rem' }}>{sub.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: c.textMuted, fontSize: '0.8rem', textAlign: 'center' }}>{sub.credits}</td>
                  <td style={{ padding: '0.75rem 1rem', color: c.textMuted, fontSize: '0.8rem', textAlign: 'center' }}>{sub.maxMarks}</td>
                  <td style={{ padding: '0.75rem 1rem', color: c.text, fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>{sub.obtainedMarks}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: `${(gradeColor[g] || '#64748b')}22`, color: gradeColor[g] || '#64748b' }}>{g}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'rgba(212,175,55,0.04)', borderTop: '2px solid rgba(212,175,55,0.15)' }}>
              <td colSpan={3} style={{ padding: '0.75rem 1rem', color: '#d4af37', fontSize: '0.82rem', fontWeight: 700 }}>TOTAL</td>
              <td style={{ padding: '0.75rem 1rem', color: '#d4af37', fontWeight: 700, textAlign: 'center', fontSize: '0.85rem' }}>{totalMax}</td>
              <td style={{ padding: '0.75rem 1rem', color: '#d4af37', fontWeight: 700, textAlign: 'center', fontSize: '0.85rem' }}>{totalObt}</td>
              <td style={{ padding: '0.75rem 1rem', color: '#d4af37', fontWeight: 700, textAlign: 'center', fontSize: '0.85rem' }}>{pct}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
};

const Result = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [roll, setRoll] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!roll.trim()) return;
    setLoading(true); setError(''); setResults(null);
    try {
      const res = await getResultByRoll(roll.trim());
      setResults(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        // Show mock demo result for demo roll number
        if (roll.toUpperCase() === 'ZI2025CS001') {
          setResults(mockResult);
        } else {
          setError('No result found for this roll number. Try "ZI2025CS001" for demo.');
        }
      } else {
        setError('Server error. Try roll number "ZI2025CS001" for demo.');
        if (roll.toUpperCase() === 'ZI2025CS001') setResults(mockResult);
      }
    } finally { setLoading(false); }
  };

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(212,175,55,0.04) 0%, transparent 100%)' }}>
        <SectionTitle subtitle="Academic Records" title="Result / Marksheet" description="Enter your roll number to view your semester-wise results and academic performance." />
      </section>

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 900, margin: '0 auto' }}>
        {/* Search Form */}
        <form onSubmit={handleSearch}
          style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: c.textMuted, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Enter your roll number exactly as on your ID card</p>
          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 500, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input value={roll} onChange={e => setRoll(e.target.value)} placeholder="e.g. ZI2025CS001"
              style={{ flex: 1, minWidth: 200, padding: '0.85rem 1.25rem', background: c.bgInput, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.95rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }} />
            <button type="submit" disabled={loading}
              style={{ padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}>
              {loading ? '...' : 'Search →'}
            </button>
          </div>
          <p style={{ color: c.textDim, fontSize: '0.72rem', marginTop: '0.75rem' }}>Demo: Try roll number "ZI2025CS001"</p>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '1rem 1.5rem', color: '#ef4444', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ color: '#d4af37', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {results.length} Semester{results.length > 1 ? 's' : ''} Found
              </p>
              {results.map(r => <ResultCard key={r._id} result={r} c={c} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default Result;
