/**
 * @file admin/Dashboard.js
 * @description Admin dashboard with stats overview cards and charts.
 *
 * Stats: Total Students, Courses, Faculty, Contacts, Placements, Revenue
 * Charts: Enrollment trends, department distribution
 * Recent: Latest applications, notices, contacts
 *
 * Data: Multiple API calls for aggregated stats
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import { getStudents, getCourses, getContacts, getGallery } from '../utils/api';

/* ── Glassmorphism Stat Card ── */
const StatCard = ({ icon, label, value, color, glowColor, subText, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 120 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'rgba(20,20,42,0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '1.6rem 1.5rem 1.4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hovered
          ? `0 8px 32px ${glowColor}40, 0 0 0 1px ${glowColor}30`
          : `0 2px 12px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Gradient top border strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />

      {/* Left content */}
      <div>
        <p style={{
          color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem',
          textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
        }}>{label}</p>
        <p style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: '2.4rem',
          color: '#f1f5f9', fontWeight: 700, lineHeight: 1, marginBottom: '0.4rem',
        }}>{value}</p>
        <p style={{ color: '#475569', fontSize: '0.72rem' }}>{subText}</p>
      </div>

      {/* Right icon circle */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: `${glowColor}18`,
        border: `1.5px solid ${glowColor}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.8rem', flexShrink: 0,
        boxShadow: hovered ? `0 0 20px ${glowColor}60` : `0 0 10px ${glowColor}30`,
        transition: 'box-shadow 0.25s ease',
      }}>
        {icon}
      </div>
    </motion.div>
  );
};

/* ── Quick Action Card ── */
const QuickCard = ({ icon, label, to, color, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.06, type: 'spring', stiffness: 130 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={to} style={{ textDecoration: 'none' }}>
        <div style={{
          position: 'relative',
          background: 'rgba(20,20,42,0.75)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${hovered ? color + '55' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: '14px',
          padding: '1.4rem 1rem',
          textAlign: 'center',
          overflow: 'hidden',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? `0 8px 24px ${color}30` : '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'all 0.22s ease',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.65rem' }}>{icon}</div>
          <p style={{
            color: hovered ? '#f1f5f9' : '#94a3b8',
            fontSize: '0.8rem', fontWeight: 600,
            transition: 'color 0.2s',
            letterSpacing: '0.02em',
          }}>{label}</p>
        </div>
      </Link>
    </motion.div>
  );
};

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    approved: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', label: '✓ Approved' },
    rejected: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: '✕ Rejected' },
    pending:  { bg: 'rgba(212,175,55,0.15)', color: '#d4af37', label: '◎ Pending' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.72rem',
      fontWeight: 600, background: s.bg, color: s.color,
      letterSpacing: '0.04em',
    }}>{s.label}</span>
  );
};

