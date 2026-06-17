/**
 * @file pages/Placement.js
 * @description Placement records and statistics page.
 *
 * Sections:
 *   - Stats bar: total placed, highest package, avg package, companies
 *   - Year filter tabs
 *   - Placement cards: student name, company, package, role
 *
 * Data: getPlacements() + getPlacementStats() APIs
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { getPlacements, getPlacementStats } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const mockStats = { total: 847, companies: 120, avgPackage: 12.4, maxPackage: 48 };
const mockPlacements = [
  { _id: '1', studentName: 'Aarav Sharma', company: 'Google', role: 'Software Engineer', package: 48, course: 'CS', batch: 2025, featured: true, testimonial: 'Zorvex gave me the foundation to crack Google in my first attempt!', photo: '' },
  { _id: '2', studentName: 'Priya Mehta', company: 'Microsoft', role: 'Product Manager', package: 38, course: 'AI/ML', batch: 2025, featured: true, testimonial: 'The faculty here are industry experts who prepared us for real challenges.', photo: '' },
  { _id: '3', studentName: 'Rohit Verma', company: 'Amazon', role: 'Data Engineer', package: 32, course: 'Data Engineering', batch: 2025, featured: true, testimonial: 'The hands-on projects at Zorvex made my resume stand out.', photo: '' },
  { _id: '4', studentName: 'Sneha Gupta', company: 'Meta', role: 'ML Engineer', package: 42, course: 'AI/ML', batch: 2024, featured: false, testimonial: '', photo: '' },
  { _id: '5', studentName: 'Karan Patel', company: 'Flipkart', role: 'Backend Developer', package: 22, course: 'CS', batch: 2024, featured: false, testimonial: '', photo: '' },
  { _id: '6', studentName: 'Anjali Singh', company: 'Infosys', role: 'Systems Analyst', package: 14, course: 'CS', batch: 2025, featured: false, testimonial: '', photo: '' },
  { _id: '7', studentName: 'Dev Nair', company: 'Swiggy', role: 'Full Stack Dev', package: 18, course: 'CS', batch: 2024, featured: false, testimonial: '', photo: '' },
  { _id: '8', studentName: 'Riya Joshi', company: 'Razorpay', role: 'Security Engineer', package: 24, course: 'Cybersecurity', batch: 2025, featured: false, testimonial: '', photo: '' },
];

const companies = [
  { name: 'Google', logo: '🔵', color: '#4285f4', hired: 12 },
  { name: 'Microsoft', logo: '🪟', color: '#00a4ef', hired: 18 },
  { name: 'Amazon', logo: '📦', color: '#ff9900', hired: 24 },
  { name: 'Meta', logo: '🔷', color: '#0668e1', hired: 8 },
  { name: 'Flipkart', logo: '🛒', color: '#2874f0', hired: 31 },
  { name: 'Infosys', logo: '💼', color: '#007cc3', hired: 45 },
  { name: 'TCS', logo: '🏢', color: '#00457c', hired: 52 },
  { name: 'Razorpay', logo: '💳', color: '#2f80ed', hired: 11 },
  { name: 'Zomato', logo: '🍕', color: '#e23744', hired: 9 },
  { name: 'Swiggy', logo: '🛵', color: '#fc8019', hired: 14 },
];

const yearData = [
  { year: '2022', placed: 310, total: 380, avg: 8.2 },
  { year: '2023', placed: 420, total: 490, avg: 10.1 },
  { year: '2024', placed: 530, total: 610, avg: 11.8 },
  { year: '2025', placed: 680, total: 750, avg: 12.4 },
];

const Placement = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [placements, setPlacements] = useState(mockPlacements);
  const [stats, setStats] = useState(mockStats);
  const [filterBatch, setFilterBatch] = useState('All');

  useEffect(() => {
  let active = true;
  getPlacements({}).then(r => { if (active && r.data.data?.length) setPlacements(r.data.data); }).catch(() => {});
  getPlacementStats().then(r => { if (active && r.data.data?.total) setStats(r.data.data); }).catch(() => {});
  return () => { active = false; };
  }, []);

  const batches = ['All', ...new Set(placements.map(p => p.batch))].sort((a, b) => b - a);
  const filtered = filterBatch === 'All' ? placements : placements.filter(p => p.batch === Number(filterBatch));
  const featured = filtered.filter(p => p.featured);

  const statCards = [
    { label: 'Students Placed', value: stats.total || 847, suffix: '+', icon: '🎓' },
    { label: 'Partner Companies', value: stats.companies || 120, suffix: '+', icon: '🏢' },
    { label: 'Avg. Package', value: stats.avgPackage?.toFixed(1) || '12.4', suffix: ' LPA', icon: '💰' },
    { label: 'Highest Package', value: stats.maxPackage || 48, suffix: ' LPA', icon: '🚀' },
  ];

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '4rem 1.5rem 3rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)' }}>
        <SectionTitle subtitle="Career Success" title="Placements" description="Our graduates are shaping the future at the world's most innovative companies." />
      </section>

      {/* Stats */}
      <section style={{ padding: '0 1.5rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#d4af37', lineHeight: 1 }}>{s.value}{s.suffix}</p>
              <p style={{ color: c.textMuted, fontSize: '0.8rem', marginTop: '0.4rem' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Year-wise bar chart */}
        <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', marginBottom: '4rem' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>YEAR-WISE PLACEMENT RECORD</h3>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', height: 180 }}>
            {yearData.map(y => {
              const pct = (y.placed / y.total) * 100;
              const barH = (y.placed / 750) * 140;
              return (
                <div key={y.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#d4af37', fontWeight: 700 }}>{pct.toFixed(0)}%</span>
                  <div style={{ width: '100%', height: barH, background: 'linear-gradient(180deg, #f0c040, #d4af37)', borderRadius: '6px 6px 0 0', position: 'relative', transition: 'height 0.8s ease' }}>
                    <span style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: '0.68rem', color: c.textMuted, whiteSpace: 'nowrap' }}>{y.placed}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: c.textDim }}>{y.year}</span>
                </div>
              );
            })}
          </div>
          <p style={{ textAlign: 'center', color: c.textDim, fontSize: '0.7rem', marginTop: '1rem' }}>Number of students placed per batch</p>
        </div>

        {/* Top Companies */}
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, fontSize: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>Top Recruiting Companies</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
          {companies.map(co => (
            <div key={co.name} style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '1.25rem', textAlign: 'center', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = c.border}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{co.logo}</div>
              <p style={{ color: c.text, fontSize: '0.82rem', fontWeight: 600 }}>{co.name}</p>
              <p style={{ color: c.textDim, fontSize: '0.7rem', marginTop: '0.2rem' }}>{co.hired} hired</p>
            </div>
          ))}
        </div>

        {/* Featured Placements */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, fontSize: '1rem' }}>Student Success Stories</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {batches.map(b => (
              <button key={b} onClick={() => setFilterBatch(String(b))}
                style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: `1px solid ${filterBatch === String(b) ? '#d4af37' : c.border}`, background: filterBatch === String(b) ? 'rgba(212,175,55,0.1)' : 'transparent', color: filterBatch === String(b) ? '#d4af37' : c.textMuted, cursor: 'pointer', fontSize: '0.78rem' }}>
                {b === 'All' ? 'All Batches' : `Batch ${b}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              {p.featured && <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(212,175,55,0.15)', color: '#d4af37', fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.1em' }}>⭐ FEATURED</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1.1rem', fontFamily: 'Orbitron, sans-serif', flexShrink: 0 }}>
                  {p.studentName[0]}
                </div>
                <div>
                  <p style={{ color: c.text, fontWeight: 600, fontSize: '0.9rem' }}>{p.studentName}</p>
                  <p style={{ color: c.textMuted, fontSize: '0.75rem' }}>{p.course} • Batch {p.batch}</p>
                </div>
              </div>
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                <p style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.9rem' }}>{p.company}</p>
                <p style={{ color: c.textMuted, fontSize: '0.78rem' }}>{p.role}</p>
                <p style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.82rem', marginTop: '0.25rem' }}>₹{p.package} LPA</p>
              </div>
              {p.testimonial && (
                <p style={{ color: c.textMuted, fontSize: '0.78rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{p.testimonial}"</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Placement;
