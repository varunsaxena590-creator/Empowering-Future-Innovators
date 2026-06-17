/**
 * @file pages/Blog.js
 * @description Institute news & blog page.
 *
 * Sections:
 *   - Featured post: large card with category gradient background
 *   - Sticky filter tabs: News, Academic, Achievements, Events, Campus Life
 *   - Blog grid: cards with author info, date, read time
 *   - Newsletter CTA
 *
 * Data: mockPosts (hardcoded), category-specific colors
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const mockPosts = [
  { _id: '1', title: 'Zorvex Institute Ranks #1 in State Engineering Rankings 2026', category: 'Achievements', excerpt: 'For the third consecutive year, Zorvex Institute has secured the top position in the state engineering rankings, recognized for academic excellence, research output, and placement records.', author: 'Dr. Rajesh Kumar', date: '2026-03-28', readTime: '4 min', featured: true },
  { _id: '2', title: '100% Placement for CSE Batch 2026', category: 'News', excerpt: 'The Computer Science batch of 2026 achieves a historic 100% placement record with average package of ₹12.5 LPA.', author: 'Placement Cell', date: '2026-03-20', readTime: '3 min' },
  { _id: '3', title: 'New State-of-the-Art AI Research Lab Inaugurated', category: 'Campus Life', excerpt: 'The institute inaugurated its new AI & Robotics research lab equipped with GPU clusters and cutting-edge hardware.', author: 'Admin', date: '2026-03-15', readTime: '5 min' },
  { _id: '4', title: 'Students Win National Hackathon 2026', category: 'Achievements', excerpt: 'Team Zorvex from CSE department clinched first place at the National Smart India Hackathon 2026 held in Delhi.', author: 'Dr. Priya Sharma', date: '2026-03-10', readTime: '3 min' },
  { _id: '5', title: 'New Academic Calendar 2026-27 Released', category: 'Academic', excerpt: 'The Academic Affairs committee has released the official academic calendar for the year 2026-27. Key dates include semester start, mid-terms, and examination schedules.', author: 'Academic Office', date: '2026-03-05', readTime: '2 min' },
  { _id: '6', title: 'Annual Sports Week Highlights', category: 'Events', excerpt: 'Zorvex Sports Week 2026 concluded with over 1,200 participants competing across 15 different sports categories.', author: 'Sports Committee', date: '2026-02-28', readTime: '4 min' },
];

const FILTER_TABS = ['All', 'News', 'Academic', 'Achievements', 'Events', 'Campus Life'];

const CAT_COLORS = {
  Achievements: { bg: 'linear-gradient(135deg, #d4af37 0%, #7c3aed 100%)', text: '#d4af37', light: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.35)' },
  News: { bg: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', text: '#60a5fa', light: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)' },
  'Campus Life': { bg: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)', text: '#4ade80', light: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)' },
  Academic: { bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', text: '#a855f7', light: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)' },
  Events: { bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', text: '#f472b6', light: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.35)' },
};

const getColor = cat => CAT_COLORS[cat] || CAT_COLORS['News'];

const Blog = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [activeTab, setActiveTab] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featuredPost = mockPosts.find(p => p.featured);
  const filtered = mockPosts.filter(p =>
    !p.featured && (activeTab === 'All' || p.category === activeTab)
  );

  const cardStyle = {
    background: 'rgba(20,20,42,0.8)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, color: c.text }}>

      {/* ── Hero ── */}
      <section style={{ padding: '7rem 1.5rem 3.5rem', background: `linear-gradient(180deg, ${c.bgPrimary} 0%, ${c.bgSection} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(124,58,237,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 350, background: 'radial-gradient(ellipse, rgba(212,175,55,0.08), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span style={{ display: 'inline-block', padding: '0.35rem 1.1rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '999px', color: '#a855f7', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Institute Updates
            </span>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 800, margin: '0 0 1.25rem', lineHeight: 1.15 }}>
              <span style={{ color: c.text }}>Institute News </span>
              <span style={{ background: 'linear-gradient(90deg, #d4af37, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>&amp; Blog</span>
            </h1>
            <p style={{ color: c.textMuted, maxWidth: 560, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Research breakthroughs, campus stories, placement records, and everything happening at Zorvex Institute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Post ── */}
      {featuredPost && (
        <section style={{ padding: '3rem 1.5rem', background: c.bgPrimary }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ color: '#d4af37', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>⭐ Featured Post</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ background: 'rgba(20,20,42,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
              {/* Gradient image placeholder */}
              <div style={{ height: '220px', background: getColor(featuredPost.category).bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(20,20,42,0.95) 100%)' }} />
                <span style={{ fontSize: '4rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>📰</span>
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2 }}>
                  <span style={{ padding: '0.25rem 0.8rem', background: 'rgba(0,0,0,0.6)', border: `1px solid ${getColor(featuredPost.category).border}`, borderRadius: '6px', color: getColor(featuredPost.category).text, fontSize: '0.7rem', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              <div style={{ padding: '2rem 2.5rem 2.5rem' }}>
                <h2 style={{ color: c.text, fontSize: 'clamp(1.2rem, 3vw, 1.75rem)', fontWeight: 700, lineHeight: 1.35, marginBottom: '1rem' }}>{featuredPost.title}</h2>
                <p style={{ color: c.textDim, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: 760 }}>{featuredPost.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>
                      {featuredPost.author[0]}
                    </div>
                    <div>
                      <div style={{ color: c.text, fontSize: '0.85rem', fontWeight: 600 }}>{featuredPost.author}</div>
                      <div style={{ color: c.textDim, fontSize: '0.75rem' }}>{featuredPost.date} · {featuredPost.readTime} read</div>
                    </div>
                  </div>
                  <button onClick={() => alert(`Reading "${featuredPost.title}" — full post coming soon!`)}
                    style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}>
                    Read More →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Filter Tabs ── */}
      <div style={{ padding: '0 1.5rem', position: 'sticky', top: 72, zIndex: 10, backdropFilter: 'blur(16px)', background: c.navBg, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '0.4rem 1.1rem', borderRadius: '8px', border: activeTab === tab ? `1px solid ${c.borderGold}` : `1px solid ${c.border}`, background: activeTab === tab ? 'rgba(212,175,55,0.12)' : 'transparent', color: activeTab === tab ? '#d4af37' : c.textDim, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Blog Grid ── */}
      <section style={{ padding: '3.5rem 1.5rem 5rem', background: c.bgPrimary }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionTitle subtitle="Latest Articles" title="News & Stories" />
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: c.textDim }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem' }}>No posts in this category</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((post, i) => {
                const clr = getColor(post.category);
                return (
                  <motion.div key={post._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, boxShadow: `0 16px 40px ${clr.light}` }}
                    style={{ ...cardStyle, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                    {/* Image placeholder */}
                    <div style={{ height: '140px', background: clr.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(20,20,42,0.7) 100%)' }} />
                      <span style={{ fontSize: '2.5rem', position: 'relative', zIndex: 1 }}>
                        {post.category === 'Achievements' ? '🏆' : post.category === 'News' ? '📰' : post.category === 'Campus Life' ? '🏫' : post.category === 'Academic' ? '📚' : '🎉'}
                      </span>
                      {/* Category badge top-left */}
                      <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 2 }}>
                        <span style={{ padding: '0.2rem 0.65rem', background: 'rgba(0,0,0,0.55)', border: `1px solid ${clr.border}`, borderRadius: '5px', color: clr.text, fontSize: '0.65rem', fontWeight: 700, backdropFilter: 'blur(6px)' }}>
                          {post.category}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ color: c.text, fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.45, marginBottom: '0.65rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.title}
                      </h3>
                      <p style={{ color: c.textDim, fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1.1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 28, height: 28, background: clr.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>
                            {post.author[0]}
                          </div>
                          <div>
                            <div style={{ color: c.textMuted, fontSize: '0.72rem', fontWeight: 600 }}>{post.author}</div>
                            <div style={{ color: c.textDim, fontSize: '0.65rem' }}>{post.date} · {post.readTime} read</div>
                          </div>
                        </div>
                        <button onClick={() => alert(`Full post: "${post.title}" — coming soon!`)}
                          style={{ background: 'none', border: 'none', color: clr.text, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Read More →
                        </button>
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
      <section style={{ padding: '5rem 1.5rem', background: `linear-gradient(180deg, ${c.bgPrimary}, ${c.bgSection})`, borderTop: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', color: c.text, marginBottom: '0.75rem' }}>Stay in the Loop</h2>
            <p style={{ color: c.textDim, marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>Subscribe to get the latest news, achievements, and campus updates delivered to your inbox.</p>
            {subscribed ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ padding: '1rem 2rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', color: '#d4af37', fontWeight: 600 }}>
                🎉 You're subscribed to Zorvex updates!
              </motion.div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 500, margin: '0 auto', flexWrap: 'wrap' }}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, padding: '0.85rem 1.1rem', background: c.bgCardAlpha, border: `1px solid ${c.border}`, borderRadius: '10px', color: c.text, fontSize: '0.9rem', minWidth: 200 }} />
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { if (email) setSubscribed(true); }}
                  style={{ padding: '0.85rem 1.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  Subscribe →
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Blog;