/* ── Welcome Banner ── */
const WelcomeBanner = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        borderRadius: '18px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(20,20,42,0.95) 0%, rgba(40,20,70,0.9) 50%, rgba(20,20,42,0.95) 100%)',
        border: '1px solid rgba(212,175,55,0.2)',
        boxShadow: '0 4px 32px rgba(212,175,55,0.08)',
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Glowing orbs */}
      <div style={{ position: 'absolute', top: '-40px', right: '10%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(212,175,55,0.06)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '-30px', left: '20%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(124,58,237,0.08)', filter: 'blur(35px)' }} />

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.4rem',
            background: 'linear-gradient(90deg, #d4af37, #f0c040, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Welcome back, Admin! 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Zorvex Institute — Control Panel
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.05em' }}>{timeStr}</p>
          <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>{dateStr}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Dashboard ── */
const Dashboard = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, contacts: 0, gallery: 0 });
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    Promise.allSettled([getStudents(), getCourses(), getContacts(), getGallery()]).then(([s, c, co, g]) => {
      const contacts = co.value?.data?.data || [];
      const unread = contacts.filter((m) => !m.isRead).length;
      setStats({
        students: s.value?.data?.count || 0,
        courses: c.value?.data?.count || 0,
        contacts: unread,
        gallery: g.value?.data?.count || 0,
      });
      setRecentStudents(s.value?.data?.data?.slice(0, 5) || []);
    });
  }, []);

  const statCards = [
    { icon: '👨‍🎓', label: 'Total Students', value: stats.students, color: '#d4af37', glowColor: '#d4af37', subText: 'Enrolled this semester' },
    { icon: '📚', label: 'Total Courses', value: stats.courses, color: '#a855f7', glowColor: '#a855f7', subText: 'Active programmes' },
    { icon: '📩', label: 'Unread Messages', value: stats.contacts, color: '#22c55e', glowColor: '#22c55e', subText: 'Awaiting response' },
    { icon: '🖼️', label: 'Gallery Images', value: stats.gallery, color: '#6366f1', glowColor: '#6366f1', subText: 'Published items' },
  ];

  const quickLinks = [
    { icon: '📊', label: 'Analytics',     to: '/admin/analytics',    color: '#d4af37' },
    { icon: '📋', label: 'Applications',  to: '/admin/applications', color: '#22c55e' },
    { icon: '👨‍🎓', label: 'Students',     to: '/admin/students',     color: '#a855f7' },
    { icon: '📚', label: 'Courses',       to: '/admin/courses',      color: '#3b82f6' },
    { icon: '👨‍🏫', label: 'Faculty',      to: '/admin/faculty',      color: '#06b6d4' },
    { icon: '📝', label: 'Notice Board',  to: '/admin/notices',      color: '#f59e0b' },
    { icon: '📊', label: 'Results',       to: '/admin/results',      color: '#10b981' },
    { icon: '💼', label: 'Placements',    to: '/admin/placements',   color: '#f43f5e' },
    { icon: '🎓', label: 'Alumni',        to: '/admin/alumni',       color: '#8b5cf6' },
    { icon: '🖼️', label: 'Gallery',       to: '/admin/gallery',      color: '#ec4899' },
    { icon: '💬', label: 'Messages',      to: '/admin/contacts',     color: '#64748b' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', marginBottom: '1rem',
          fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{ color: '#d4af37' }}>⚡</span> Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.9rem' }}>
          {quickLinks.map((q, i) => <QuickCard key={q.to} {...q} index={i} />)}
        </div>
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          background: 'rgba(20,20,42,0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212,175,55,0.12)',
          borderRadius: '16px',
          padding: '1.75rem',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9',
            fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.06em',
          }}>📋 Recent Applications</h2>
          <Link to="/admin/applications" style={{
            color: '#d4af37', fontSize: '0.78rem', textDecoration: 'none',
            fontWeight: 600, letterSpacing: '0.04em',
            padding: '0.3rem 0.8rem', borderRadius: '8px',
            border: '1px solid rgba(212,175,55,0.25)',
            transition: 'background 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            View All →
          </Link>
        </div>

        {recentStudents.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.84rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(212,175,55,0.25)' }}>
                  {['Name', 'Email', 'Course', 'Status'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '0.6rem 1rem',
                      color: '#d4af37', fontWeight: 700,
                      fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s, i) => (
                  <TableRow key={s._id} student={s} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>No applications yet</p>
            <p style={{ color: '#334155', fontSize: '0.78rem', marginTop: '0.35rem' }}>New student applications will appear here</p>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

/* Row extracted to use hooks cleanly */
const TableRow = ({ student: s, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(212,175,55,0.06)',
        background: hovered ? 'rgba(212,175,55,0.05)' : 'transparent',
        transition: 'background 0.18s',
      }}
    >
      <td style={{ padding: '0.85rem 1rem', color: '#f1f5f9', fontWeight: 500 }}>
        {s.firstName} {s.lastName}
      </td>
      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{s.email}</td>
      <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{s.course?.title || 'N/A'}</td>
      <td style={{ padding: '0.85rem 1rem' }}>
        <StatusBadge status={s.status || 'pending'} />
      </td>
    </tr>
  );
};

export default Dashboard;
