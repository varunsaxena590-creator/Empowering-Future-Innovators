/**
 * @file pages/Home.js
 * @description Homepage - main landing page of Zorvex Institute.
 *
 * Sections:
 *   - 3D Hero (Hero3D component) with headline + 2 CTAs + mini stats
 *   - System Status dashboard with live frontend/backend/database checks
 *   - Stats bar: 4 animated counters (Students, Faculty, Programs, Years)
 *   - Partners marquee: infinite scroll company logos
 *   - Features: 4 cards (AI Learning, Global Network, Research Labs, Career Launch)
 *   - Featured Courses: 3 CourseCards (fetched from API or sample data)
 *   - Upcoming Events: 3 event cards with date badges
 *   - Newsletter signup
 *   - Testimonials: 3 student review cards
 *   - Final CTA: "Ready to Build the Future?"
 *
 * Data: getCourses() API + hardcoded stats/features/testimonials
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import Hero3D from '../components/Hero3D';
import SectionTitle from '../components/SectionTitle';
import CourseCard from '../components/CourseCard';
import Newsletter from '../components/Newsletter';
import { getCourses, getSystemStatus } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const stats = [
  { label: 'Students Enrolled', value: '12,000+', icon: '🎓' },
  { label: 'Expert Faculty', value: '450+', icon: '👨‍🏫' },
  { label: 'Programs', value: '80+', icon: '📚' },
  { label: 'Years of Innovation', value: '15+', icon: '🏆' },
];

const features = [
  { icon: '🤖', title: 'AI-Powered Learning', desc: 'Personalized learning paths driven by machine learning algorithms.' },
  { icon: '🌐', title: 'Global Network', desc: 'Connect with industry leaders and alumni across 60+ countries.' },
  { icon: '🔬', title: 'Research Labs', desc: 'State-of-the-art labs with cutting-edge equipment and resources.' },
  { icon: '🚀', title: 'Career Launch', desc: '97% placement rate with top tech companies worldwide.' },
];

const sampleCourses = [
  { _id: '1', title: 'AI & Machine Learning', department: 'Technology', duration: '4 Years', fees: 8500, seats: 60, description: 'Master deep learning, neural networks, computer vision and NLP with hands-on industry projects.' },
  { _id: '2', title: 'Cybersecurity', department: 'Security', duration: '3 Years', fees: 7200, seats: 50, description: 'Learn ethical hacking, penetration testing, and security architecture for the digital age.' },
  { _id: '3', title: 'Data Engineering', department: 'Engineering', duration: '4 Years', fees: 7800, seats: 55, description: 'Build scalable data pipelines, cloud infrastructure, and real-time analytics systems.' },
];

const testimonials = [
  { name: 'Aisha Patel', course: 'AI & Machine Learning', quote: 'Zorvex completely transformed my career. The hands-on projects and industry mentors gave me an edge that landed me at Google.', avatar: 'A' },
  { name: 'Marcus Chen', course: 'Cybersecurity', quote: 'The research labs here are world-class. I published my first paper in my second year. No other institute comes close.', avatar: 'M' },
  { name: 'Priya Sharma', course: 'Data Engineering', quote: 'From day one I felt like part of a global community. The placement support was incredible - I got 3 offers before graduation!', avatar: 'P' },
];

const statusAppearance = {
  running: { color: '#22c55e', icon: '✔️', label: 'Running' },
  connected: { color: '#22c55e', icon: '✔️', label: 'Connected' },
  down: { color: '#ef4444', icon: '❌', label: 'Down' },
  warning: { color: '#f59e0b', icon: '⚠️', label: 'Warning' },
  checking: { color: '#f59e0b', icon: '⚠️', label: 'Checking' },
};

const createInitialStatuses = () => ([
  {
    key: 'frontend',
    title: 'Frontend Status',
    state: 'running',
    detail: 'This page is already loaded in your browser.',
  },
  {
    key: 'backend',
    title: 'Backend Status',
    state: 'checking',
    detail: 'Waiting for API response.',
  },
  {
    key: 'database',
    title: 'Database Status',
    state: 'checking',
    detail: 'Waiting for backend response.',
  },
]);

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Home = () => {
  const [courses, setCourses] = useState(sampleCourses);
  const [statuses, setStatuses] = useState(createInitialStatuses);
  const [statusLoading, setStatusLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState('');
  const { isDark } = useTheme();
  const c = getColors(isDark);

  useEffect(() => {
    getCourses()
      .then((res) => {
        if (res?.data?.data?.length) setCourses(res.data.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const handleStatusCheck = async () => {
    setStatusLoading(true);
    setStatuses((prev) => prev.map((item) => (
      item.key === 'frontend'
        ? { ...item, state: 'running', detail: 'This page is already loaded in your browser.' }
        : { ...item, state: 'checking', detail: item.key === 'backend' ? 'Checking API availability...' : 'Waiting for backend response...' }
    )));

    try {
      const { data } = await getSystemStatus();
      const databaseName = data?.database?.name && data.database.name !== 'unavailable' ? ` (${data.database.name})` : '';

      setStatuses([
        {
          key: 'frontend',
          title: 'Frontend Status',
          state: 'running',
          detail: data?.frontend?.message || 'This page is already loaded in your browser.',
        },
        {
          key: 'backend',
          title: 'Backend Status',
          state: data?.backend?.status || 'running',
          detail: data?.backend?.message || 'Backend API is responding normally.',
        },
        {
          key: 'database',
          title: 'Database Status',
          state: data?.database?.status || 'warning',
          detail: data?.database?.message || `Database state: ${data?.database?.state || 'unknown'}${databaseName}`,
        },
      ]);

      setLastChecked(data?.checkedAt || new Date().toISOString());
    } catch (error) {
      setStatuses([
        {
          key: 'frontend',
          title: 'Frontend Status',
          state: 'running',
          detail: 'This page is already loaded in your browser.',
        },
        {
          key: 'backend',
          title: 'Backend Status',
          state: 'down',
          detail: 'Status API is not reachable right now.',
        },
        {
          key: 'database',
          title: 'Database Status',
          state: 'warning',
          detail: 'Database status depends on backend response.',
        },
      ]);
      setLastChecked(new Date().toISOString());
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    handleStatusCheck();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 15000,
    });

    socket.on('systemStatus', (payload) => {
      const databaseName = payload?.database?.name && payload.database.name !== 'unavailable' ? ` (${payload.database.name})` : '';

      setStatuses([
        {
          key: 'frontend',
          title: 'Frontend Status',
          state: 'running',
          detail: 'This page is already loaded in your browser.',
        },
        {
          key: 'backend',
          title: 'Backend Status',
          state: payload?.backend?.status || 'running',
          detail: payload?.backend?.message || 'Backend API is responding normally.',
        },
        {
          key: 'database',
          title: 'Database Status',
          state: payload?.database?.status || 'warning',
          detail: payload?.database?.message || `Database state: ${payload?.database?.state || 'unknown'}${databaseName}`,
        },
      ]);

      setLastChecked(payload?.checkedAt || new Date().toISOString());
      setStatusLoading(false);
    });

    socket.on('connect_error', () => {
      setStatusLoading(false);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <main style={{ background: c.bgMain }}>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Hero3D />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: c.overlay, zIndex: 1 }} />
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: '0 1.5rem', paddingTop: '5rem', width: '100%' }}>
          <motion.div style={{ maxWidth: 640 }} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="badge-pulse"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: '999px', fontSize: '0.78rem', color: '#d4af37', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '1.75rem' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4af37', display: 'inline-block' }} />
              Welcome to Zorvex Institute
            </motion.div>

            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: c.text, lineHeight: 1.15, marginBottom: '1.5rem', fontWeight: 700 }}>
              Empowering <span className="gradient-gold gold-text-glow">Future</span>
              <br />
              Innovators
            </h1>

            <p style={{ color: c.textMuted, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.25rem', maxWidth: 520 }}>
              Where technology meets ambition. Build the skills, network, and mindset to lead the next generation of global innovation.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/admission" className="btn-gold" style={{ padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                Apply Now →
              </Link>
              <Link to="/courses" style={{ padding: '0.85rem 2rem', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', background: 'rgba(212,175,55,0.05)' }}>
                Explore Programs
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[['12K+', 'Students'], ['450+', 'Faculty'], ['97%', 'Placement']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', color: '#d4af37', fontWeight: 700 }}>{val}</p>
                  <p style={{ fontSize: '0.75rem', color: c.textDim, marginTop: '0.1rem' }}>{lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
        >
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.5))' }} />
          <span style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
        </motion.div>
      </section>

      {/* System Status */}
      <section style={{ padding: '5rem 1.5rem', background: c.bgSection, borderTop: `1px solid ${c.borderGold}`, borderBottom: `1px solid ${c.borderGold}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ maxWidth: 720 }}>
              <SectionTitle subtitle="Live Monitor" title="System Status" description="Track frontend, backend, and database health from the homepage like a real-time dashboard." />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
              {lastChecked ? (
                <span style={{ fontSize: '0.8rem', color: c.textDim }}>
                  Last checked: {new Date(lastChecked).toLocaleTimeString()}
                </span>
              ) : null}

              <button
                type="button"
                onClick={handleStatusCheck}
                disabled={statusLoading}
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(212,175,55,0.35)',
                  background: statusLoading ? 'rgba(212,175,55,0.12)' : 'linear-gradient(135deg, #d4af37, #f0c040)',
                  color: statusLoading ? '#d4af37' : '#050509',
                  fontWeight: 700,
                  cursor: statusLoading ? 'wait' : 'pointer',
                  minWidth: 150,
                }}
              >
                {statusLoading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {statuses.map((item, index) => {
              const appearance = statusAppearance[item.state] || statusAppearance.warning;

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  style={{
                    background: c.bgCard,
                    border: `1px solid ${appearance.color}55`,
                    borderRadius: '18px',
                    padding: '1.5rem',
                    boxShadow: `0 14px 40px ${appearance.color}12`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ color: c.textDim, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                        {item.title}
                      </p>
                      <h3 style={{ color: c.text, fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{appearance.label}</h3>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{appearance.icon}</span>
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: `${appearance.color}18`, color: appearance.color, border: `1px solid ${appearance.color}33`, fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.9rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: appearance.color, display: 'inline-block' }} />
                    {appearance.label}
                  </div>

                  <p style={{ color: c.textMuted, fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
                    {item.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 1.5rem', background: c.bgPrimary, borderTop: `1px solid ${c.borderGold}`, borderBottom: `1px solid ${c.borderGold}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '2.5rem 1rem', borderRight: i < stats.length - 1 ? '1px solid rgba(212,175,55,0.08)' : 'none', position: 'relative' }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem', filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.3))' }}>{stat.icon}</div>
                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#d4af37', fontWeight: 700, lineHeight: 1, marginBottom: '0.4rem' }}>{stat.value}</p>
                <p style={{ color: c.textDim, fontSize: '0.73rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section style={{ padding: '3rem 0', background: c.bgMain, borderTop: `1px solid ${c.borderGold}`, overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', color: c.textDim, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Trusted by students placed at</p>
        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'OpenAI', 'Tesla', 'NVIDIA', 'Stripe', 'Airbnb', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'OpenAI', 'Tesla', 'NVIDIA', 'Stripe', 'Airbnb'].map((name, i) => (
              <span key={i} style={{ color: c.textDim, fontSize: '0.95rem', fontWeight: 600, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em', whiteSpace: 'nowrap', padding: '0.4rem 1.25rem', border: `1px solid ${c.borderGold}`, borderRadius: '8px' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 1.5rem', background: c.bgMain }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="hover-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}
              >
                <span style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', color: 'rgba(212,175,55,0.2)', fontWeight: 700 }}>
                  0{i + 1}
                </span>
                <div style={{ fontSize: '2.2rem', marginBottom: '1.25rem', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.2))' }}>{feature.icon}</div>
                <h4 style={{ color: c.text, fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '0.01em' }}>{feature.title}</h4>
                <p style={{ color: c.textDim, fontSize: '0.84rem', lineHeight: 1.75 }}>{feature.desc}</p>
                <div className="feature-accent-line" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)', opacity: 0, transition: 'opacity 0.3s' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section style={{ padding: '6rem 1.5rem', background: c.bgSection }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <SectionTitle subtitle="Programs" title="Featured Courses" description="Industry-designed programs built with the future of technology in mind." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {courses.map((course, i) => <CourseCard key={course._id} course={course} index={i} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/courses" style={{ padding: '0.8rem 2.25rem', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', background: 'rgba(212,175,55,0.05)' }}>
              View All Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section style={{ padding: '6rem 1.5rem', background: c.bgMain }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <SectionTitle subtitle="What's On" title="Upcoming Events" description="Don't miss out on workshops, seminars, hackathons, and cultural fests." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { month: 'APR', day: '10', type: 'Cultural', title: 'Zorvex Fest 2026', venue: 'Open Air Theatre', color: '#f59e0b' },
              { month: 'APR', day: '18', type: 'Workshop', title: 'Full-Stack Dev Bootcamp', venue: 'Lab 3, Tech Block', color: '#22c55e' },
              { month: 'MAY', day: '15', type: 'Hackathon', title: 'ZorvexHack 2026', venue: 'Innovation Hub', color: '#7c3aed' },
            ].map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="hover-card"
                style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
              >
                <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', padding: '0.5rem 0.75rem', textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', color: '#d4af37', letterSpacing: '0.1em' }}>{event.month}</p>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', color: c.text, fontWeight: 700, lineHeight: 1 }}>{event.day}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: event.color, fontWeight: 600, background: `${event.color}18`, padding: '0.15rem 0.5rem', borderRadius: '5px', border: `1px solid ${event.color}33` }}>{event.type}</span>
                  <h4 style={{ color: c.text, fontSize: '0.9rem', fontWeight: 600, marginTop: '0.4rem', marginBottom: '0.3rem' }}>{event.title}</h4>
                  <p style={{ color: c.textDim, fontSize: '0.75rem' }}>📍 {event.venue}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/events" style={{ padding: '0.8rem 2.25rem', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', background: 'rgba(212,175,55,0.05)' }}>
              View All Events & News →
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '3rem 1.5rem 0', background: c.bgMain }}>
        <Newsletter />
      </section>

      {/* Testimonials */}
      <section style={{ padding: '6rem 1.5rem', background: c.bgPrimary, borderTop: `1px solid ${c.borderGold}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <SectionTitle subtitle="Student Stories" title="What Our Students Say" description="Real experiences from the Zorvex community shaping the world." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="hover-card"
                style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: '-0.5rem', right: '1rem', fontSize: '6rem', color: 'rgba(212,175,55,0.06)', lineHeight: 1, fontFamily: 'Georgia, serif', pointerEvents: 'none', userSelect: 'none' }}>"</div>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, starIndex) => <span key={starIndex} style={{ color: '#d4af37', fontSize: '0.75rem' }}>★</span>)}
                  <span style={{ marginLeft: '0.3rem', fontSize: '0.68rem', background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.2)', fontWeight: 600 }}>Verified</span>
                </div>
                <p style={{ color: c.textMuted, fontSize: '0.87rem', lineHeight: 1.85, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{testimonial.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderTop: `1px solid ${c.borderGold}`, paddingTop: '1rem' }}>
                  <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.95rem', flexShrink: 0 }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p style={{ color: c.text, fontWeight: 700, fontSize: '0.88rem' }}>{testimonial.name}</p>
                    <p style={{ color: '#d4af37', fontSize: '0.73rem', marginTop: '0.1rem', fontWeight: 500 }}>{testimonial.course}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '7rem 1.5rem', background: isDark ? 'linear-gradient(135deg, #050509 0%, #0a0a20 50%, #050509 100%)' : 'linear-gradient(135deg, #f8f9fb 0%, #eef0f5 50%, #f8f9fb 100%)', borderTop: `1px solid ${c.borderGold}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '40%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(212,175,55,0.06), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '999px', fontSize: '0.73rem', color: '#d4af37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.75rem', fontWeight: 600 }}>
              🚀 Admissions Open 2026-27
            </span>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: c.text, marginBottom: '1.25rem', fontWeight: 700, lineHeight: 1.25 }}>
              Ready to Build
              <br />
              <span style={{ background: 'linear-gradient(135deg, #d4af37, #f0c040)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>the Future?</span>
            </h2>
            <p style={{ color: c.textMuted, fontSize: '1rem', lineHeight: 1.85, maxWidth: 520, margin: '0 auto 3rem' }}>
              Join 12,000+ students shaping tomorrow&apos;s world at Zorvex Institute. Applications close soon - secure your seat today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/admission"
                style={{ padding: '1rem 2.8rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 800, borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', letterSpacing: '0.04em', boxShadow: '0 8px 30px rgba(212,175,55,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,175,55,0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.3)';
                }}
              >
                Apply Now →
              </Link>
              <Link
                to="/courses"
                style={{ padding: '1rem 2.2rem', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', transition: 'all 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
                }}
              >
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
