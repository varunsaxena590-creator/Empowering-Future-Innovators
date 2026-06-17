import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminChat = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userTyping, setUserTyping] = useState({});
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const activeChatRef = useRef(null);

  useEffect(() => {
    fetchChats();
    const sock = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 15000,
    });
    socketRef.current = sock;

    sock.on('connect', () => {
      sock.emit('adminListenAll');
      fetchChats();
    });

    sock.on('chatError', ({ message }) => {
      toast.error(message || 'Chat connection issue');
    });

    sock.on('chatUpdate', ({ sessionId, message }) => {
      setChats((prev) => {
        const exists = prev.find((ch) => ch.sessionId === sessionId);
        if (exists) {
          return prev.map((ch) =>
            ch.sessionId === sessionId
              ? { ...ch, messages: [...ch.messages, message], lastActivity: new Date() }
              : ch
          ).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
        }
        fetchChats();
        return prev;
      });
    });

    sock.on('newMessage', ({ sessionId: msgSessionId, message }) => {
      if (message.sender === 'user' && activeChatRef.current === msgSessionId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    sock.on('typing', ({ sessionId, sender }) => {
      if (sender === 'user') setUserTyping((prev) => ({ ...prev, [sessionId]: true }));
    });
    sock.on('stopTyping', ({ sessionId, sender }) => {
      if (sender === 'user') setUserTyping((prev) => ({ ...prev, [sessionId]: false }));
    });

    return () => sock.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/chat`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setChats(data.data);
    } catch (err) {
      console.error('Failed to fetch chats');
    }
  };

  const openChat = (chat) => {
    setActiveChat(chat);
    activeChatRef.current = chat.sessionId;
    setMessages(chat.messages || []);
    socketRef.current?.emit('adminJoin', chat.sessionId);
  };

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const msg = { sender: 'admin', text: input.trim(), timestamp: new Date() };
    socketRef.current?.emit('sendMessage', {
      sessionId: activeChat.sessionId,
      sender: 'admin',
      text: input.trim(),
    });
    socketRef.current?.emit('stopTyping', { sessionId: activeChat.sessionId, sender: 'admin' });
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socketRef.current && activeChat) {
      socketRef.current.emit('typing', { sessionId: activeChat.sessionId, sender: 'admin' });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socketRef.current?.emit('stopTyping', { sessionId: activeChat.sessionId, sender: 'admin' });
      }, 1500);
    }
  };

  const closeChat = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/chat/${sessionId}/close`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      toast.success('Chat closed');
      setChats((prev) => prev.filter((ch) => ch.sessionId !== sessionId));
      if (activeChat?.sessionId === sessionId) { setActiveChat(null); activeChatRef.current = null; setMessages([]); }
    } catch { toast.error('Failed to close chat'); }
  };

  const deleteChat = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/chat/${sessionId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      toast.success('Chat deleted');
      setChats((prev) => prev.filter((ch) => ch.sessionId !== sessionId));
      if (activeChat?.sessionId === sessionId) { setActiveChat(null); activeChatRef.current = null; setMessages([]); }
    } catch { toast.error('Failed to delete chat'); }
  };

  const gold = '#d4af37';

  return (
    <AdminLayout title="Live Chat" subtitle="Real-time support conversations">
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', height: 'calc(100vh - 200px)', minHeight: 500 }}>

        {/* Chat List */}
        <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem', borderBottom: `1px solid ${c.borderGold}` }}>
            <h3 style={{ color: c.text, fontSize: '0.95rem', fontWeight: 700, margin: 0, fontFamily: 'Orbitron, sans-serif' }}>
              Active Chats ({chats.length})
            </h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chats.length === 0 && (
              <p style={{ color: c.textMuted, fontSize: '0.82rem', textAlign: 'center', padding: '3rem 1rem' }}>No active chats</p>
            )}
            {chats.map((chat) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const isActive = activeChat?.sessionId === chat.sessionId;
              return (
                <div key={chat.sessionId} onClick={() => openChat(chat)} style={{
                  padding: '1rem 1.25rem', cursor: 'pointer', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'}`,
                  background: isActive ? (isDark ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.05)') : 'transparent',
                  borderLeft: isActive ? `3px solid ${gold}` : '3px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: c.text, fontWeight: 700, fontSize: '0.88rem' }}>{chat.userName}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={(e) => { e.stopPropagation(); closeChat(chat.sessionId); }} title="Close"
                        style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '0.75rem', padding: 2 }}>✕</button>
                      <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.sessionId); }} title="Delete"
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: 2 }}>🗑</button>
                    </div>
                  </div>
                  {userTyping[chat.sessionId] && (
                    <span style={{ color: gold, fontSize: '0.7rem', fontStyle: 'italic' }}>typing...</span>
                  )}
                  {lastMsg && !userTyping[chat.sessionId] && (
                    <p style={{ color: c.textMuted, fontSize: '0.75rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg.sender === 'admin' ? 'You: ' : ''}{lastMsg.text}
                    </p>
                  )}
                  <span style={{ color: c.textMuted, fontSize: '0.65rem' }}>
                    {new Date(chat.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {!activeChat ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: '3rem' }}>💬</span>
              <p style={{ color: c.textMuted, fontSize: '0.9rem' }}>Select a chat to start replying</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '1rem 1.25rem', borderBottom: `1px solid ${c.borderGold}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0c040)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#050509', fontSize: '0.85rem',
                }}>{activeChat.userName.charAt(0).toUpperCase()}</div>
                <div>
                  <h4 style={{ color: c.text, fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>{activeChat.userName}</h4>
                  <p style={{ color: c.textMuted, fontSize: '0.7rem', margin: 0 }}>
                    {activeChat.userEmail || 'No email provided'} · {activeChat.messages.length} messages
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '65%', padding: '0.6rem 1rem', borderRadius: 12,
                      background: msg.sender === 'admin' ? 'linear-gradient(135deg, #d4af37, #f0c040)' : (isDark ? '#1a1a2e' : '#f1f1f1'),
                      color: msg.sender === 'admin' ? '#050509' : c.text,
                      fontSize: '0.84rem', lineHeight: 1.6,
                      borderBottomRightRadius: msg.sender === 'admin' ? 4 : 12,
                      borderBottomLeftRadius: msg.sender === 'user' ? 4 : 12,
                    }}>
                      {msg.text}
                      <div style={{ fontSize: '0.6rem', color: msg.sender === 'admin' ? 'rgba(0,0,0,0.5)' : c.textMuted, marginTop: 4, textAlign: 'right' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {userTyping[activeChat?.sessionId] && (
                  <div style={{ fontSize: '0.75rem', color: c.textMuted, padding: '0.25rem 0.5rem' }}>
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                      {activeChat.userName} is typing...
                    </motion.span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '0.75rem 1rem', borderTop: `1px solid ${c.borderGold}`,
                display: 'flex', gap: 8, background: isDark ? '#0a0a14' : '#fafafa',
              }}>
                <input
                  value={input} onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Reply to user..."
                  style={{
                    flex: 1, padding: '0.7rem 1rem', borderRadius: 10,
                    background: isDark ? '#1a1a2e' : '#fff', border: `1px solid ${isDark ? 'rgba(212,175,55,0.2)' : '#d1d5db'}`,
                    color: c.text, fontSize: '0.85rem', outline: 'none',
                  }}
                />
                <button onClick={sendMessage} style={{
                  padding: '0 1.5rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: input.trim() ? 'linear-gradient(135deg, #d4af37, #f0c040)' : (isDark ? '#1a1a2e' : '#e5e7eb'),
                  color: input.trim() ? '#050509' : '#9ca3af', fontWeight: 700, fontSize: '0.85rem',
                }}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
