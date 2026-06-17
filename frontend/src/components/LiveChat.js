import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const getSessionId = () => {
  let id = sessionStorage.getItem('chat_session_id');
  if (!id) {
    id = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('chat_session_id', id);
  }
  return id;
};

const LiveChat = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [userName, setUserName] = useState('');
  const [started, setStarted] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const sessionId = useRef(getSessionId());
  const typingTimeout = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    try {
      const sock = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 8000,
        timeout: 15000,
      });
      socketRef.current = sock;

      sock.on('connect', () => setConnected(true));
      sock.on('disconnect', () => setConnected(false));
      sock.on('connect_error', () => setConnected(false));
      sock.on('chatError', ({ message }) => {
        setMessages((prev) => [...prev, { sender: 'admin', text: message, timestamp: new Date() }]);
      });

      sock.on('chatHistory', (history) => {
        setMessages(history || []);
        if (history && history.length > 0) setStarted(true);
      });

      sock.on('newMessage', ({ message }) => {
        setMessages((prev) => [...prev, message]);
        if (!openRef.current && message.sender === 'admin') setUnread((u) => u + 1);
      });

      sock.on('typing', ({ sender }) => {
        if (sender === 'admin') setAdminTyping(true);
      });
      sock.on('stopTyping', ({ sender }) => {
        if (sender === 'admin') setAdminTyping(false);
      });

      return () => sock.disconnect();
    } catch (err) {
      console.error('LiveChat socket error:', err);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, adminTyping]);

  const startChat = () => {
    if (!userName.trim()) return;
    setStarted(true);
    socketRef.current?.emit('join', {
      sessionId: sessionId.current,
      userName: userName.trim(),
    });
  };

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    if (started && socketRef.current) {
      socketRef.current.emit('join', {
        sessionId: sessionId.current,
        userName: userName || 'Visitor',
      });
    }
  };

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('sendMessage', {
      sessionId: sessionId.current,
      sender: 'user',
      text: input.trim(),
    });
    socketRef.current.emit('stopTyping', { sessionId: sessionId.current, sender: 'user' });
    setInput('');
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit('typing', { sessionId: sessionId.current, sender: 'user' });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socketRef.current?.emit('stopTyping', { sessionId: sessionId.current, sender: 'user' });
      }, 1500);
    }
  };

  const gold = '#d4af37';
  const bgChat = isDark ? '#0d0d1a' : '#ffffff';
  const bgBubbleUser = 'linear-gradient(135deg, #d4af37, #f0c040)';
  const bgBubbleAdmin = isDark ? '#1a1a2e' : '#f1f1f1';

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={open ? () => setOpen(false) : handleOpen}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37, #f0c040)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
        }}
      >
        {open ? '✕' : '💬'}
        {unread > 0 && !open && (
          <span style={{
            position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff',
            borderRadius: '50%', width: 22, height: 22, fontSize: '0.7rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unread}</span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', bottom: 160, right: 24, zIndex: 9998,
              width: 360, maxWidth: 'calc(100vw - 48px)', height: 480, maxHeight: 'calc(100vh - 200px)',
              borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
              background: bgChat, border: `1px solid ${isDark ? 'rgba(212,175,55,0.2)' : '#e5e7eb'}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem', background: 'linear-gradient(135deg, #0d0d1a, #1a1a2e)',
              borderBottom: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0c040)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              }}>🎓</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, margin: 0, fontFamily: 'Orbitron, sans-serif' }}>
                  Zorvex Support
                </h4>
                <p style={{ color: connected ? '#4ade80' : '#f87171', fontSize: '0.7rem', margin: 0 }}>
                  {connected ? '● Online' : '● Connecting...'}
                </p>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* Start Screen or Messages */}
            {!started ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: 16 }}>
                <div style={{ fontSize: '2.5rem' }}>👋</div>
                <h4 style={{ color: c.text, fontSize: '1rem', fontWeight: 700, margin: 0, textAlign: 'center' }}>Welcome!</h4>
                <p style={{ color: c.textMuted, fontSize: '0.82rem', textAlign: 'center', lineHeight: 1.6 }}>
                  Enter your name to start chatting with our support team.
                </p>
                <input
                  value={userName} onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startChat()}
                  placeholder="Your name..."
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
                    background: isDark ? '#1a1a2e' : '#f9fafb', border: `1px solid ${isDark ? 'rgba(212,175,55,0.2)' : '#d1d5db'}`,
                    color: c.text, fontSize: '0.88rem', outline: 'none',
                  }}
                />
                <button onClick={startChat} style={{
                  width: '100%', padding: '0.75rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509',
                  fontWeight: 700, fontSize: '0.88rem',
                }}>Start Chat</button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {messages.length === 0 && (
                    <p style={{ color: c.textMuted, fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>
                      Send a message to start the conversation!
                    </p>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '80%', padding: '0.6rem 1rem', borderRadius: 12,
                        background: msg.sender === 'user' ? bgBubbleUser : bgBubbleAdmin,
                        color: msg.sender === 'user' ? '#050509' : c.text,
                        fontSize: '0.84rem', lineHeight: 1.6,
                        borderBottomRightRadius: msg.sender === 'user' ? 4 : 12,
                        borderBottomLeftRadius: msg.sender === 'admin' ? 4 : 12,
                      }}>
                        {msg.sender === 'admin' && <div style={{ fontSize: '0.65rem', color: gold, fontWeight: 700, marginBottom: 2 }}>Admin</div>}
                        {msg.text}
                        <div style={{ fontSize: '0.6rem', color: msg.sender === 'user' ? 'rgba(0,0,0,0.5)' : c.textMuted, marginTop: 4, textAlign: 'right' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {adminTyping && (
                    <div style={{ display: 'flex', gap: 4, padding: '0.5rem 1rem', color: c.textMuted, fontSize: '0.75rem' }}>
                      <span>Admin is typing</span>
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}>...</motion.span>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{
                  padding: '0.75rem 1rem', borderTop: `1px solid ${isDark ? 'rgba(212,175,55,0.15)' : '#e5e7eb'}`,
                  display: 'flex', gap: 8, background: isDark ? '#0a0a14' : '#fafafa',
                }}>
                  <input
                    value={input} onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1, padding: '0.65rem 1rem', borderRadius: 10,
                      background: isDark ? '#1a1a2e' : '#fff', border: `1px solid ${isDark ? 'rgba(212,175,55,0.2)' : '#d1d5db'}`,
                      color: c.text, fontSize: '0.85rem', outline: 'none',
                    }}
                  />
                  <button onClick={sendMessage} style={{
                    width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: input.trim() ? 'linear-gradient(135deg, #d4af37, #f0c040)' : isDark ? '#1a1a2e' : '#e5e7eb',
                    color: input.trim() ? '#050509' : '#9ca3af', fontSize: '1.1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>➤</button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;
