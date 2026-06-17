/**
 * @file admin/Students.js
 * @description Admin student management panel.
 *
 * Features:
 *   - Table: name, roll, department, year, status, actions
 *   - Search + filter by department/status
 *   - Update status (active/inactive), delete student
 *
 * Data: getStudents, updateStudentStatus, deleteStudent APIs
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getStudents, updateStudentStatus, deleteStudent } from '../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchStudents = () => {
    getStudents().then((res) => setStudents(res.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleStatus = async (id, status) => {
    try { await updateStudentStatus(id, status); toast.success(`Status: ${status}`); fetchStudents(); }
    catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await deleteStudent(id); toast.success('Deleted'); fetchStudents(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'all' ? students : students.filter((s) => s.status === filter);

  return (
    <AdminLayout title="Students">
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.45rem 1.1rem', borderRadius: '999px', fontSize: '0.82rem', textTransform: 'capitalize', cursor: 'pointer', border: filter === f ? 'none' : '1px solid rgba(212,175,55,0.25)', background: filter === f ? 'linear-gradient(135deg, #d4af37, #f0c040)' : 'transparent', color: filter === f ? '#050509' : '#64748b', fontWeight: filter === f ? 700 : 400 }}>
            {f}
          </button>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? <p style={{ textAlign: 'center', color: '#475569', padding: '3rem' }}>Loading...</p> : filtered.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#0a0a14' }}>
                <tr style={{ color: '#64748b' }}>
                  {['Name', 'Email', 'Phone', 'Course', 'Score', 'Status', 'Actions'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id} style={{ borderTop: '1px solid rgba(212,175,55,0.07)', color: '#94a3b8' }}>
                    <td style={{ padding: '0.75rem 1rem', color: '#f1f5f9' }}>{s.firstName} {s.lastName}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.phone}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.course?.title || 'N/A'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.percentage}%</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', background: s.status === 'approved' ? 'rgba(34,197,94,0.15)' : s.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(212,175,55,0.15)', color: s.status === 'approved' ? '#4ade80' : s.status === 'rejected' ? '#f87171' : '#d4af37' }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {s.status !== 'approved' && <button onClick={() => handleStatus(s._id, 'approved')} style={{ padding: '0.25rem 0.6rem', background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem' }}>✓</button>}
                        {s.status !== 'rejected' && <button onClick={() => handleStatus(s._id, 'rejected')} style={{ padding: '0.25rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem' }}>✗</button>}
                        <button onClick={() => handleDelete(s._id)} style={{ padding: '0.25rem 0.6rem', background: 'rgba(100,116,139,0.15)', color: '#64748b', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p style={{ textAlign: 'center', color: '#475569', padding: '3rem' }}>No students found.</p>}
      </motion.div>
    </AdminLayout>
  );
};

export default Students;
