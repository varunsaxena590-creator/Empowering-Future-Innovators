/**
 * @file admin/AdminGallery.js
 * @description Admin CRUD for gallery images.
 *
 * Features:
 *   - Image grid with category badges
 *   - Upload modal: image file, title, category selector
 *   - Edit caption/category, delete with confirmation
 *
 * Data: getGallery, uploadGalleryImage, updateGalleryImage, deleteGalleryImage APIs
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getGallery, uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from '../utils/api';

const categories = ['campus', 'events', 'sports', 'academics', 'other'];
const inputStyle = { padding: '0.65rem 1rem', background: '#0a0a14', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' };

/* ── Edit Modal ─────────────────────────────────────────── */
const EditModal = ({ image, onClose, onSaved }) => {
  const [title, setTitle] = useState(image.title || '');
  const [category, setCategory] = useState(image.category || 'other');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateGalleryImage(image._id, { title, category });
      toast.success('Image updated!');
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '1rem' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 20 }} transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '18px', padding: '2rem', width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 700 }}>✏️ Edit Image</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
        {/* Preview */}
        <img src={image.imageUrl} alt={image.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid rgba(212,175,55,0.12)' }} />
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image title" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, width: '100%', cursor: 'pointer', background: '#0a0a14', boxSizing: 'border-box' }}>
              {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '0.65rem 1.75rem', background: loading ? '#334155' : 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────── */
const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [uploading, setUploading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchImages = () => getGallery().then((r) => setImages(r.data.data || [])).catch(() => {});
  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title || 'Gallery Image');
      formData.append('category', category);
      await uploadGalleryImage(formData);
      toast.success('Image uploaded!');
      setFile(null);
      setTitle('');
      fetchImages();
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try { await deleteGalleryImage(id); toast.success('Deleted'); fetchImages(); }
    catch { toast.error('Failed'); }
  };

  const handleSaved = () => { setEditTarget(null); fetchImages(); };

  const filtered = filter === 'all' ? images : images.filter((img) => img.category === filter);

  return (
    <AdminLayout title="Gallery">
      {/* Upload form */}
      <motion.form onSubmit={handleUpload} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
        <div>
          <label style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image title" style={{ ...inputStyle, minWidth: 180 }} />
        </div>
        <div>
          <label style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', background: '#0a0a14' }}>
            {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Image File *</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ color: '#64748b', fontSize: '0.85rem' }} />
        </div>
        <button type="submit" disabled={uploading} style={{ padding: '0.65rem 1.5rem', background: uploading ? '#334155' : 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
          {uploading ? 'Uploading...' : '↑ Upload'}
        </button>
      </motion.form>

      {/* Filter bar */}
      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['all', ...categories].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', border: `1px solid ${filter === cat ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.15)'}`, background: filter === cat ? 'rgba(212,175,55,0.12)' : 'transparent', color: filter === cat ? '#d4af37' : '#64748b', fontSize: '0.75rem', cursor: 'pointer', fontWeight: filter === cat ? 700 : 400, transition: 'all 0.2s' }}>
              {cat === 'all' ? `All (${images.length})` : `${cat.charAt(0).toUpperCase() + cat.slice(1)} (${images.filter(img => img.category === cat).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        {filtered.map((img, i) => (
          <motion.div key={img._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.1)' }}
            onMouseEnter={(e) => e.currentTarget.querySelector('.gallery-overlay').style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.querySelector('.gallery-overlay').style.opacity = '0'}>
            <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,9,0.82)', opacity: 0, transition: 'opacity 0.28s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}>
              <p style={{ color: '#f1f5f9', fontSize: '0.73rem', textAlign: 'center', fontWeight: 600, lineHeight: 1.4 }}>{img.title}</p>
              <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(212,175,55,0.2)', color: '#d4af37', fontSize: '0.68rem', borderRadius: '999px', border: '1px solid rgba(212,175,55,0.25)' }}>{img.category}</span>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                <button onClick={() => setEditTarget(img)}
                  style={{ padding: '0.3rem 0.65rem', background: 'rgba(212,175,55,0.85)', color: '#050509', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(img._id)}
                  style={{ padding: '0.3rem 0.65rem', background: 'rgba(239,68,68,0.85)', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#475569' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</p>
          <p>No images uploaded yet.</p>
        </div>
      )}

      <AnimatePresence>
        {editTarget && <EditModal image={editTarget} onClose={() => setEditTarget(null)} onSaved={handleSaved} />}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminGallery;
