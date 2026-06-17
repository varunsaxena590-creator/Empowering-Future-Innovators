/**
 * @file pages/NoticeBoard.js
 * @description College notice board page.
 *
 * Features:
 *   - Category filter: All, Academic, Event, Holiday, Exam, General
 *   - Priority badges: urgent (red), important (yellow), normal
 *   - Date display + notice detail expand on click
 *
 * Data: getNotices() API
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { getNotices } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const CATEGORIES = ['All', 'Academic', 'Exam', 'Event', 'Holiday', 'Urgent', 'General'];

const catColor = {
  Academic: '#3b82f6', Exam: '#ef4444', Event: '#8b5cf6',
  Holiday: '#22c55e', Urgent: '#f59e0b', General: '#64748b',
};

const mockNotices = [
  { _id: '1', title: 'End Semester Examination Schedule 2026', content: 'The end semester examinations for all courses will commence from May 15, 2026. Students are advised to download their admit cards from the student portal. No student will be allowed to sit for the exam without a valid admit card.', category: 'Exam', pinned: true, createdAt: '2026-03-20T10:00:00Z', tags: ['exam', 'schedule'] },
  { _id: '2', title: 'National Innovation Challenge – Register Now!', content: 'Zorvex Institute is hosting the National Innovation Challenge 2026. Teams of 2-4 students can register. Prizes worth ₹5,00,000 up for grabs. Last date to register: April 30, 2026.', category: 'Event', pinned: true, createdAt: '2026-03-18T09:00:00Z', tags: ['competition', 'innovation'] },
  { _id: '3', title: 'Summer Internship Program – Applications Open', content: 'Applications for the Summer Internship Program 2026 are now open. Students in their 2nd and 3rd year are eligible to apply. Partner companies include top MNCs and startups.', category: 'Academic', pinned: false, createdAt: '2026-03-15T08:00:00Z', tags: ['internship', 'career'] },
  { _id: '4', title: 'Holiday Notice – Holi Festival', content: 'The institute will remain closed on March 25, 2026 on account of Holi. Regular classes will resume from March 26, 2026.', category: 'Holiday', pinned: false, createdAt: '2026-03-10T07:00:00Z', tags: ['holiday'] },
  { _id: '5', title: 'Library Timing Change – Effective Immediately', content: 'The central library timings have been revised. New timings: Monday to Saturday 8:00 AM – 10:00 PM. Sunday: 10:00 AM – 6:00 PM.', category: 'General', pinned: false, createdAt: '2026-03-08T06:00:00Z', tags: ['library'] },
  { _id: '6', title: 'Scholarship Applications – Last Date Extended', content: 'The last date for scholarship applications has been extended to April 15, 2026. Students with CGPA above 8.0 are encouraged to apply. Merit and need-based scholarships available.', category: 'Academic', pinned: false, createdAt: '2026-03-05T05:00:00Z', tags: ['scholarship', 'financial aid'] },
  { _id: '7', title: '⚠️ URGENT: Fee Payment Deadline', content: 'All students are reminded that the last date for fee payment for the upcoming semester is April 10, 2026. Failure to pay fees may result in deregistration from courses.', category: 'Urgent', pinned: false, createdAt: '2026-03-01T04:00:00Z', tags: ['fee', 'payment', 'deadline'] },
];

const NoticeCard = ({ notice, c }) => {
  const [open, setOpen] = useState(false);
  const color = catColor[notice.category] || '#64748b';
  const date = new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: c.bgCard, border: `1px solid ${notice.pinned ? c.borderGold : c.border}`, borderLeft: `4px solid ${color}`, borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
            {notice.pinned && <span style={{ fontSize: '0.62rem', fontWeight: 700, background: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📌 Pinned</span>}
            <span style={{ fontSize: '0.62rem', fontWeight: 700, background: `${color}22`, color, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{notice.category}</span>
            <span style={{ fontSize: '0.7rem', color: c.textDim, marginLeft: 'auto' }}>{date}</span>
          </div>
          <h3 style={{ color: c.text, fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '0.3rem' }}>{notice.title}</h3>
          {notice.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {notice.tags.map(t => <span key={t} style={{ fontSize: '0.62rem', color: c.textDim, background: 'rgba(255,255,255,0.04)', padding: '1px 6px', borderRadius: '4px' }}>#{t}</span>)}
            </div>
          )}
        </div>
        <span style={{ color: c.textDim, fontSize: '1rem', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0 }}>▾</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 1.5rem 1.25rem', color: c.textMuted, fontSize: '0.875rem', lineHeight: 1.8, borderTop: `1px solid ${c.border}` }}>
              <p style={{ paddingTop: '1rem' }}>{notice.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NoticeBoard = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [notices, setNotices] = useState(mockNotices);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  let active = true;
  setLoading(true);
  getNotices({ category: category !== 'All' ? category : undefined, search: search || undefined })
    .then(res => { if (active) setNotices(res.data.data?.length ? res.data.data : mockNotices); })
    .catch(() => { if (active) setNotices(mockNotices); })
    .finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
  }, [category, search]);

  const filtered = notices.filter(n =>
    (category === 'All' || n.category === category) &&
    (!search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
  );
  const pinned = filtered.filter(n => n.pinned);
  const regular = filtered.filter(n => !n.pinned);

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(212,175,55,0.04) 0%, transparent 100%)' }}>
        <SectionTitle subtitle="Stay Updated" title="Notice Board" description="Official announcements, exam schedules, events, and important updates from Zorvex Institute." />
      </section>

      <section style={{ padding: '1rem 1.5rem 5rem', maxWidth: 900, margin: '0 auto' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: c.textDim, fontSize: '1rem' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices..."
            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: '0.45rem 1rem', borderRadius: '20px', border: `1px solid ${category === cat ? (catColor[cat] || '#d4af37') : c.border}`, background: category === cat ? `${(catColor[cat] || '#d4af37')}22` : 'transparent', color: category === cat ? (catColor[cat] || '#d4af37') : c.textMuted, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', color: c.textDim, padding: '3rem' }}>Loading notices...</div>}

        {!loading && pinned.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>📌 Pinned</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pinned.map(n => <NoticeCard key={n._id} notice={n} c={c} />)}
            </div>
          </div>
        )}

        {!loading && regular.length > 0 && (
          <div>
            {pinned.length > 0 && <p style={{ color: c.textDim, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>All Notices</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {regular.map(n => <NoticeCard key={n._id} notice={n} c={c} />)}
            </div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: c.textDim }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No notices found for this filter.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default NoticeBoard;
