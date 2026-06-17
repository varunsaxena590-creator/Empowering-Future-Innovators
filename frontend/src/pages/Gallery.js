/**
 * @file pages/Gallery.js
 * @description Image gallery with lightbox viewer.
 *
 * Features:
 *   - Category filter: All, Campus, Events, Sports, Academics, Other
 *   - Image grid with hover zoom + overlay effect
 *   - Full-screen lightbox: prev/next, swipe, keyboard (arrows/Esc)
 *
 * Data: getGallery(category) API
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { getGallery } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const categories = ['all', 'campus', 'events', 'sports', 'academics', 'other'];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const touchStartX = useRef(null);
  const { isDark } = useTheme();
  const c = getColors(isDark);

  useEffect(() => {
  let active = true;
  const cat = activeCategory === 'all' ? null : activeCategory;
  getGallery(cat).then((res) => { if (active) setImages(res.data.data || []); }).catch(() => {});
  return () => { active = false; };
  }, [activeCategory]);

  const openImage = (img, i) => { setSelected(img); setSelectedIndex(i); };
  const closeImage = () => { setSelected(null); setSelectedIndex(null); };
  const prevImage = () => {
    if (!images.length) return;
    const ni = (selectedIndex - 1 + images.length) % images.length;
    setSelected(images[ni]); setSelectedIndex(ni);
  };
  const nextImage = () => {
    if (!images.length) return;
    const ni = (selectedIndex + 1) % images.length;
    setSelected(images[ni]); setSelectedIndex(ni);
  };

  useEffect(() => {
    if (!selected) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, selectedIndex]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextImage() : prevImage(); }
    touchStartX.current = null;
  };

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionTitle subtitle="Campus Life" title="Photo Gallery" description="A glimpse into the vibrant world of Zorvex Institute — where innovation meets campus culture." />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', marginBottom: '3rem' }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: '0.45rem 1.1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s', border: activeCategory === cat ? 'none' : `1px solid ${c.borderGold}`, background: activeCategory === cat ? 'linear-gradient(135deg, #d4af37, #f0c040)' : 'transparent', color: activeCategory === cat ? c.bgPrimary : c.textMuted }}>
                {cat}
              </button>
            ))}
          </div>
          {images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {images.map((img, i) => (
                <motion.div key={img._id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  onClick={() => openImage(img, i)}
                  style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: '12px', cursor: 'pointer', border: `1px solid ${c.borderGold}`, transition: 'border-color 0.3s', position: 'relative' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = c.borderGold}>
                  <img src={img.imageUrl} alt={img.title} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                  {/* Hover overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,9,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'flex-end', padding: '0.75rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(5,5,9,0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(5,5,9,0)'}>
                    <span style={{ color: c.text, fontSize: '0.78rem', fontWeight: 500, opacity: 0 }}>{img.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: c.textDim }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</p>
              <p>Gallery images coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeImage}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

            {/* Prev button */}
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', fontSize: '1.5rem', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101 }}>‹</button>

            {/* Image */}
            <motion.div onClick={(e) => e.stopPropagation()} key={selected._id}
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', maxWidth: '85vw' }}>
              <img src={selected.imageUrl} alt={selected.title}
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain', border: '1px solid rgba(212,175,55,0.2)' }} />
              {selected.title && (
                <p style={{ color: c.textMuted, fontSize: '0.85rem', textAlign: 'center' }}>{selected.title}</p>
              )}
              <p style={{ color: c.textDim, fontSize: '0.72rem' }}>{selectedIndex + 1} / {images.length} · Swipe or use arrow keys</p>
            </motion.div>

            {/* Next button */}
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', fontSize: '1.5rem', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101 }}>›</button>

            {/* Close */}
            <button onClick={closeImage}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', fontSize: '1.2rem', cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101 }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;

