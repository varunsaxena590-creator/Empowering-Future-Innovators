/**
 * @file components/Footer.js
 * @description Site footer with 5 columns.
 *
 * Columns: Brand/mission, Quick Links (8), Student Resources (8),
 *          Programs (5), Contact info + Apply Now button
 * Bottom: Copyright, social icons (X, LinkedIn, YouTube, Instagram)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const Footer = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
  <footer style={{ background: c.bgPrimary, borderTop: `1px solid ${c.border}`, padding: '4rem 1.5rem 2rem', transition: 'background 0.3s ease' }}>
    <div style={{ maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #d4af37, #7c3aed)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem' }}>Z</div>
            <div>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: c.text, letterSpacing: '0.05em' }}>ZORVEX</span>
              <span style={{ display: 'block', fontSize: '0.58rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Institute</span>
            </div>
          </div>
          <p style={{ color: c.textDim, fontSize: '0.83rem', lineHeight: 1.8, maxWidth: 220 }}>
            Empowering Future Innovators through world-class education and cutting-edge research.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.25rem', fontFamily: 'Sora, sans-serif' }}>Quick Links</h4>
          {[['Home', '/'], ['About', '/about'], ['Courses', '/courses'], ['Faculty', '/faculty'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']].map(([name, path]) => (
            <Link key={path} to={path} style={{ display: 'block', color: c.textDim, textDecoration: 'none', fontSize: '0.83rem', marginBottom: '0.55rem' }}>{name}</Link>
          ))}
        </div>

        {/* Student Resources */}
        <div>
          <h4 style={{ color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.25rem', fontFamily: 'Sora, sans-serif' }}>Student Resources</h4>
          {[['Notice Board', '/notices'], ['Result / Marksheet', '/result'], ['Timetable', '/timetable'], ['Fee Payment', '/fees'], ['Placements', '/placements'], ['Alumni Network', '/alumni'], ['FAQ', '/faq'], ['Student Portal', '/portal']].map(([name, path]) => (
            <Link key={path} to={path} style={{ display: 'block', color: c.textDim, textDecoration: 'none', fontSize: '0.83rem', marginBottom: '0.55rem' }}>{name}</Link>
          ))}
        </div>

        {/* Programs */}
        <div>
          <h4 style={{ color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.25rem', fontFamily: 'Sora, sans-serif' }}>Programs</h4>
          {['Computer Science', 'AI & Machine Learning', 'Data Engineering', 'Cybersecurity', 'Business Tech'].map((p) => (
            <p key={p} style={{ color: c.textDim, fontSize: '0.83rem', marginBottom: '0.55rem' }}>{p}</p>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.25rem', fontFamily: 'Sora, sans-serif' }}>Contact</h4>
          {[['📍', '42 Innovation Drive, Zorvex City'], ['📧', 'info@zorvexinstitute.edu'], ['📞', '+1 (888) 967-3200'], ['⏰', 'Mon – Fri: 8AM – 6PM']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem' }}>{icon}</span>
              <span style={{ color: c.textDim, fontSize: '0.83rem', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
          <Link to="/admission" style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem' }}>
            Apply Now →
          </Link>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <p style={{ color: c.textDim, fontSize: '0.78rem' }}>© {new Date().getFullYear()} Zorvex Institute. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {[
            { icon: '𝕏', label: 'Twitter', href: '#' },
            { icon: 'in', label: 'LinkedIn', href: '#' },
            { icon: 'yt', label: 'YouTube', href: '#' },
            { icon: '📸', label: 'Instagram', href: '#' },
          ].map((s) => (
            <a key={s.label} href={s.href} title={s.label}
              style={{ width: 32, height: 32, background: isDark ? 'rgba(212,175,55,0.08)' : 'rgba(0,0,0,0.04)', border: `1px solid ${c.border}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.textDim, fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.color = '#d4af37'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'; e.currentTarget.style.color = '#475569'; }}>
              {s.icon}
            </a>
          ))}
        </div>
        <p style={{ color: c.textDim, fontSize: '0.78rem' }}>Built with ❤️ for Innovators</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
