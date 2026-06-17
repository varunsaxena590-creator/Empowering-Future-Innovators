/**
 * @file components/SearchBar.js
 * @description Global search modal (Ctrl+K shortcut).
 *
 * Features:
 *   - Trigger button with 🔍 icon and ⌘K hint
 *   - Full-screen modal with live search across 18 pages
 *   - Keyboard navigation: ArrowUp/Down to select, Enter to navigate, Esc to close
 *   - No-results state shows quick navigation suggestions
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const searchIndex = [
  { title: 'Home', url: '/', keywords: 'home main page institute' },
  { title: 'About Us', url: '/about', keywords: 'about history mission vision team' },
  { title: 'Courses', url: '/courses', keywords: 'courses programs btech mtech mba ai ml data engineering' },
  { title: 'Faculty', url: '/faculty', keywords: 'faculty professors teachers staff' },
  { title: 'Gallery', url: '/gallery', keywords: 'gallery photos images campus life' },
  { title: 'Events', url: '/events', keywords: 'events workshops seminars hackathon competition' },
  { title: 'Blog / News', url: '/blog', keywords: 'blog news updates articles' },
  { title: 'Notice Board', url: '/notices', keywords: 'notices announcements exam schedule holiday urgent' },
  { title: 'Placements', url: '/placements', keywords: 'placements jobs companies hiring salary package career' },
  { title: 'Alumni Network', url: '/alumni', keywords: 'alumni graduates network batch success stories' },
  { title: 'Result / Marksheet', url: '/result', keywords: 'result marksheet marks grades cgpa semester' },
  { title: 'Timetable', url: '/timetable', keywords: 'timetable schedule class timing weekly' },
  { title: 'Fee Payment', url: '/fees', keywords: 'fee payment dues semester hostel charges scholarship' },
  { title: 'FAQ', url: '/faq', keywords: 'faq questions answers admission help' },
  { title: 'Admission', url: '/admission', keywords: 'admission apply application form enroll deadline' },
  { title: 'Student Portal', url: '/portal', keywords: 'portal dashboard student login applications' },
  { title: 'Contact Us', url: '/contact', keywords: 'contact email phone address location map' },
  { title: 'Login', url: '/login', keywords: 'login signin account password' },
  { title: 'Register', url: '/register', keywords: 'register signup create account' },
];

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef();
  const navigate = useNavigate();

  // Keyboard shortcut: Ctrl+K or /
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const hits = searchIndex.filter(item =>
      item.title.toLowerCase().includes(q) || item.keywords.includes(q)
    ).slice(0, 6);
    setResults(hits);
    setActiveIdx(0);
  }, [query]);

  const go = (url) => { navigate(url); setOpen(false); setQuery(''); };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIdx]) go(results[activeIdx].url);
  };

  return (
    <>
      {/* Trigger Button */}
      <button onClick={() => setOpen(true)} title="Search (Ctrl+K)"
        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.color = '#d4af37'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)'; e.currentTarget.style.color = '#64748b'; }}>
        <span>🔍</span>
        <span style={{ display: 'none', fontFamily: 'Sora, sans-serif' }} className="search-label">Search</span>
        <span style={{ fontSize: '0.62rem', color: '#334155', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '4px', display: 'none' }} className="search-hint">⌘K</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', width: '100%', maxWidth: 560, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
              {/* Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#d4af37', fontSize: '1.1rem' }}>🔍</span>
                <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey}
                  placeholder="Search pages, courses, faculty..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: '1rem', fontFamily: 'Sora, sans-serif' }} />
                {query && (
                  <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                )}
                <span style={{ fontSize: '0.65rem', color: '#334155', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>ESC</span>
              </div>

              {/* Results */}
              {results.length > 0 ? (
                <div style={{ padding: '0.5rem 0', maxHeight: 340, overflowY: 'auto' }}>
                  {results.map((r, i) => (
                    <div key={r.url} onClick={() => go(r.url)}
                      style={{ padding: '0.75rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', background: i === activeIdx ? 'rgba(212,175,55,0.08)' : 'transparent', transition: 'background 0.15s' }}
                      onMouseEnter={() => setActiveIdx(i)}>
                      <span style={{ fontSize: '1rem', opacity: 0.6 }}>📄</span>
                      <div>
                        <p style={{ color: i === activeIdx ? '#d4af37' : '#f1f5f9', fontSize: '0.875rem', fontWeight: 500 }}>{r.title}</p>
                        <p style={{ color: '#334155', fontSize: '0.7rem' }}>{r.url}</p>
                      </div>
                      {i === activeIdx && <span style={{ marginLeft: 'auto', color: '#d4af37', fontSize: '0.7rem' }}>↵</span>}
                    </div>
                  ))}
                </div>
              ) : query ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#334155', fontSize: '0.85rem' }}>No results for "{query}"</div>
              ) : (
                <div style={{ padding: '1rem 1.25rem' }}>
                  <p style={{ color: '#334155', fontSize: '0.72rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Navigation</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Courses', 'Faculty', 'Admission', 'Placements', 'Results', 'FAQ'].map(s => (
                      <button key={s} onClick={() => setQuery(s.toLowerCase())}
                        style={{ padding: '0.35rem 0.85rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '20px', color: '#64748b', cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ padding: '0.65rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '1rem' }}>
                {[['↑↓', 'navigate'], ['↵', 'open'], ['ESC', 'close']].map(([key, lbl]) => (
                  <span key={key} style={{ fontSize: '0.65rem', color: '#334155' }}>
                    <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '3px', color: '#475569' }}>{key}</kbd> {lbl}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
