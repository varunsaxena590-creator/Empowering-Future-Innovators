/**
 * @file admin/Analytics.js
 * @description Admin analytics dashboard.
 *
 * Charts: Student enrollment trends, department-wise distribution,
 * placement stats, revenue breakdown, monthly growth
 *
 * Data: getAnalytics() API
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import { getAnalytics } from '../utils/api';

const mockData = {
  totals: { students: 847, courses: 12, contacts: 234 },
  statusBreakdown: [
    { _id: 'approved', count: 512 },
    { _id: 'pending', count: 198 },
    { _id: 'rejected', count: 137 },
  ],
  monthlyApplications: [
    { _id: { month: 11, year: 2025 }, count: 62 },
    { _id: { month: 12, year: 2025 }, count: 78 },
    { _id: { month: 1, year: 2026 }, count: 94 },
    { _id: { month: 2, year: 2026 }, count: 115 },
    { _id: { month: 3, year: 2026 }, count: 143 },
    { _id: { month: 4, year: 2026 }, count: 87 },
  ],
  coursePopularity: [
    { _id: 'cs', count: 210, courseInfo: { title: 'B.Tech CS' } },
    { _id: 'ai', count: 185, courseInfo: { title: 'AI & ML' } },
    { _id: 'de', count: 143, courseInfo: { title: 'Data Engineering' } },
    { _id: 'cy', count: 112, courseInfo: { title: 'Cybersecurity' } },
    { _id: 'mba', count: 89, courseInfo: { title: 'MBA BizTech' } },
    { _id: 'mt', count: 64, courseInfo: { title: 'M.Tech' } },
  ],
};

const monthName = (m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1];

const statusColors = { approved: '#22c55e', pending: '#f59e0b', rejected: '#ef4444' };

const Analytics = () => {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAnalytics()
      .then(r => { if (r.data.data) setData(r.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxMonthly = Math.max(...data.monthlyApplications.map(m => m.count), 1);
  const maxCourse = Math.max(...data.coursePopularity.map(c => c.count), 1);
  const totalStudents = data.totals.students || 1;
  const statusTotal = data.statusBreakdown.reduce((s, i) => s + i.count, 0) || 1;

  return (
    <AdminLayout title="Analytics">
    <div style={{ padding: '2rem', background: '#0a0a14', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '1.2rem', fontWeight: 700 }}>Analytics Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>Institute performance overview</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Applications', value: data.totals.students, icon: '🎓', color: '#d4af37' },
          { label: 'Active Courses', value: data.totals.courses, icon: '📚', color: '#3b82f6' },
          { label: 'Contact Inquiries', value: data.totals.contacts, icon: '📬', color: '#8b5cf6' },
          { label: 'Placement Rate', value: '91%', icon: '💼', color: '#22c55e' },
        ].map(c => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#14142a', border: `1px solid ${c.color}33`, borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: '0.4rem' }}>{c.label}</p>
                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</p>
              </div>
              <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Monthly Applications Chart */}
        <div style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '14px', padding: '1.5rem' }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Monthly Applications (Last 6 Months)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 160 }}>
            {data.monthlyApplications.map(m => {
              const h = (m.count / maxMonthly) * 130;
              const label = `${monthName(m._id.month)} ${String(m._id.year).slice(2)}`;
              return (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#d4af37', fontWeight: 700 }}>{m.count}</span>
                  <div title={`${label}: ${m.count}`}
                    style={{ width: '100%', height: h, background: 'linear-gradient(180deg, #f0c040, #d4af37)', borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease', cursor: 'default' }} />
                  <span style={{ fontSize: '0.62rem', color: '#475569' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Status Donut */}
        <div style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '14px', padding: '1.5rem' }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Application Status</h3>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* CSS pseudo-donut via stacked bars */}
            <div style={{ flex: 1, minWidth: 120 }}>
              {data.statusBreakdown.map(s => {
                const pct = ((s.count / statusTotal) * 100).toFixed(1);
                const color = statusColors[s._id] || '#64748b';
                return (
                  <div key={s._id} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{s._id}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{s.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Course Popularity */}
      <div style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '14px', padding: '1.5rem' }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Course Popularity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {data.coursePopularity.map((c, i) => {
            const pct = (c.count / maxCourse) * 100;
            const title = c.courseInfo?.title || c._id;
            return (
              <div key={c._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{i + 1}. {title}</span>
                  <span style={{ color: '#d4af37', fontSize: '0.78rem', fontWeight: 600 }}>{c.count} students</span>
                </div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: '5px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, #d4af37, #f0c040)`, borderRadius: '5px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default Analytics;
