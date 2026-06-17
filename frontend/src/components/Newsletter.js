/**
 * @file components/Newsletter.js
 * @description Email newsletter subscription banner.
 *
 * Left: "📬 Stay Updated!" heading + description
 * Right: Email input + Subscribe button with loading/success states
 * Saves subscribed email to localStorage ('zi-newsletter-email')
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const STORAGE_KEY = 'zi-newsletter-email';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  const c = getColors(isDark);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === email.toLowerCase()) { setAlreadySubscribed(true); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, email.toLowerCase());
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <>
      <style>{`@keyframes zi-spin { to { transform: rotate(360deg); } }`}</style>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(212,175,55,0.08))',
          border: '1px solid rgba(212,175,55,0.12)',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          maxWidth: 1280,
          margin: '0 auto 4rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {/* Left */}
          <div style={{ flex: '1 1 280px' }}>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              color: c.text,
              marginBottom: '0.75rem',
              fontWeight: 700,
            }}>
              Stay Updated! 📬
            </h2>
            <p style={{ color: c.textMuted, fontSize: '0.95rem', lineHeight: 1.75 }}>
              Get the latest news, events, and admission updates directly in your inbox.
            </p>
          </div>

          {/* Right */}
          <div style={{ flex: '1 1 340px' }}>
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '12px',
                  color: '#22c55e',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textAlign: 'center',
                }}>
                ✅ Subscribed successfully!
              </motion.div>
            ) : alreadySubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '12px',
                  color: '#d4af37',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textAlign: 'center',
                }}>
                🔔 You're already subscribed!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Enter your email address..."
                    style={{
                      flex: '1 1 200px',
                      padding: '0.85rem 1.25rem',
                      background: isDark ? 'rgba(14,14,28,0.85)' : 'rgba(255,255,255,0.9)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '10px',
                      color: c.text,
                      fontSize: '0.9rem',
                      outline: 'none',
                      backdropFilter: 'blur(10px)',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#d4af37')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.25)')}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.85rem 1.75rem',
                      background: loading ? 'rgba(212,175,55,0.5)' : 'linear-gradient(135deg, #d4af37, #f0c040)',
                      color: '#050509',
                      fontWeight: 700,
                      borderRadius: '10px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexShrink: 0,
                      transition: 'opacity 0.2s',
                    }}>
                    {loading ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: 15,
                          height: 15,
                          border: '2px solid rgba(0,0,0,0.25)',
                          borderTopColor: '#050509',
                          borderRadius: '50%',
                          animation: 'zi-spin 0.8s linear infinite',
                        }} />
                        Subscribing...
                      </>
                    ) : 'Subscribe'}
                  </button>
                </div>
                {error && (
                  <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default Newsletter;
