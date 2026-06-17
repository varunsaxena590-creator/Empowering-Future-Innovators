/**
 * @file admin/AdminCourses.js
 * @description Admin CRUD for courses/programs.
 *
 * Features:
 *   - Table: name, department, duration, fees, seats, actions
 *   - Add/Edit modal form: all course fields + image upload
 *   - Delete with confirmation
 *
 * Data: getCourses, createCourse, updateCourse, deleteCourse APIs
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../utils/api';

const empty = { title: '', description: '', duration: '', department: '', fees: '', seats: '' };

const inputStyle = { width: '100%', padding: '0.65rem 1rem', background: '#0a0a14', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };

/* ── Shared Edit/Create Modal ─────────────────────────────── */
const CourseModal = ({ course, onClose, onSaved }) => {
  const isEdit = !!course?._id;
  const [form, setForm] = useState(isEdit ? { title: course.title, description: course.description, duration: course.duration, department: course.department, fees: course.fees, seats: course.seats } : empty);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) { await updateCourse(course._id, form); toast.success('Course updated!'); }
      else { await createCourse(form); toast.success('Course created!'); }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', padding: '1rem' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 20 }} transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '18px', padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '1rem', fontWeight: 700 }}>{isEdit ? '✏️ Edit Course' : '+ New Course'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Course Title *</label>
            <input placeholder="e.g. B.Tech Computer Science" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Department *</label>
            <input placeholder="e.g. Engineering" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Duration *</label>
            <input placeholder="e.g. 4 Years" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Annual Fees (₹) *</label>
            <input type="number" placeholder="e.g. 85000" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} required style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Seats Available *</label>
            <input type="number" placeholder="e.g. 60" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} required style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Description *</label>
            <textarea placeholder="Course overview, eligibility, career paths..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.7rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.7rem 2rem', background: loading ? '#334155' : 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Main Component ────────────────────────────────────────── */
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState(null); // null | 'create' | courseObj

  const fetchCourses = () => getCourses().then((r) => setCourses(r.data.data || [])).catch(() => {});
  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try { await deleteCourse(id); toast.success('Course deleted'); fetchCourses(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleSaved = () => { setModal(null); fetchCourses(); };

  return (
    <AdminLayout title="Courses">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <p style={{ color: '#475569', fontSize: '0.85rem' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
        <button onClick={() => setModal('create')}
          style={{ padding: '0.6rem 1.4rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          + Add Course
        </button>
      </div>

      {/* Course Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
        {courses.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ padding: '0.2rem 0.65rem', background: 'rgba(212,175,55,0.1)', color: '#d4af37', fontSize: '0.7rem', borderRadius: '999px', fontWeight: 600, border: '1px solid rgba(212,175,55,0.2)' }}>{c.department}</span>
              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button onClick={() => setModal(c)} title="Edit course"
                  style={{ width: 30, height: 30, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', cursor: 'pointer', color: '#d4af37', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.22)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(c._id)} title="Delete course"
                  style={{ width: 30, height: 30, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                  🗑
                </button>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>{c.title}</h3>
            <p style={{ color: '#475569', fontSize: '0.79rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{c.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid rgba(212,175,55,0.07)', paddingTop: '0.6rem', marginTop: 'auto' }}>
              <span>⏱ {c.duration}</span>
              <span>💺 {c.seats} seats</span>
              <span style={{ color: '#d4af37', fontWeight: 700 }}>₹{Number(c.fees)?.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#475569' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</p>
          <p>No courses yet.</p>
          <button onClick={() => setModal('create')} style={{ marginTop: '1rem', padding: '0.65rem 1.5rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add First Course</button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && <CourseModal course={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSaved={handleSaved} />}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCourses;
