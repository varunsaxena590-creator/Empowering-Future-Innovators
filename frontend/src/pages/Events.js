/**
 * @file pages/Events.js
 * @description Events listing page with featured event banner.
 *
 * Sections:
 *   - Hero stats: events count, awards, participants
 *   - Featured event: large card with date, category, seats progress bar
 *   - Sticky filter tabs: Workshop, Seminar, Cultural, Sports, Tech Fest
 *   - Events grid: cards with category colors, dates, seats %, "Days left"
 *   - Newsletter CTA
 *
 * Data: mockEvents (hardcoded), category-based color mapping
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const FILTER_TABS = ['All', 'Workshop', 'Seminar', 'Cultural', 'Sports', 'Tech Fest'];

const mockEvents = [
  { _id: '1', title: 'National Tech Symposium 2026', category: 'Tech Fest', date: '2026-05-15', time: '10:00 AM', location: 'Main Auditorium', description: 'Annual tech symposium featuring industry experts, hackathon, and project expo.', seats: 500, registered: 320, image: null },
  { _id: '2', title: 'AI & Machine Learning Workshop', category: 'Workshop', date: '2026-04-20', time: '9:00 AM', location: 'Computer Lab C-101', description: 'Hands-on workshop on ML algorithms, neural networks, and real-world AI applications.', seats: 60, registered: 58, image: null },
  { _id: '3', title: 'Career Counseling Seminar', category: 'Seminar', date: '2026-04-25', time: '2:00 PM', location: 'Seminar Hall', description: 'Industry professionals guide students on career paths, resume building, and interview skills.', seats: 200, registered: 145, image: null },
  { _id: '4', title: 'Annual Cultural Fest – Zorvexia', category: 'Cultural', date: '2026-06-01', time: '5:00 PM', location: 'Open Air Theatre', description: '3-day cultural extravaganza with music, dance, art, and fashion show competitions.', seats: 2000, registered: 800, image: null },
  { _id: '5', title: 'Inter-College Cricket Tournament', category: 'Sports', date: '2026-04-10', time: '8:00 AM', location: 'Sports Ground', description: 'Competitive cricket league among 12 colleges. Finals with prizes worth ₹1,00,000.', seats: 300, registered: 290, image: null, completed: true },
  { _id: '6', title: 'Blockchain & Web3 Seminar', category: 'Seminar', date: '2026-05-05', time: '11:00 AM', location: 'Seminar Hall B', description: 'Explore the future of decentralized web, NFTs, and blockchain applications in industry.', seats: 150, registered: 80, image: null },
];

const CATEGORY_COLORS = {
  'Tech Fest': { gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)', light: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.4)', text: '#a855f7' },
  Workshop: { gradient: 'linear-gradient(135deg, #d4af37, #f0c040)', light: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.4)', text: '#d4af37' },
  Seminar: { gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', light: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#60a5fa' },
  Cultural: { gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', light: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.4)', text: '#f472b6' },
  Sports: { gradient: 'linear-gradient(135deg, #22c55e, #4ade80)', light: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', text: '#4ade80' },
};

function getDaysLeft(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getDateParts(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
  };
}

const Events = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const { isDark } = useTheme();
  const c = getColors(isDark);

  const filtered = mockEvents.filter(e =>
    activeTab === 'All' || e.category === activeTab
  );

  const featured = mockEvents.find(e => !e.completed && getDaysLeft(e.date) > 0) || mockEvents[0];
  const featuredDays = getDaysLeft(featured.date);
  const featuredColor = CATEGORY_COLORS[featured.category] || CATEGORY_COLORS['Tech Fest'];

  const cardStyle = {
    background: 'rgba(20,20,42,0.8)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, color: c.text }}>

      {/* ── Hero ── */}
      <section style={{ padding: '7rem 1.5rem 3rem', background: `linear-gradient(180deg, ${c.bgPrimary} 0%, ${c.bgSection} 100%)`, position: 'relative', overflow: 'hidden' }}>
        {/* Dot pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(212,175,55,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(124,58,237,0.1), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span style={{ display: 'inline-block', padding: '0.35rem 1.1rem', background: 'rgba(212,175,55,0.1)', border: `1px solid ${c.borderGold}`, borderRadius: '999px', color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Zorvex Institute
            </span>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 800, margin: '0 0 1.25rem', lineHeight: 1.15 }}>
              <span style={{ background: 'linear-gradient(90deg, #d4af37, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Upcoming</span>{' '}
              <span style={{ color: c.text }}>Events</span>
            </h1>
            <p style={{ color: c.textMuted, maxWidth: 560, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Workshops, Seminars &amp; Cultural Fests — stay inspired, stay connected.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
            {[['🎪', mockEvents.filter(e => !e.completed).length + '+', 'Live Events'], ['🏆', '12+', 'Awards'], ['👥', '5000+', 'Participants'], ['📅', '40+', 'Events/Year']].map(([icon, val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{icon}</div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', color: '#d4af37', fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: '0.7rem', color: c.textDim, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lbl}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Event Banner ── */}
      <section style={{ padding: '3rem 1.5rem', background: c.bgPrimary }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ color: '#d4af37', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Featured Event</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'rgba(20,20,42,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: featuredColor.gradient }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: '100%', background: `radial-gradient(ellipse at right, ${featuredColor.light}, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ padding: '2.5rem 2.5rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              {/* Date block */}
              <div style={{ background: featuredColor.light, border: `1px solid ${featuredColor.border}`, borderRadius: '16px', padding: '1.5rem 2rem', textAlign: 'center', flexShrink: 0, minWidth: 90 }}>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', color: featuredColor.text, letterSpacing: '0.15em', marginBottom: '0.25rem' }}>{getDateParts(featured.date).month}</div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.2rem', color: c.text, fontWeight: 800, lineHeight: 1 }}>{getDateParts(featured.date).day}</div>
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span style={{ padding: '0.2rem 0.8rem', background: featuredColor.light, border: `1px solid ${featuredColor.border}`, borderRadius: '6px', color: featuredColor.text, fontSize: '0.7rem', fontWeight: 700 }}>{featured.category}</span>
                  {featuredDays > 0 && <span style={{ padding: '0.2rem 0.8rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '6px', color: '#4ade80', fontSize: '0.7rem', fontWeight: 600 }}>{featuredDays} days left</span>}
                </div>
                <h2 style={{ color: c.text, fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.35 }}>{featured.title}</h2>
                <p style={{ color: c.textMuted, fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{featured.description}</p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <span style={{ color: c.textMuted, fontSize: '0.82rem' }}>🕐 {featured.time}</span>
                  <span style={{ color: c.textMuted, fontSize: '0.82rem' }}>📍 {featured.location}</span>
                  <span style={{ color: c.textMuted, fontSize: '0.82rem' }}>🎫 {featured.registered}/{featured.seats} registered</span>
                </div>
                <button onClick={() => alert(`Register for "${featured.title}" — coming soon!`)}
                  style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.03em' }}>
                  Register Now →
                </button>
              </div>
              {/* Seats progress */}
              <div style={{ minWidth: 180, maxWidth: 220 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ color: c.textMuted, fontSize: '0.72rem', marginBottom: '0.5rem' }}>Seats Filled</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: '#d4af37', fontWeight: 700, marginBottom: '0.75rem' }}>
                    {Math.round((featured.registered / featured.seats) * 100)}%
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(featured.registered / featured.seats) * 100}%`, background: featuredColor.gradient, borderRadius: '3px' }} />
                  </div>
                  <div style={{ color: c.textDim, fontSize: '0.7rem', marginTop: '0.5rem' }}>{featured.registered} of {featured.seats} seats</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <div style={{ padding: '0 1.5rem', position: 'sticky', top: 72, zIndex: 10, backdropFilter: 'blur(16px)', background: 'rgba(5,5,9,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '0.4rem 1.1rem', borderRadius: '8px', border: activeTab === tab ? `1px solid ${c.borderGold}` : '1px solid rgba(255,255,255,0.07)', background: activeTab === tab ? 'rgba(212,175,55,0.12)' : 'transparent', color: activeTab === tab ? '#d4af37' : c.textMuted, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Events Grid ── */}
      <section style={{ padding: '3rem 1.5rem 5rem', background: c.bgPrimary }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionTitle subtitle="All Events" title="Browse & Register" />
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: c.textDim }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem' }}>No events in this category</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((event, i) => {
                const clr = CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Tech Fest'];
                const daysLeft = getDaysLeft(event.date);
                const { day, month } = getDateParts(event.date);
                const pct = Math.round((event.registered / event.seats) * 100);
                return (
                  <motion.div key={event._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, boxShadow: `0 16px 40px ${clr.light}` }}
                    style={{ ...cardStyle, cursor: 'pointer' }}>
                    {/* Category gradient strip */}
                    <div style={{ height: '5px', background: clr.gradient }} />
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Top row: category badge + date badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <span style={{ padding: '0.2rem 0.7rem', background: clr.light, border: `1px solid ${clr.border}`, borderRadius: '6px', color: clr.text, fontSize: '0.68rem', fontWeight: 700 }}>{event.category}</span>
                        {/* Calendar date badge */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.45rem 0.75rem', textAlign: 'center', minWidth: 52 }}>
                          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', color: clr.text, letterSpacing: '0.1em' }}>{month}</div>
                          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', color: c.text, fontWeight: 800, lineHeight: 1 }}>{day}</div>
                        </div>
                      </div>
                      <h3 style={{ color: c.text, fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.45, marginBottom: '0.6rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.title}</h3>
                      <p style={{ color: c.textMuted, fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{event.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <span style={{ color: c.textDim, fontSize: '0.78rem' }}>🕐 {event.time}</span>
                        <span style={{ color: c.textDim, fontSize: '0.78rem' }}>📍 {event.location}</span>
                      </div>
                      {/* Seats bar */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: c.textDim, marginBottom: '0.35rem' }}>
                          <span>Seats</span>
                          <span style={{ color: pct >= 90 ? '#ef4444' : '#d4af37', fontWeight: 600 }}>{event.registered}/{event.seats}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#ef4444' : clr.gradient, borderRadius: '2px' }} />
                        </div>
                      </div>
                      {/* Countdown + CTA */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {!event.completed && daysLeft > 0 && (
                          <span style={{ padding: '0.2rem 0.65rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '6px', color: '#4ade80', fontSize: '0.68rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {daysLeft}d left
                          </span>
                        )}
                        {event.completed ? (
                          <button disabled style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid rgba(100,116,139,0.25)', color: c.textDim, borderRadius: '8px', fontSize: '0.8rem', cursor: 'not-allowed' }}>Completed</button>
                        ) : (
                          <button onClick={() => alert(`Register for "${event.title}" — coming soon!`)}
                            style={{ flex: 1, padding: '0.6rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>
                            Register Now →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ padding: '5rem 1.5rem', background: `linear-gradient(180deg, ${c.bgPrimary}, ${c.bgSection})`, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔔</div>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', color: c.text, marginBottom: '0.75rem' }}>Never Miss an Event</h2>
            <p style={{ color: c.textMuted, marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>Get notified about upcoming workshops, seminars, and cultural fests.</p>
            {subscribed ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ padding: '1rem 2rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', color: '#4ade80', fontWeight: 600 }}>
                🎉 You're subscribed!
              </motion.div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 480, margin: '0 auto', flexWrap: 'wrap' }}>
                <input type="email" placeholder="your@email.com" value={emailSub} onChange={e => setEmailSub(e.target.value)}
                  style={{ flex: 1, padding: '0.85rem 1.1rem', background: 'rgba(20,20,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: c.text, fontSize: '0.9rem', minWidth: 200 }} />
                <button onClick={() => { if (emailSub) setSubscribed(true); }}
                  style={{ padding: '0.85rem 1.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  Subscribe →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Events;
