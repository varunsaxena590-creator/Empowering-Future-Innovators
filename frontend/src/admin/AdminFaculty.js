/**
 * @file admin/AdminFaculty.js
 * @description Admin CRUD for faculty members.
 *
 * Features:
 *   - Table: name, designation, department, experience, actions
 *   - Add/Edit modal: photo upload, bio, qualifications
 *   - Delete with confirmation
 *
 * Data: getFaculty, createFaculty, updateFaculty, deleteFaculty APIs
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '../utils/api';

const empty = { name: '', designation: '', department: '', qualification: '', experience: '', email: '', bio: '' };
const inp = { width: '100%', padding: '0.65rem 1rem', background: '#0a0a14', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' };

const FacultyModal = ({ faculty, onClose, onSaved }) => {
  const isEdit = !!faculty?._id;
  const [form, setForm] = useState(isEdit
    ? { name: faculty.name, designation: faculty.designation, department: faculty.department, qualification: faculty.qualification, experience: faculty.experience, email: faculty.email || '', bio: faculty.bio || '' }
    : empty);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);
      if (isEdit) {
        await updateFaculty(faculty._id, formData);
        toast.success('Faculty updated!');
      } else {
        await createFaculty(formData);
        toast.success('Faculty member added!');
      }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '1rem' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 20 }} transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '1rem', fontWeight: 700 }}>{isEdit ? '✏️ Edit Faculty' : '+ Add Faculty Member'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        {isEdit && faculty.image && (
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(212,175,55,0.05)', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.12)' }}>
            <img src={faculty.image} alt={faculty.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(212,175,55,0.3)' }} />
            <p style={{ color: '#64748b', fontSize: '0.78rem' }}>Current photo — upload a new one below to replace</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'e.g. Dr. Ananya Sharma', required: true, span: 2 },
            { key: 'designation', label: 'Designation', placeholder: 'e.g. Professor', required: true },
            { key: 'department', label: 'Department', placeholder: 'e.g. Computer Science', required: true },
            { key: 'qualification', label: 'Qualification', placeholder: 'e.g. Ph.D. in AI', required: true },
            { key: 'experience', label: 'Experience', placeholder: 'e.g. 12 years', required: true },
            { key: 'email', label: 'Email', placeholder: 'faculty@zorvex.edu', required: false, type: 'email', span: 2 },
          ].map(({ key, label, placeholder, required, type = 'text', span }) => (
            <div key={key} style={{ gridColumn: span === 2 ? '1 / -1' : undefined }}>
              <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>{label}{required ? ' *' : ''}</label>
              <input type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required} style={inp} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Bio (optional)</label>
            <textarea placeholder="Short bio about research, achievements..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>{isEdit ? 'Replace Photo' : 'Photo'} (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ color: '#64748b', fontSize: '0.82rem' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.7rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.7rem 2rem', background: loading ? '#334155' : 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [modal, setModal] = useState(null);

  const fetchFaculty = () => getFaculty().then((r) => setFaculty(r.data.data || [])).catch(() => {});
  useEffect(() => { fetchFaculty(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try { await deleteFaculty(id); toast.success('Deleted'); fetchFaculty(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleSaved = () => { setModal(null); fetchFaculty(); };

  return (
    <AdminLayout title="Faculty">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <p style={{ color: '#475569', fontSize: '0.85rem' }}>{faculty.length} faculty member{faculty.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setModal('create')}
          style={{ padding: '0.6rem 1.4rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
          + Add Faculty
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {faculty.map((f, i) => (
          <motion.div key={f._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.14)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 150, background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {f.image ? (
                <img src={f.image} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(124,58,237,0.2))', border: '2px solid rgba(212,175,55,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: '#d4af37', fontWeight: 700, fontFamily: 'Orbitron, sans-serif' }}>
                  {f.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '0.3rem' }}>
                <button onClick={() => setModal(f)} title="Edit"
                  style={{ width: 28, height: 28, background: 'rgba(212,175,55,0.9)', border: 'none', borderRadius: '7px', cursor: 'pointer', color: '#050509', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(f._id)} title="Delete"
                  style={{ width: 28, height: 28, background: 'rgba(239,68,68,0.9)', border: 'none', borderRadius: '7px', cursor: 'pointer', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🗑
                </button>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', marginBottom: '0.25rem', fontSize: '0.92rem', fontWeight: 700 }}>{f.name}</h3>
              <p style={{ color: '#d4af37', fontSize: '0.78rem', marginBottom: '0.55rem', fontWeight: 500 }}>{f.designation}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.55rem' }}>
                <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: '0.68rem', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.2)' }}>{f.department}</span>
                <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(212,175,55,0.08)', color: '#94a3b8', fontSize: '0.68rem', borderRadius: '999px' }}>⏱ {f.experience}</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.73rem' }}>{f.qualification}</p>
              {f.bio && <p style={{ color: '#475569', fontSize: '0.73rem', marginTop: '0.35rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{f.bio}</p>}
              {f.email && <p style={{ color: '#475569', fontSize: '0.7rem', marginTop: '0.4rem' }}>📧 {f.email}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {faculty.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#475569' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</p>
          <p>No faculty members yet.</p>
          <button onClick={() => setModal('create')} style={{ marginTop: '1rem', padding: '0.65rem 1.5rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add First Member</button>
        </div>
      )}

      <AnimatePresence>
        {modal && <FacultyModal faculty={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSaved={handleSaved} />}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminFaculty;
