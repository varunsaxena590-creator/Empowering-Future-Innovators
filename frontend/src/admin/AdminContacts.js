/**
 * @file admin/AdminContacts.js
 * @description Admin contact message management.
 *
 * Features:
 *   - Table: sender name, email, subject, date, read/unread status
 *   - Message detail view (expand/modal)
 *   - Mark as read, delete message
 *
 * Data: getContacts, markContactRead, deleteContact APIs
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getContacts, markContactRead, deleteContact } from '../utils/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const fetchContacts = () => {
    getContacts()
      .then((r) => setContacts(r.data.data || []))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleMarkRead = async (id) => {
    try { await markContactRead(id); fetchContacts(); if (selected?._id === id) setSelected((p) => ({ ...p, isRead: true })); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await deleteContact(id); toast.success('Deleted'); if (selected?._id === id) setSelected(null); fetchContacts(); }
    catch { toast.error('Failed'); }
  };

  const filtered = filter === 'all' ? contacts : filter === 'unread' ? contacts.filter((c) => !c.isRead) : contacts.filter((c) => c.isRead);
  const unreadCount = contacts.filter((c) => !c.isRead).length;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <AdminLayout title="Messages">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'unread', 'read'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.85rem', textTransform: 'capitalize', cursor: 'pointer', border: 'none', background: filter === f ? 'linear-gradient(135deg, #d4af37, #f0c040)' : '#14142a', color: filter === f ? '#050509' : '#9ca3af', fontWeight: filter === f ? 700 : 400 }}>
            {f}{f === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.85rem' }}>{filtered.length} messages</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '1rem', overflow: 'hidden' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>Loading...</p>
          ) : filtered.length > 0 ? (
            filtered.map((c) => (
              <div key={c._id} onClick={() => { setSelected(c); if (!c.isRead) handleMarkRead(c._id); }}
                style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(212,175,55,0.08)', cursor: 'pointer', background: selected?._id === c._id ? 'rgba(212,175,55,0.08)' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', transition: 'background 0.2s' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    {!c.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d4af37', flexShrink: 0, display: 'inline-block' }} />}
                    <span style={{ color: c.isRead ? '#9ca3af' : '#fff', fontWeight: c.isRead ? 400 : 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</p>
                  <p style={{ color: '#4b5563', fontSize: '0.75rem', marginTop: '0.2rem' }}>{formatDate(c.createdAt)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', fontSize: '0.85rem', flexShrink: 0 }}>🗑</button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</p>
              <p>No messages found.</p>
            </div>
          )}
        </motion.div>

        {/* Detail pane */}
        {selected && (
          <motion.div key={selected._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#fff', fontSize: '1.1rem' }}>{selected.subject}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', minWidth: 60 }}>From:</span>
                <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{selected.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', minWidth: 60 }}>Email:</span>
                <a href={`mailto:${selected.email}`} style={{ color: '#d4af37', fontSize: '0.85rem', textDecoration: 'none' }}>{selected.email}</a>
              </div>
              {selected.phone && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem', minWidth: 60 }}>Phone:</span>
                  <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>{selected.phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', minWidth: 60 }}>Date:</span>
                <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{formatDate(selected.createdAt)}</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: '1rem' }}>
              <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                style={{ flex: 1, padding: '0.6rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.85rem', textAlign: 'center' }}>
                Reply via Email
              </a>
              <button onClick={() => handleDelete(selected._id)}
                style={{ padding: '0.6rem 1rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
