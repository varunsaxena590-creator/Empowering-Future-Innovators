/**
 * @file admin/Applications.js
 * @description Admin admission applications management.
 *
 * Features:
 *   - Table: applicant name, course, date, status (pending/approved/rejected)
 *   - Filter by status, search by name
 *   - Approve/Reject actions + view full application details
 *
 * Data: getStudents (filtered by status) API
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getStudents, updateStudentStatus, deleteStudent } from '../utils/api';

const statusColor = { pending: '#f59e0b', approved: '#22c55e', rejected: '#ef4444' };
const statusBg = { pending: 'rgba(245,158,11,0.1)', approved: 'rgba(34,197,94,0.1)', rejected: 'rgba(239,68,68,0.1)' };

const Applications = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    getStudents()
      .then(r => setStudents(r.data.data || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateStudentStatus(id, status);
      toast.success(`Application ${status}`);
      setStudents(prev => prev.map(s => s._id === id ? { ...s, status } : s));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteStudent(id);
      toast.success('Application deleted');
      setStudents(prev => prev.filter(s => s._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = students.filter(s =>
    (filter === 'all' || s.status === filter) &&
    (!search || `${s.name || `${s.firstName || ''} ${s.lastName || ''}`} ${s.email}`.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = {
    all: students.length,
    pending: students.filter(s => s.status === 'pending').length,
    approved: students.filter(s => s.status === 'approved').length,
    rejected: students.filter(s => s.status === 'rejected').length,
  };

  return (
    <AdminLayout title="Admission Applications">
    <div style={{ padding: '2rem', background: '#0a0a14', minHeight: '100vh' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '1.2rem', fontWeight: 700 }}>Admission Applications</h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>Review and manage student applications</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.entries(counts).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)}
              style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: `1px solid ${filter === k ? (statusColor[k] || '#d4af37') : 'rgba(255,255,255,0.08)'}`, background: filter === k ? `${(statusColor[k] || '#d4af37')}22` : 'transparent', color: filter === k ? (statusColor[k] || '#d4af37') : '#64748b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500 }}>
              {k.charAt(0).toUpperCase() + k.slice(1)} ({v})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: '#14142a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.875rem', boxSizing: 'border-box' }} />
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#475569', padding: '3rem' }}>Loading applications...</div>}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.25rem' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                <p>No applications found.</p>
              </div>
            )}
            {filtered.map(s => (
              <motion.div key={s._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setSelected(s._id === selected?._id ? null : s)}
                style={{ background: selected?._id === s._id ? 'rgba(212,175,55,0.05)' : '#14142a', border: `1px solid ${selected?._id === s._id ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>
                    {(s.firstName || s.name || '?')[0]}
                  </div>
                  <div>
                    <p style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>{s.firstName || ''} {s.lastName || s.name || ''}</p>
                    <p style={{ color: '#475569', fontSize: '0.75rem' }}>{s.email} • Applied {new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor[s.status] || '#64748b', background: statusBg[s.status] || 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '20px' }}>
                    {(s.status || 'pending').toUpperCase()}
                  </span>
                  {s.status !== 'approved' && (
                    <button onClick={e => { e.stopPropagation(); handleStatus(s._id, 'approved'); }}
                      style={{ padding: '4px 10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>
                      ✓ Approve
                    </button>
                  )}
                  {s.status !== 'rejected' && (
                    <button onClick={e => { e.stopPropagation(); handleStatus(s._id, 'rejected'); }}
                      style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>
                      ✗ Reject
                    </button>
                  )}
                  <button onClick={e => { e.stopPropagation(); handleDelete(s._id); }}
                    style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}>
                    🗑
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail Panel */}
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '1.5rem', position: 'sticky', top: 80, alignSelf: 'start', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '0.85rem' }}>APPLICATION DETAILS</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  ['Application ID', selected.applicationId],
                  ['Name', `${selected.firstName || ''} ${selected.lastName || selected.name || ''}`],
                  ['Email', selected.email],
                  ['Phone', selected.phone],
                  ['Gender', selected.gender],
                  ['Category', selected.category],
                  ['Parent Phone', selected.parentPhone],
                  ['Date of Birth', selected.dateOfBirth],
                  ['Previous School', selected.previousSchool],
                  ['Grade %', selected.percentage],
                  ['Applied On', new Date(selected.createdAt).toLocaleDateString()],
                  ['Status', selected.status],
                ].map(([label, val]) => val ? (
                  <div key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.6rem' }}>
                    <p style={{ color: '#475569', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{label}</p>
                    <p style={{ color: label === 'Status' ? (statusColor[val] || '#94a3b8') : '#f1f5f9', fontSize: '0.85rem', fontWeight: label === 'Status' ? 700 : 400 }}>{String(val)}</p>
                  </div>
                ) : null)}
              </div>
              {(selected.currentAddress || selected.address) && (
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ color: '#475569', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Address</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6 }}>{selected.currentAddress || selected.address}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
                <button onClick={() => handleStatus(selected._id, 'approved')} disabled={selected.status === 'approved'}
                  style={{ flex: 1, padding: '0.65rem', background: selected.status === 'approved' ? 'rgba(34,197,94,0.1)' : 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: '8px', color: selected.status === 'approved' ? '#22c55e' : '#fff', cursor: selected.status === 'approved' ? 'default' : 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                  {selected.status === 'approved' ? '✓ Approved' : 'Approve'}
                </button>
                <button onClick={() => handleStatus(selected._id, 'rejected')} disabled={selected.status === 'rejected'}
                  style={{ flex: 1, padding: '0.65rem', background: selected.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.15)', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '8px', color: '#ef4444', cursor: selected.status === 'rejected' ? 'default' : 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                  {selected.status === 'rejected' ? '✗ Rejected' : 'Reject'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default Applications;
