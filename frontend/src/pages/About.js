/**
 * @file pages/About.js
 * @description About Us page — institute history, mission & leadership.
 *
 * Sections:
 *   - Hero with subtitle badge
 *   - Mission & Vision: 2 side-by-side cards (gold/purple)
 *   - Core Values: 4-column grid (Innovation, Excellence, Integrity, Global Vision)
 *   - Timeline/Milestones: vertical timeline (2009–2024)
 *   - Leadership Team: 4 member cards with avatar gradients
 *
 * Data: All static/hardcoded
 */
import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const values = [
  { icon: '⚡', title: 'Innovation First', desc: 'We challenge conventions and pioneer solutions to tomorrow\'s problems today.' },
  { icon: '🎯', title: 'Excellence', desc: 'We hold ourselves to the highest standards in education, research, and impact.' },
  { icon: '🤝', title: 'Integrity', desc: 'Transparency, ethics, and honesty define every interaction at Zorvex.' },
  { icon: '🌍', title: 'Global Vision', desc: 'We build bridges across cultures, industries, and borders for a better world.' },
];

const milestones = [
  { year: '2009', event: 'Zorvex Institute founded with 200 students' },
  { year: '2012', event: 'First AI research lab established' },
  { year: '2015', event: 'Launched online learning platform' },
  { year: '2018', event: 'Partnerships with 50 global tech companies' },
  { year: '2021', event: 'Reached 10,000+ students milestone' },
  { year: '2024', event: 'Opened innovation hub in 3 cities' },
];

const team = [
  { name: 'Dr. Arjun Mehta', role: 'Founder & President', dept: 'Computer Science' },
  { name: 'Prof. Priya Shah', role: 'Dean of Engineering', dept: 'Engineering' },
  { name: 'Dr. Ravi Kumar', role: 'Director of Research', dept: 'AI & ML' },
  { name: 'Ms. Neha Verma', role: 'Head of Admissions', dept: 'Administration' },
];

const About = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
  <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>

    {/* ── Hero Section ── */}
    <section style={{ padding: '5rem 1.5rem', background: `linear-gradient(to bottom, ${c.bgPrimary}, ${c.bgMain})`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(212,175,55,0.06), transparent 70%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div style={{ maxWidth: 1320, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '999px', color: '#d4af37', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Our Story
          </span>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: c.text, margin: '0 0 1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            About{' '}
            <span className="gradient-gold">Zorvex Institute</span>
          </h1>
          <p style={{ color: c.textMuted, maxWidth: 680, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.9 }}>
            Founded in 2009, Zorvex Institute was built on one radical idea: that education should be as dynamic and innovative as the technology reshaping our world. We exist to create the builders, thinkers, and leaders of tomorrow.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ── Mission + Vision ── */}
    <section style={{ padding: '5rem 1.5rem', background: c.bgMain }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {[
          { title: 'Our Mission', icon: '🚀', color: '#d4af37', text: 'To deliver transformative, technology-driven education that equips every student with the skills, mindset, and network to lead in a rapidly evolving world.' },
          { title: 'Our Vision', icon: '🌟', color: '#7c3aed', text: 'To become the world\'s most innovative institute — a hub where breakthroughs happen, industry partnerships flourish, and students become global change-makers.' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, x: i === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="hover-card" style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2.5rem' }}>
            <div style={{ width: 52, height: 52, background: i === 0 ? 'rgba(212,175,55,0.12)' : 'rgba(124,58,237,0.12)', border: `1px solid ${i === 0 ? 'rgba(212,175,55,0.3)' : 'rgba(124,58,237,0.3)'}`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              {item.icon}
            </div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', color: item.color, marginBottom: '0.85rem', fontWeight: 600 }}>{item.title}</h3>
            <p style={{ color: c.textMuted, lineHeight: 1.8, fontSize: '0.9rem' }}>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── Core Values ── */}
    <section style={{ padding: '5rem 1.5rem', background: c.bgSection }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <SectionTitle subtitle="What We Stand For" title="Core Values" description="The principles that guide every decision and interaction at Zorvex Institute." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="hover-card" style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{v.icon}</div>
              <h4 style={{ color: '#d4af37', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 600 }}>{v.title}</h4>
              <p style={{ color: c.textDim, fontSize: '0.82rem', lineHeight: 1.7 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Timeline ── */}
    <section style={{ padding: '5rem 1.5rem', background: c.bgMain }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <SectionTitle subtitle="Our Journey" title="Milestones" />
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #d4af37, #7c3aed, transparent)' }} />
          {milestones.map((m, i) => (
            <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ position: 'relative', marginBottom: '1.75rem', paddingLeft: '1.5rem' }}>
              {/* Dot */}
              <div style={{ position: 'absolute', left: -2.5 - 16, top: '0.3rem', width: 10, height: 10, borderRadius: '50%', background: '#d4af37', border: `2px solid ${c.bgMain}`, transform: 'translateX(-50%)' }} />
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', color: '#d4af37', fontWeight: 600, letterSpacing: '0.08em' }}>{m.year}</span>
              <p style={{ color: c.textMuted, fontSize: '0.88rem', marginTop: '0.2rem' }}>{m.event}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Leadership ── */}
    <section style={{ padding: '5rem 1.5rem', background: c.bgSection }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <SectionTitle subtitle="The Team" title="Leadership" description="Visionaries and experts driving Zorvex's mission forward." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {team.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="hover-card" style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(124,58,237,0.2))', border: `1px solid ${c.borderGold}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontWeight: 700 }}>
                {t.name.replace(/^(Dr\.|Prof\.|Ms\.|Mr\.)\s+/, '')[0]}
              </div>
              <h4 style={{ color: c.text, fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t.name}</h4>
              <p style={{ color: '#d4af37', fontSize: '0.78rem', marginBottom: '0.25rem' }}>{t.role}</p>
              <p style={{ color: c.textDim, fontSize: '0.75rem' }}>{t.dept}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </main>
  );
};

export default About;
