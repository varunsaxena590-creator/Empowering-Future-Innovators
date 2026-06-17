/**
 * @file pages/Timetable.js
 * @description Weekly timetable viewer.
 *
 * Features:
 *   - Department/semester selector dropdowns
 *   - Weekly grid: Mon-Sat, 6 time slots
 *   - Color-coded subject blocks
 *
 * Data: Static timetable data (hardcoded)
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const scheduleData = {
  'CS Sem 1': {
    Monday:    ['Mathematics I', 'C Programming', null, null, 'LUNCH', 'Physics Lab', 'Physics Lab', null, null],
    Tuesday:   ['Physics', 'English', 'Digital Logic', null, 'LUNCH', 'C Programming Lab', 'C Programming Lab', null, null],
    Wednesday: ['Mathematics I', null, 'C Programming', 'Digital Logic', 'LUNCH', null, 'Seminar', null, null],
    Thursday:  ['Physics', 'C Programming', 'English', null, 'LUNCH', 'Digital Logic Lab', 'Digital Logic Lab', null, null],
    Friday:    ['Mathematics I', 'Digital Logic', null, 'Physics', 'LUNCH', null, 'Sports/Activity', 'Sports/Activity', null],
    Saturday:  ['English', 'Mathematics I', null, null, 'LUNCH', null, null, null, null],
  },
  'AI/ML Sem 3': {
    Monday:    ['Machine Learning', 'Deep Learning', null, null, 'LUNCH', 'ML Lab', 'ML Lab', null, null],
    Tuesday:   ['Python Programming', 'Statistics', 'NLP', null, 'LUNCH', 'DL Lab', 'DL Lab', null, null],
    Wednesday: ['Machine Learning', null, 'Python Programming', 'Computer Vision', 'LUNCH', null, 'Seminar', null, null],
    Thursday:  ['Statistics', 'NLP', 'Deep Learning', null, 'LUNCH', 'CV Lab', 'CV Lab', null, null],
    Friday:    ['Machine Learning', 'Computer Vision', null, 'Statistics', 'LUNCH', null, 'Sports/Activity', 'Sports/Activity', null],
    Saturday:  ['Python Programming', 'Machine Learning', null, null, 'LUNCH', null, null, null, null],
  },
  'Data Eng Sem 5': {
    Monday:    ['Big Data Analytics', 'Spark & Hadoop', null, null, 'LUNCH', 'BigData Lab', 'BigData Lab', null, null],
    Tuesday:   ['Cloud Computing', 'Database Design', 'ETL Pipelines', null, 'LUNCH', 'Cloud Lab', 'Cloud Lab', null, null],
    Wednesday: ['Big Data Analytics', null, 'Cloud Computing', 'ETL Pipelines', 'LUNCH', null, 'Seminar', null, null],
    Thursday:  ['Database Design', 'ETL Pipelines', 'Spark & Hadoop', null, 'LUNCH', 'ETL Lab', 'ETL Lab', null, null],
    Friday:    ['Big Data Analytics', 'Cloud Computing', null, 'Database Design', 'LUNCH', null, 'Sports/Activity', 'Sports/Activity', null],
    Saturday:  ['Database Design', 'Big Data Analytics', null, null, 'LUNCH', null, null, null, null],
  },
};

const subjectColors = {
  'Mathematics I': '#3b82f6', 'C Programming': '#22c55e', 'Physics': '#8b5cf6',
  'Digital Logic': '#f59e0b', 'English': '#64748b', 'Machine Learning': '#3b82f6',
  'Deep Learning': '#22c55e', 'Python Programming': '#f59e0b', 'Statistics': '#8b5cf6',
  'NLP': '#ec4899', 'Computer Vision': '#06b6d4', 'Big Data Analytics': '#3b82f6',
  'Spark & Hadoop': '#f59e0b', 'Cloud Computing': '#22c55e', 'Database Design': '#8b5cf6',
  'ETL Pipelines': '#ec4899',
};

const Timetable = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [selectedCourse, setSelectedCourse] = useState('CS Sem 1');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const courses = Object.keys(scheduleData);
  const daySchedule = scheduleData[selectedCourse]?.[selectedDay] || [];

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(212,175,55,0.04) 0%, transparent 100%)' }}>
        <SectionTitle subtitle="Academic Schedule" title="Class Timetable" description="View the weekly class schedule for your course and semester." />
      </section>

      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        {/* Course Selector */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
          {courses.map(cr => (
            <button key={cr} onClick={() => setSelectedCourse(cr)}
              style={{ padding: '0.55rem 1.25rem', borderRadius: '10px', border: `1px solid ${selectedCourse === cr ? '#d4af37' : c.borderGold}`, background: selectedCourse === cr ? 'rgba(212,175,55,0.1)' : 'transparent', color: selectedCourse === cr ? '#d4af37' : c.textMuted, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.2s' }}>
              {cr}
            </button>
          ))}
        </div>

        {/* Day Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {DAYS.map(d => (
            <button key={d} onClick={() => setSelectedDay(d)}
              style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', background: selectedDay === d ? 'linear-gradient(135deg, #d4af37, #f0c040)' : c.bgCard, color: selectedDay === d ? '#050509' : c.textMuted, cursor: 'pointer', fontSize: '0.8rem', fontWeight: selectedDay === d ? 700 : 400, whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s' }}>
              {d.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Schedule Grid */}
        <motion.div key={selectedDay + selectedCourse} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(212,175,55,0.06)', borderBottom: `1px solid ${c.borderGold}`, display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '0.85rem', fontWeight: 700 }}>{selectedDay}</span>
              <span style={{ color: c.textDim, fontSize: '0.75rem' }}>{selectedCourse}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 0 }}>
              {TIME_SLOTS.map((time, i) => {
                const subject = daySchedule[i];
                const isLunch = subject === 'LUNCH';
                const color = subjectColors[subject];
                return (
                  <React.Fragment key={time}>
                    <div style={{ padding: '0.75rem 1.25rem', borderBottom: `1px solid ${c.border}`, color: c.textDim, fontSize: '0.72rem', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', minWidth: 90 }}>
                      {time}
                    </div>
                    <div style={{ padding: '0.6rem 1rem', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center' }}>
                      {isLunch ? (
                        <div style={{ padding: '0.45rem 1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px dashed rgba(212,175,55,0.2)', borderRadius: '8px', color: '#d4af37', fontSize: '0.78rem', fontWeight: 600 }}>
                          🍽️ Lunch Break (1:00 PM – 2:00 PM)
                        </div>
                      ) : subject ? (
                        <div style={{ padding: '0.5rem 1.25rem', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: '8px', color, fontSize: '0.82rem', fontWeight: 600 }}>
                          {subject}
                        </div>
                      ) : (
                        <span style={{ color: '#1e293b', fontSize: '0.75rem' }}>— Free Period —</span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Full Week Grid (compact) */}
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, fontSize: '0.9rem', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>FULL WEEK OVERVIEW</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: c.textDim, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: c.bgCard, borderBottom: `1px solid ${c.borderGold}` }}>Time</th>
                  {DAYS.map(d => (
                    <th key={d} style={{ padding: '0.6rem 0.75rem', textAlign: 'center', color: d === selectedDay ? '#d4af37' : c.textDim, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: c.bgCard, borderBottom: `1px solid ${c.borderGold}` }}>{d.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((time, i) => (
                  <tr key={time}>
                    <td style={{ padding: '0.55rem 1rem', color: c.textDim, fontSize: '0.7rem', fontFamily: 'Orbitron, sans-serif', background: c.bgSection, borderBottom: `1px solid ${c.border}`, whiteSpace: 'nowrap' }}>{time}</td>
                    {DAYS.map(d => {
                      const sub = scheduleData[selectedCourse]?.[d]?.[i];
                      const isLunch = sub === 'LUNCH';
                      const clr = subjectColors[sub];
                      return (
                        <td key={d} style={{ padding: '0.45rem 0.5rem', borderBottom: `1px solid ${c.border}`, textAlign: 'center', background: d === selectedDay ? 'rgba(212,175,55,0.03)' : 'transparent' }}>
                          {isLunch ? <span style={{ fontSize: '0.65rem', color: '#d4af37' }}>LUNCH</span>
                            : sub ? <span style={{ fontSize: '0.65rem', color: clr || c.textMuted, background: clr ? `${clr}18` : 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{sub.split(' ')[0]}</span>
                            : <span style={{ color: '#1e293b', fontSize: '0.6rem' }}>—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Timetable;
