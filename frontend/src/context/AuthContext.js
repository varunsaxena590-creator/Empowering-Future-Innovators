/**
 * @file context/AuthContext.js
 * @description Authentication state management context.
 *
 * Provides:
 *   - user          — Current logged-in user object (or null)
 *   - loading       — True while checking auth on app load
 *   - login()       — Save token + set user after successful login
 *   - logout()      — Clear token + user state
 *   - isAdmin       — Boolean shortcut for user.role === 'admin'
 *
 * Features:
 *   - Auto-checks JWT on app load via getMe() API
 *   - Session timeout: 30 min inactivity → 2 min warning modal → auto logout
 *   - Resets timer on mouse/keyboard/scroll/touch activity
 */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMe } from '../utils/api';

const AuthContext = createContext();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARN_BEFORE = 2 * 60 * 1000;       // warn 2 min before

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const warnTimer = useRef(null);
  const logoutTimer = useRef(null);

  const clearTimers = () => {
    clearTimeout(warnTimer.current);
    clearTimeout(logoutTimer.current);
  };

  const logout = useCallback(() => {
    clearTimers();
    localStorage.removeItem('token');
    setUser(null);
    setShowWarning(false);
  }, []);

  const resetTimers = useCallback(() => {
    if (!localStorage.getItem('token')) return;
    clearTimers();
    setShowWarning(false);
    warnTimer.current = setTimeout(() => setShowWarning(true), SESSION_TIMEOUT - WARN_BEFORE);
    logoutTimer.current = setTimeout(() => logout(), SESSION_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((res) => { setUser(res.data.user); resetTimers(); })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [resetTimers]);

  // Reset timer on user activity
  useEffect(() => {
    if (!user) return;
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const handler = () => resetTimers();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, [user, resetTimers]);

  const login = (token, userData, remember = false) => {
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      localStorage.setItem('token', token); // still store — remove on tab close handled via sessionStorage optionally
    }
    setUser(userData);
    resetTimers();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}

      {/* Session Timeout Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '18px', padding: '2.5rem', maxWidth: 420, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Session Expiring Soon</h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                You've been inactive for a while. Your session will expire in <strong style={{ color: '#f1f5f9' }}>2 minutes</strong> for security. Would you like to stay signed in?
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={resetTimers}
                  style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Stay Signed In
                </button>
                <button onClick={logout}
                  style={{ padding: '0.75rem 1.5rem', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', background: 'transparent', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

