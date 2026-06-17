/**
 * @file components/Navbar.js
 * @description Main navigation bar component (fixed top).
 *
 * Features:
 *   - Desktop nav: 8 main links + Student dropdown (7 links)
 *   - Mobile hamburger menu with animated open/close
 *   - SearchBar (Ctrl+K), Language toggle (EN/हिं), Theme toggle (☀️/🌙)
 *   - User state: Sign In / Profile pill + Admin link + Logout
 *   - Scroll effect: backdrop blur + border on scroll > 60px
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getColors } from '../utils/theme';
import SearchBar from './SearchBar';

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Events', path: '/events' },
  { name: 'Blog', path: '/blog' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const studentLinks = [
  { name: 'Notice Board', path: '/notices', icon: '📋' },
  { name: 'Result / Marksheet', path: '/result', icon: '📊' },
  { name: 'Timetable', path: '/timetable', icon: '🗓️' },
  { name: 'Fee Payment', path: '/fees', icon: '💳' },
  { name: 'Placements', path: '/placements', icon: '🏢' },
  { name: 'Alumni Network', path: '/alumni', icon: '🎓' },
  { name: 'FAQ', path: '/faq', icon: '❓' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const c = getColors(isDark);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? c.navBg : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        borderBottom: scrolled ? `1px solid ${isDark ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.08)'}` : 'none',
        boxShadow: scrolled ? (isDark ? '0 4px 32px rgba(0,0,0,0.35)' : '0 1px 8px rgba(0,0,0,0.06)') : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 1.5rem', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.7rem', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '0.95rem', letterSpacing: '-0.5px', fontFamily: 'Orbitron, sans-serif', boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}>
            Z
          </div>
          <div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: c.text, letterSpacing: '0.06em', display: 'block', lineHeight: 1.1 }}>ZORVEX</span>
            <span style={{ fontSize: '0.55rem', color: 'rgba(212,175,55,0.65)', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif', display: 'block' }}>Institute</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ gap: '0.15rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}
                className={active ? 'nav-link-active' : ''}
                style={{
                  padding: '0.42rem 0.8rem', borderRadius: '8px', textDecoration: 'none',
                  fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.02em',
                  color: active ? '#d4af37' : c.textMuted,
                  background: active ? 'rgba(212,175,55,0.08)' : 'transparent',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = c.text; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = c.textMuted; e.currentTarget.style.background = 'transparent'; } }}>
                {link.name}
              </Link>
            );
          })}

          {/* Student Resources Dropdown */}
          <div className="nav-dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ padding: '0.42rem 0.8rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, color: dropdownOpen ? '#d4af37' : c.textMuted, background: dropdownOpen ? 'rgba(212,175,55,0.08)' : 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'Sora, sans-serif' }}
              onMouseEnter={(e) => { if (!dropdownOpen) { e.currentTarget.style.color = c.text; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; } }}
              onMouseLeave={(e) => { if (!dropdownOpen) { e.currentTarget.style.color = c.textMuted; e.currentTarget.style.background = 'transparent'; } }}>
              Student ▾
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div className="nav-dropdown-menu"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}>
                  {studentLinks.map((sl) => (
                    <Link key={sl.path} to={sl.path}>
                      <span style={{ width: 24, height: 24, background: 'rgba(212,175,55,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>{sl.icon}</span>
                      {sl.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="nav-desktop" style={{ gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
          <SearchBar />
          {/* Language Toggle */}
          <button onClick={toggleLang} title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.16)', borderRadius: '8px', padding: '0.32rem 0.6rem', cursor: 'pointer', color: '#d4af37', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', transition: 'all 0.2s', fontFamily: 'Sora, sans-serif' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.14)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.06)'}>
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>
          {/* Theme Toggle */}
          <button onClick={toggleTheme}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.14)', borderRadius: '8px', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" style={{ fontSize: '0.78rem', color: '#d4af37', textDecoration: 'none', fontWeight: 600, padding: '0.32rem 0.7rem', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', background: 'rgba(212,175,55,0.06)' }}>
                  ⚡ Admin
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.7rem 0.25rem 0.35rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.14)', borderRadius: '20px' }}>
                <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#fff', fontFamily: 'Orbitron, sans-serif' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <Link to="/portal" style={{ fontSize: '0.78rem', color: c.text, fontWeight: 500, textDecoration: 'none', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </Link>
              </div>
              <button onClick={handleLogout}
                style={{ padding: '0.32rem 0.9rem', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                style={{ fontSize: '0.8rem', color: c.textMuted, textDecoration: 'none', fontWeight: 500, padding: '0.38rem 0.85rem', borderRadius: '8px', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = c.text; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = c.textMuted; e.currentTarget.style.background = 'transparent'; }}>
                Sign In
              </Link>
              <Link to="/admission" className="btn-gold"
                style={{ padding: '0.45rem 1.1rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.03em', boxShadow: '0 4px 14px rgba(212,175,55,0.25)' }}>
                Apply Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: '0.4rem', borderRadius: '8px' }}>
          {[0, 1, 2].map((i) => (
            <motion.span key={i}
              animate={menuOpen ? (i === 1 ? { opacity: 0, scaleX: 0 } : i === 0 ? { rotate: 45, y: 7 } : { rotate: -45, y: -7 }) : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'block', width: i === 1 ? 16 : 22, height: 2, background: 'linear-gradient(to right, #d4af37, #f0c040)', borderRadius: 2, transformOrigin: 'center' }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ background: isDark ? 'rgba(5,5,9,0.97)' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${isDark ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.08)'}`, padding: '1rem 1.5rem 1.5rem', overflow: 'hidden' }}>
            {/* Main links */}
            <div style={{ marginBottom: '0.5rem' }}>
              {links.map((link) => (
                <Link key={link.path} to={link.path}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0', color: location.pathname === link.path ? '#d4af37' : c.textMuted, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, borderBottom: `1px solid ${isDark ? 'rgba(212,175,55,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  {link.name}
                  {location.pathname === link.path && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4af37' }} />}
                </Link>
              ))}
            </div>
            {/* Student links */}
            <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Student Resources</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                {studentLinks.map((sl) => (
                  <Link key={sl.path} to={sl.path} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.6rem', color: c.textMuted, textDecoration: 'none', fontSize: '0.78rem', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                    <span>{sl.icon}</span> {sl.name}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={toggleTheme} style={{ padding: '0.55rem 1rem', border: '1px solid rgba(212,175,55,0.25)', background: 'transparent', color: '#d4af37', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>
                {theme === 'dark' ? '🌙 Light' : '☀️ Dark'}
              </button>
              <button onClick={toggleLang} style={{ padding: '0.55rem 1rem', border: '1px solid rgba(212,175,55,0.18)', background: 'transparent', color: '#d4af37', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>
                {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
              </button>
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" style={{ padding: '0.55rem 1rem', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>⚡ Admin</Link>}
                  <button onClick={handleLogout} style={{ padding: '0.55rem 1rem', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ padding: '0.55rem 1rem', border: '1px solid rgba(212,175,55,0.25)', color: '#94a3b8', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem' }}>Sign In</Link>
                  <Link to="/admission" style={{ padding: '0.55rem 1.2rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem' }}>Apply Now</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
