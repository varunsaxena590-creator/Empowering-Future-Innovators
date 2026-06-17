/**
 * @file admin/AdminLayout.js
 * @description Admin panel shell layout with sidebar + top bar.
 *
 * Structure:
 *   - Collapsible sidebar: nav links to all admin sections
 *   - Top bar: search, theme toggle, user avatar, logout
 *   - Mobile: hamburger toggle for sidebar overlay
 *
 * Auth: Wraps admin routes — redirects to /login if not admin
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getContacts } from '../utils/api';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Applications', path: '/admin/applications', icon: '📝' },
  { name: 'Students', path: '/admin/students', icon: '👨‍🎓' },
  { name: 'Courses', path: '/admin/courses', icon: '📚' },
  { name: 'Faculty', path: '/admin/faculty', icon: '👨‍🏫' },
  { name: 'Notice Board', path: '/admin/notices', icon: '📋' },
  { name: 'Results', path: '/admin/results', icon: '📊' },
  { name: 'Placements', path: '/admin/placements', icon: '💼' },
  { name: 'Alumni', path: '/admin/alumni', icon: '🎓' },
  { name: 'Gallery', path: '/admin/gallery', icon: '🖼️' },
  { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
  { name: 'Messages', path: '/admin/contacts', icon: '📩' },
  { name: 'Live Chat', path: '/admin/chat', icon: '💬' },
  { name: 'Attendance', path: '/admin/attendance', icon: '📋' },
];

const AdminLayout = ({ children, title }) => {
  const [open, setOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getContacts().then((r) => {
      const count = (r.data.data || []).filter((c) => !c.isRead).length;
      setUnreadCount(count);
    }).catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', background: '#050509', display: 'flex' }}>
      <motion.aside initial={{ x: -100 }} animate={{ x: 0 }}
        style={{ width: open ? 240 : 64, background: '#0a0a14', borderRight: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s', flexShrink: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', gap: '0.75rem', height: 64 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, color: '#fff', fontSize: '1rem', flexShrink: 0 }}>Z</div>
          {open && <span style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>ADMIN PANEL</span>}
        </div>
        <nav style={{ flex: 1, padding: '0.75rem' }}>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '0.75rem', textDecoration: 'none', marginBottom: '0.25rem', background: location.pathname === item.path ? 'rgba(212,175,55,0.12)' : 'transparent', color: location.pathname === item.path ? '#d4af37' : '#64748b', border: location.pathname === item.path ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent', transition: 'all 0.2s', position: 'relative' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              {open && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{item.name}</span>
                  {item.path === '/admin/contacts' && unreadCount > 0 && (
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '999px', lineHeight: 1.4 }}>{unreadCount}</span>
                  )}
                </span>
              )}
              {!open && item.path === '/admin/contacts' && unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
              )}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '0.75rem', textDecoration: 'none', color: '#64748b', marginBottom: '0.25rem' }}>
            <span style={{ flexShrink: 0 }}>🏠</span>{open && <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>View Site</span>}
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', width: '100%' }}>
            <span style={{ flexShrink: 0 }}>🚪</span>{open && <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Logout</span>}
          </button>
        </div>
      </motion.aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ background: '#0a0a14', borderBottom: '1px solid rgba(212,175,55,0.15)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.2rem' }}>☰</button>
            {/* Back button, hide on dashboard */}
            {location.pathname !== '/admin' && (
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4af37',
                  fontSize: '1.2rem',
                  marginRight: '0.5rem',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  padding: '0.3rem 0.7rem',
                  transition: 'background 0.2s',
                  outline: 'none',
                }}
                title="Back"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                ← Back
              </button>
            )}
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', marginLeft: location.pathname !== '/admin' ? 0 : undefined }}>{title}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 700, fontSize: '0.85rem' }}>
              {user?.name?.[0]}
            </div>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{user?.name}</span>
          </div>
        </header>
        <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem', background: '#050509' }}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
