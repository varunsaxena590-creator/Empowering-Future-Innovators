/**
 * @file components/PWAInstallButton.js
 * @description Progressive Web App install prompt button.
 *
 * Listens for 'beforeinstallprompt' event.
 * Shows floating "Install App" button when PWA is installable.
 * Triggers native browser install dialog on click.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallButton = () => {
  const [visible, setVisible] = useState(false);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
        >
          <button
            onClick={handleInstall}
            style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 800, borderRadius: '999px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 24px rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}
          >
            📲 Install App
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallButton;
