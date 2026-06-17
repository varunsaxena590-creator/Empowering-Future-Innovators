/**
 * @file admin/AdminNotices.js
 * @description Admin CRUD for college notices.
 *
 * Features:
 *   - Table: title, category, priority badge, date, actions
 *   - Add/Edit modal: title, content, category, priority, expiry
 *   - Delete with confirmation
 *
 * Data: getNotices, createNotice, updateNotice, deleteNotice APIs
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getNotices, createNotice, updateNotice, deleteNotice } from '../utils/api';

const categories = ['General', 'Exam', 'Admission', 'Holiday', 'Event', 'Result', 'Fee'];
const catColors = { General: '#64748b', Exam: '#f59e0b', Admission: '#22c55e', Holiday: '#ec4899', Event: '#7c3aed', Result: '#3b82f6', Fee: '#d4af37' };

const emptyForm = { title: '', content: '', category: 'General', pinned: false, tags: '', expiresAt: '' };

const inp = { width: '100%', padding: '0.65rem 1rem', background: '#0a0a14', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' };

/* ── Notice Modal ─────────────────────────────────────── */
const NoticeModal = ({ notice, onClose, onSaved }) => {
  const isEdit = !!notice?._id;
  const [form, setForm] = useState(isEdit ? {
    title: notice.title,
    content: notice.content,
    category: notice.category || 'General',
    pinned: notice.pinned || false,
    tags: (notice.tags || []).join(', '),
    expiresAt: notice.expiresAt ? notice.expiresAt.slice(0, 10) : '',
  } : emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (isEdit) { await updateNotice(notice._id, payload); toast.success('Notice updated!'); }
      else { await createNotice(payload); toast.success('Notice published!'); }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '1rem' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 20 }} transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '1rem', fontWeight: 700 }}>{isEdit ? '✏️ Edit Notice' : '📋 New Notice'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Title *</label>
            <input placeholder="Notice title..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inp} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ ...inp, cursor: 'pointer', background: '#0a0a14' }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Expires On</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} style={inp} />
            </div>
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Content *</label>
            <textarea placeholder="Notice content / details..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required rows={5} style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Tags (comma separated)</label>
            <input placeholder="e.g. urgent, semester, cs-dept" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} style={inp} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1rem', background: form.pinned ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.pinned ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', transition: 'all 0.2s' }}>
            <div onClick={() => setForm({...form, pinned: !form.pinned})}
              style={{ width: 20, height: 20, borderRadius: '6px', border: `2px solid ${form.pinned ? '#d4af37' : 'rgba(212,175,55,0.3)'}`, background: form.pinned ? '#d4af37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
              {form.pinned && <span style={{ color: '#050509', fontSize: '0.75rem', fontWeight: 900 }}>✓</span>}
            </div>
            <div>
              <p style={{ color: '#f1f5f9', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>📌 Pin this notice</p>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>Pinned notices appear at the top</p>
            </div>
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.7rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.7rem 2rem', background: loading ? '#334155' : 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────── */
const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    setLoading(true);
    try { const r = await getNotices(); setNotices(r.data.data || []); }
    catch { setNotices([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchNotices(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try { await deleteNotice(id); toast.success('Notice deleted'); fetchNotices(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleTogglePin = async (notice) => {
    try {
      await updateNotice(notice._id, { ...notice, pinned: !notice.pinned });
      toast.success(notice.pinned ? 'Unpinned' : 'Pinned!');
      fetchNotices();
    } catch { toast.error('Failed'); }
  };

  const handleSaved = () => { setModal(null); fetchNotices(); };

  const filtered = notices.filter(n => {
    const matchCat = filter === 'All' || n.category === filter;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AdminLayout title="Notice Board">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ color: '#475569', fontSize: '0.85rem' }}>{notices.length} notice{notices.length !== 1 ? 's' : ''} total</p>
        <button onClick={() => setModal('create')}
          style={{ padding: '0.6rem 1.4rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
          + New Notice
        </button>
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="🔍 Search notices..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.55rem 1rem', background: '#0a0a14', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.82rem', outline: 'none', minWidth: 200 }} />
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', ...categories].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '0.3rem 0.8rem', borderRadius: '999px', border: `1px solid ${filter === cat ? (catColors[cat] || 'rgba(212,175,55,0.5)') : 'rgba(255,255,255,0.08)'}`, background: filter === cat ? `${catColors[cat] || '#d4af37'}18` : 'transparent', color: filter === cat ? (catColors[cat] || '#d4af37') : '#64748b', fontSize: '0.73rem', cursor: 'pointer', fontWeight: filter === cat ? 700 : 400, transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(212,175,55,0.3)', borderTop: '3px solid #d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map((n, i) => {
            const color = catColors[n.category] || '#64748b';
            const isExpired = n.expiresAt && new Date(n.expiresAt) < new Date();
            return (
              <motion.div key={n._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                style={{ background: '#14142a', border: `1px solid ${n.pinned ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)'}`, borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', opacity: isExpired ? 0.6 : 1, borderLeft: `4px solid ${color}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    {n.pinned && <span style={{ fontSize: '0.68rem', background: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(212,175,55,0.3)', fontWeight: 700 }}>📌 Pinned</span>}
                    <span style={{ fontSize: '0.68rem', background: `${color}18`, color: color, padding: '0.15rem 0.5rem', borderRadius: '999px', border: `1px solid ${color}33`, fontWeight: 600 }}>{n.category}</span>
                    {isExpired && <span style={{ fontSize: '0.68rem', background: 'rgba(239,68,68,0.12)', color: '#f87171', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(239,68,68,0.25)', fontWeight: 600 }}>Expired</span>}
                    {n.expiresAt && !isExpired && <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Expires {new Date(n.expiresAt).toLocaleDateString()}</span>}
                  </div>
                  <h3 style={{ color: '#f1f5f9', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.4 }}>{n.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.5rem' }}>{n.content}</p>
                  {n.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {n.tags.map(tag => <span key={tag} style={{ fontSize: '0.67rem', color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>#{tag}</span>)}
                    </div>
                  )}
                  <p style={{ color: '#334155', fontSize: '0.7rem', marginTop: '0.5rem' }}>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={() => handleTogglePin(n)} title={n.pinned ? 'Unpin' : 'Pin to top'}
                    style={{ width: 32, height: 32, background: n.pinned ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.06)', border: `1px solid ${n.pinned ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.15)'}`, borderRadius: '8px', cursor: 'pointer', color: '#d4af37', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    📌
                  </button>
                  <button onClick={() => setModal(n)} title="Edit notice"
                    style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', cursor: 'pointer', color: '#60a5fa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(n._id)} title="Delete notice"
                    style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    🗑
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#475569' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</p>
          <p>{search || filter !== 'All' ? 'No notices match your filter.' : 'No notices yet.'}</p>
          {!search && filter === 'All' && (
            <button onClick={() => setModal('create')} style={{ marginTop: '1rem', padding: '0.65rem 1.5rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Publish First Notice</button>
          )}
        </div>
      )}

      <AnimatePresence>
        {modal && <NoticeModal notice={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSaved={handleSaved} />}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminNotices;
