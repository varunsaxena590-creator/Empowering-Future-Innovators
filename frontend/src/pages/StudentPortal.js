/**
 * @file pages/StudentPortal.js
 * @description Authenticated student dashboard.
 *
 * Features:
 *   - Welcome header with user name
 *   - Quick links: Results, Timetable, Fee Payment, Notices
 *   - Profile info, recent notices, attendance summary
 *
 * Auth: Protected — requires logged-in user (useAuth context)
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getMyApplications } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const statusColor = { pending: '#f59e0b', approved: '#22c55e', rejected: '#ef4444' };
const statusBg = { pending: 'rgba(245,158,11,0.1)', approved: 'rgba(34,197,94,0.1)', rejected: 'rgba(239,68,68,0.1)' };

const StudentPortal = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { isDark } = useTheme();
  const c = getColors(isDark);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    let active = true;
    if (user) {
      getMyApplications()
        .then((res) => {
          if (active) setApplications(res.data.data || []);
        })
        .catch(() => { if (active) setApplications([]); })
        .finally(() => { if (active) setFetching(false); });
    }
    return () => { active = false; };
  }, [user]);

  if (loading || !user) return null;

  const statusSummary = { pending: 0, approved: 0, rejected: 0 };
  applications.forEach((a) => { if (statusSummary[a.status] !== undefined) statusSummary[a.status]++; });

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1.2rem' }}>
                {user.name?.[0] || 'S'}
              </div>
              <div>
                <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', color: c.text, fontWeight: 700 }}>
                  Welcome, {user.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: c.textDim, fontSize: '0.85rem', marginTop: '0.2rem' }}>{user.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { label: 'Total Applications', value: applications.length, icon: '📋', color: '#d4af37' },
              { label: 'Approved', value: statusSummary.approved, icon: '✅', color: '#22c55e' },
              { label: 'Pending Review', value: statusSummary.pending, icon: '⏳', color: '#f59e0b' },
              { label: 'Rejected', value: statusSummary.rejected, icon: '❌', color: '#ef4444' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{s.icon}</p>
                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.6rem', color: s.color, fontWeight: 700 }}>{s.value}</p>
                <p style={{ color: c.textDim, fontSize: '0.72rem', marginTop: '0.2rem' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { icon: '📝', label: 'Apply to Program', to: '/admission', color: '#d4af37' },
              { icon: '📊', label: 'My Results', to: '/result', color: '#3b82f6' },
              { icon: '🗓️', label: 'Timetable', to: '/timetable', color: '#22c55e' },
              { icon: '💳', label: 'Fee Payment', to: '/fees', color: '#8b5cf6' },
              { icon: '📋', label: 'Notice Board', to: '/notices', color: '#f59e0b' },
              { icon: '📚', label: 'Courses', to: '/courses', color: '#ec4899' },
              { icon: '📅', label: 'Events', to: '/events', color: '#06b6d4' },
              { icon: '❓', label: 'FAQ', to: '/faq', color: '#64748b' },
            ].map((item) => (
              <Link key={item.to} to={item.to}
                style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', padding: '1.25rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'border-color 0.2s', textAlign: 'center' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = `${item.color}55`}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = c.borderGold}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <span style={{ color: item.color, fontSize: '0.75rem', fontWeight: 600 }}>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Applications Table */}
          <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${c.borderGold}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: c.text, fontSize: '1rem', fontWeight: 600 }}>📋 My Applications</h2>
              <Link to="/admission" style={{ fontSize: '0.8rem', color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>+ New Application</Link>
            </div>

            {fetching ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  style={{ width: 32, height: 32, border: '2px solid rgba(212,175,55,0.1)', borderTop: '2px solid #d4af37', borderRadius: '50%', margin: '0 auto 1rem' }} />
                <p style={{ color: c.textDim, fontSize: '0.85rem' }}>Loading your applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
                <p style={{ color: c.textDim, fontSize: '0.9rem', marginBottom: '1.5rem' }}>No applications yet.</p>
                <Link to="/admission" style={{ padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem' }}>
                  Apply Now →
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                      {['Program', 'Applied On', 'Status', 'Action'].map((h) => (
                        <th key={h} style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: c.textDim, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, i) => (
                      <tr key={app._id || i} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
                        <td style={{ padding: '1rem 1.5rem', color: c.text, fontSize: '0.88rem' }}>
                          {app.course?.title || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: c.textMuted, fontSize: '0.82rem' }}>
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '20px', background: statusBg[app.status] || 'rgba(212,175,55,0.1)', color: statusColor[app.status] || '#d4af37', textTransform: 'capitalize', border: `1px solid ${statusColor[app.status] || '#d4af37'}44` }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <button style={{ fontSize: '0.78rem', color: '#d4af37', background: 'none', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '7px', padding: '0.3rem 0.75rem', cursor: 'pointer' }}
                            onClick={() => alert(`Application details for ${app.course?.title || 'program'} — Status: ${app.status}`)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Profile info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ marginTop: '1.5rem', background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ color: '#d4af37', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Account Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[['Name', user.name], ['Email', user.email], ['Role', user.role || 'Student'], ['Member Since', new Date().getFullYear()]].map(([label, val]) => (
                <div key={label}>
                  <p style={{ color: c.textDim, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{label}</p>
                  <p style={{ color: c.text, fontSize: '0.88rem', fontWeight: 500 }}>{val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default StudentPortal;
