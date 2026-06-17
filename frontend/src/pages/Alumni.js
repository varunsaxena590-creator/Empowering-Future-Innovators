/**
 * @file pages/Alumni.js
 * @description Alumni directory and success stories.
 *
 * Features:
 *   - Batch year filter tabs
 *   - Alumni cards: photo, name, batch, company, designation
 *   - Search alumni by name or company
 *
 * Data: getAlumni() API
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { getAlumni } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const mockAlumni = [
  { _id: '1', name: 'Aarav Sharma', batch: 2022, course: 'B.Tech CS', currentRole: 'Senior Software Engineer', company: 'Google', location: 'San Francisco, USA', achievements: ['GPA 9.2', 'Gold Medalist', 'ACM ICPC Finalist'], testimonial: 'Zorvex gave me the skills and confidence to compete globally. The faculty mentorship was exceptional.', featured: true },
  { _id: '2', name: 'Priya Mehta', batch: 2021, course: 'B.Tech AI/ML', currentRole: 'ML Research Scientist', company: 'Meta AI', location: 'New York, USA', achievements: ['Published 3 Papers', 'Top 1% Graduate', 'Research Excellence Award'], testimonial: 'The research culture at Zorvex pushed me to publish my first paper during my final year.', featured: true },
  { _id: '3', name: 'Rohit Verma', batch: 2023, course: 'B.Tech Data Eng', currentRole: 'Data Engineer', company: 'Amazon', location: 'Seattle, USA', achievements: ['AWS Certified', 'Hackathon Winner'], testimonial: 'Hands-on projects prepared me for real-world data engineering challenges.', featured: true },
  { _id: '4', name: 'Sneha Gupta', batch: 2020, course: 'B.Tech CS', currentRole: 'Product Manager', company: 'Flipkart', location: 'Bengaluru, India', achievements: ['Best Startup Award 2022', 'Forbes 30u30'], testimonial: '', featured: false },
  { _id: '5', name: 'Karan Patel', batch: 2022, course: 'MBA BizTech', currentRole: 'Co-Founder & CTO', company: 'TechnoVate', location: 'Mumbai, India', achievements: ['Raised ₹2Cr Seed', 'TiE Startup Award'], testimonial: 'The entrepreneurship cell at Zorvex was where our startup journey began.', featured: true },
  { _id: '6', name: 'Anjali Singh', batch: 2021, course: 'B.Tech Cybersecurity', currentRole: 'Security Architect', company: 'Microsoft', location: 'Hyderabad, India', achievements: ['CISSP Certified', 'Bug Bounty Hunter'], testimonial: 'The cybersecurity labs are state-of-the-art. Best decision of my life!', featured: false },
  { _id: '7', name: 'Dev Nair', batch: 2023, course: 'B.Tech CS', currentRole: 'Backend Developer', company: 'Razorpay', location: 'Bengaluru, India', achievements: ['Open Source Contributor', '500k GitHub Stars'], testimonial: '', featured: false },
  { _id: '8', name: 'Riya Joshi', batch: 2020, course: 'M.Tech AI', currentRole: 'AI/ML Lead', company: 'Infosys', location: 'Pune, India', achievements: ['Patent Holder', 'Best Thesis Award'], testimonial: '', featured: false },
];

const batches = ['All', 2023, 2022, 2021, 2020];

const AlumniCard = ({ a, c }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    style={{ background: c.bgCard, border: `1px solid ${a.featured ? c.borderGold : c.border}`, borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
    {a.featured && (
      <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontSize: '0.6rem', fontWeight: 800, padding: '4px 12px', borderRadius: '0 14px 0 10px', letterSpacing: '0.1em' }}>⭐ FEATURED</div>
    )}
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1.2rem', fontFamily: 'Orbitron, sans-serif', flexShrink: 0 }}>
        {a.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: c.text, fontSize: '0.95rem', fontWeight: 700 }}>{a.name}</h3>
        <p style={{ color: '#d4af37', fontSize: '0.8rem', marginTop: '0.15rem' }}>{a.currentRole}</p>
        <p style={{ color: c.textMuted, fontSize: '0.75rem' }}>{a.company} • {a.location}</p>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: '0.67rem', color: c.textMuted, background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: '4px' }}>🎓 {a.course}</span>
      <span style={{ fontSize: '0.67rem', color: c.textMuted, background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: '4px' }}>Batch {a.batch}</span>
      {a.achievements?.map(ach => <span key={ach} style={{ fontSize: '0.67rem', color: '#d4af37', background: 'rgba(212,175,55,0.08)', padding: '2px 7px', borderRadius: '4px' }}>🏆 {ach}</span>)}
    </div>
    {a.testimonial && (
      <p style={{ color: c.textMuted, fontSize: '0.78rem', lineHeight: 1.7, fontStyle: 'italic', borderTop: `1px solid ${c.border}`, paddingTop: '0.75rem' }}>
        "{a.testimonial}"
      </p>
    )}
  </motion.div>
);

const Alumni = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [alumni, setAlumni] = useState(mockAlumni);
  const [filterBatch, setFilterBatch] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
  let active = true;
  getAlumni({}).then(r => { if (active && r.data.data?.length) setAlumni(r.data.data); }).catch(() => {});
  return () => { active = false; };
  }, []);

  const filtered = alumni.filter(a =>
    (filterBatch === 'All' || a.batch === filterBatch) &&
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.company?.toLowerCase().includes(search.toLowerCase()) || a.currentRole?.toLowerCase().includes(search.toLowerCase()))
  );
  const featured = filtered.filter(a => a.featured);
  const rest = filtered.filter(a => !a.featured);

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(212,175,55,0.04) 0%, transparent 100%)' }}>
        <SectionTitle subtitle="Our Alumni" title="Alumni Network" description="Zorvex graduates are shaping industries, launching startups, and leading teams at top global companies." />
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          {[['1200+', 'Alumni Worldwide'], ['42+', 'Countries'], ['85%', 'Employed in 6 Months'], ['₹12L', 'Avg. Salary']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#d4af37' }}>{val}</p>
              <p style={{ color: c.textDim, fontSize: '0.75rem' }}>{lbl}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 1200, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: c.textDim }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alumni by name, company, role..."
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.875rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {batches.map(b => (
              <button key={String(b)} onClick={() => setFilterBatch(b)}
                style={{ padding: '0.45rem 1rem', borderRadius: '20px', border: `1px solid ${filterBatch === b ? '#d4af37' : c.border}`, background: filterBatch === b ? 'rgba(212,175,55,0.1)' : 'transparent', color: filterBatch === b ? '#d4af37' : c.textMuted, cursor: 'pointer', fontSize: '0.78rem' }}>
                {b === 'All' ? 'All Batches' : `Batch ${b}`}
              </button>
            ))}
          </div>
        </div>

        {featured.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>⭐ Featured Alumni</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
              {featured.map(a => <AlumniCard key={a._id} a={a} c={c} />)}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div>
            <p style={{ color: c.textDim, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>All Alumni</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
              {rest.map(a => <AlumniCard key={a._id} a={a} c={c} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: c.textDim }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No alumni found for this search.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Alumni;
