import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

/* ── FAQ Knowledge Base ── */
const KB = [
  { keys: ['admission', 'apply', 'process', 'register', 'enroll', 'join', 'entrance'], q: 'Admission Process', a: 'The admission process involves: 1) Online application form on our website, 2) Document submission, 3) Merit list based on 12th marks or JEE score, 4) Counseling session. Visit our /admission page to apply!' },
  { keys: ['document', 'documents', 'required', 'papers', 'certificate'], q: 'Required Documents', a: 'You need: 10th marksheet, 12th marksheet, Transfer Certificate, Character Certificate, Medical Certificate, 6 passport photos, Aadhar Card copy, and Category certificate (if applicable).' },
  { keys: ['fee', 'fees', 'cost', 'tuition', 'payment', 'price', 'charges'], q: 'Fee Structure', a: 'Fees vary by course — B.Tech: ₹85,000/year, MBA: ₹1,20,000/year, BCA: ₹65,000/year. Hostel: ₹80,000/year. Scholarships available for merit students! Check /fees for details.' },
  { keys: ['scholarship', 'merit', 'financial', 'aid', 'concession', 'waiver'], q: 'Scholarships', a: 'We offer: Merit scholarships (90%+ in 12th), need-based scholarships, SC/ST/OBC government scholarships, and sports/cultural achievement scholarships. Apply during admission.' },
  { keys: ['course', 'program', 'branch', 'specialization', 'btech', 'mba', 'bca', 'mca'], q: 'Courses Offered', a: 'We offer 15+ programs: B.Tech (6 specializations), MBA, BCA, MCA, B.Sc., and Diploma courses. All AICTE approved & affiliated with State University. Browse /courses for details.' },
  { keys: ['hostel', 'accommodation', 'room', 'stay', 'living', 'mess'], q: 'Hostel Facility', a: 'Separate boys & girls hostels for 800+ students. Facilities: Wi-Fi, 24/7 security, mess, laundry, gym, common room. Apply during admission process.' },
  { keys: ['exam', 'exams', 'test', 'semester', 'internal', 'marks', 'pattern'], q: 'Exam Pattern', a: 'Semester-end exams: Internal assessment (30 marks) + External exam (70 marks). Practical exams & project submissions separate. Revaluation facility available.' },
  { keys: ['placement', 'job', 'recruit', 'package', 'salary', 'company', 'career', 'hire'], q: 'Placements', a: '2025 record: 850+ placed, avg ₹8.5 LPA, highest ₹42 LPA! Top recruiters: TCS, Infosys, Wipro, Google, Amazon & 200+ companies. Visit /placements.' },
  { keys: ['lateral', 'diploma', 'direct', 'second year'], q: 'Lateral Entry', a: 'Yes! Diploma holders can join directly in 2nd year B.Tech via lateral entry. Separate merit list & limited seats available.' },
  { keys: ['club', 'activity', 'extracurricular', 'sport', 'cultural', 'fest', 'event'], q: 'Activities & Clubs', a: '30+ clubs: Coding Club, Robotics, Drama Society, Music Band, NSS, NCC, Photography, Entrepreneurship Cell & many sports teams. Check /events!' },
  { keys: ['result', 'grade', 'cgpa', 'sgpa', 'marksheet', 'score'], q: 'Results', a: 'Results are published on our website under Student > Results. Roll number required. Also available on the university website. Visit /result.' },
  { keys: ['internship', 'training', 'industrial', 'summer'], q: 'Internships', a: 'Our T&P Cell partners with 500+ companies. Summer internships mandatory for B.Tech 3rd year. We also have an in-house startup incubator!' },
  { keys: ['faculty', 'teacher', 'professor', 'staff', 'hod'], q: 'Faculty', a: 'We have 200+ highly qualified faculty — many with PhDs from IITs/NITs. Student-teacher ratio 1:15. Check our Faculty page at /faculty.' },
  { keys: ['library', 'book', 'journal', 'reading'], q: 'Library', a: 'Central library with 50,000+ books, 200+ journals, e-library access with IEEE/Springer databases. Open 8 AM to 11 PM, including weekends.' },
  { keys: ['lab', 'laboratory', 'computer', 'practical', 'workshop'], q: 'Labs & Infrastructure', a: 'State-of-the-art labs: 500+ computers, IoT Lab, AI/ML Lab, Robotics Workshop, Physics/Chemistry/Electronics labs. All with latest equipment.' },
  { keys: ['transport', 'bus', 'route', 'commute', 'travel'], q: 'Transport', a: 'College buses cover 20+ routes across the city and nearby areas. AC & Non-AC options. Annual pass: ₹15,000-₹25,000 depending on distance.' },
  { keys: ['wifi', 'internet', 'network', 'connectivity'], q: 'Wi-Fi & Internet', a: 'Full campus Wi-Fi coverage with 1 Gbps fiber. Free access for all students. Separate high-speed connection in labs & library.' },
  { keys: ['contact', 'phone', 'email', 'reach', 'address', 'location', 'where'], q: 'Contact & Location', a: 'Visit our Contact page at /contact for phone, email & campus address. You can also use our Live Chat for instant support!' },
  { keys: ['time', 'timing', 'schedule', 'hours', 'class', 'timetable'], q: 'Timetable', a: 'Classes run 9 AM to 4 PM (Mon-Sat). Timetable is available on /timetable page. Each department has its own schedule.' },
  { keys: ['notice', 'announcement', 'circular', 'update', 'news'], q: 'Notices', a: 'All official notices & announcements are posted on /notices page. Keep checking for exam dates, holidays & events!' },
  { keys: ['alumni', 'passed', 'graduate', 'batch'], q: 'Alumni Network', a: 'Strong alumni network of 25,000+ graduates working at top MNCs globally. Annual alumni meet & mentorship programs. Visit /alumni.' },
  { keys: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'hola'], q: 'Greeting', a: 'Hello! 👋 Welcome to Zorvex Institute! I\'m your AI assistant. Ask me anything about admissions, courses, fees, placements, campus life, or anything else!' },
  { keys: ['thank', 'thanks', 'bye', 'goodbye', 'ok', 'great'], q: 'Closing', a: 'You\'re welcome! 😊 Feel free to ask anytime. Good luck with your journey at Zorvex Institute! 🎓' },
];

const SUGGESTIONS = ['Admission process?', 'Fee structure?', 'Placements?', 'Courses offered?', 'Hostel facility?', 'Scholarships?'];

const findAnswer = (input) => {
  const words = input.toLowerCase().replace(/[?!.,]/g, '').split(/\s+/);
  let best = null;
  let bestScore = 0;

  for (const item of KB) {
    let score = 0;
    for (const word of words) {
      for (const key of item.keys) {
        if (key === word) score += 3;
        else if (key.includes(word) || word.includes(key)) score += 1.5;
        else if (levenshtein(key, word) <= 2) score += 1;
      }
    }
    if (score > bestScore) { bestScore = score; best = item; }
  }

  if (bestScore >= 1.5) return best.a;
  return "I'm not sure about that. 🤔 You can try asking about admissions, courses, fees, placements, hostel, exams, or campus life. Or visit our /contact page to reach the support team!";
};

const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
};

const AIChatbot = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const STORAGE_KEY = 'zorvex_chatbot_history';
  const welcomeMsg = { sender: 'bot', text: "Hi there! 👋 I'm **ZorvexBot**, your AI college assistant. Ask me anything about Zorvex Institute — admissions, courses, fees, placements & more!", time: new Date() };

  const EXPIRY_MS = 48 * 60 * 60 * 1000; // 48 hours in ms

  const loadMessages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const now = Date.now();
        const parsed = JSON.parse(saved)
          .map(m => ({ ...m, time: new Date(m.time) }))
          .filter(m => now - new Date(m.time).getTime() < EXPIRY_MS);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return [welcomeMsg];
  };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  // Save to localStorage whenever messages change
  useEffect(() => {
    try {
      // Keep last 50 messages to avoid bloating storage
      const toSave = messages.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const clearChat = () => {
    setMessages([welcomeMsg]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { sender: 'user', text: msg, time: new Date() }]);
    setInput('');
    setTyping(true);

    // Simulate typing delay
    const delay = 400 + Math.random() * 800;
    setTimeout(() => {
      const answer = findAnswer(msg);
      setMessages((prev) => [...prev, { sender: 'bot', text: answer, time: new Date() }]);
      setTyping(false);
    }, delay);
  };

  const formatMsg = (text) => {
    // Simple bold markdown **text**
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\/([\w-]+)/g, '<a href="/$1" style="color:#d4af37;text-decoration:underline;">/$1</a>');
  };

  const gold = '#d4af37';
  const bgChat = isDark ? '#0d0d1a' : '#ffffff';

  return (
    <>
      {/* Floating Bot Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #d4af37)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', color: '#fff',
        }}
      >
        {open ? '✕' : '🤖'}
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
              position: 'fixed', bottom: 92, left: 24, zIndex: 9998,
              width: 370, maxWidth: 'calc(100vw - 48px)', height: 500, maxHeight: 'calc(100vh - 130px)',
              borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
              background: bgChat, border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : '#e5e7eb'}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, #1a0a2e, #0d0d1a)',
              borderBottom: '1px solid rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #d4af37)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>🤖</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700, margin: 0, fontFamily: 'Orbitron, sans-serif' }}>
                  ZorvexBot
                </h4>
                <p style={{ color: '#a78bfa', fontSize: '0.7rem', margin: 0 }}>● AI Assistant — Ask me anything!</p>
              </div>
              <button onClick={clearChat} title="Clear chat" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.9rem', padding: '0.2rem' }}>🗑</button>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', padding: '0.6rem 1rem', borderRadius: 12, lineHeight: 1.6,
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                      : (isDark ? '#14142a' : '#f1f1f1'),
                    color: msg.sender === 'user' ? '#fff' : c.text,
                    fontSize: '0.84rem',
                    borderBottomRightRadius: msg.sender === 'user' ? 4 : 12,
                    borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 12,
                  }}>
                    {msg.sender === 'bot' && <div style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: 700, marginBottom: 2 }}>ZorvexBot</div>}
                    <span dangerouslySetInnerHTML={{ __html: formatMsg(msg.text) }} />
                    <div style={{ fontSize: '0.6rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.5)' : c.textMuted, marginTop: 4, textAlign: 'right' }}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', gap: 4, padding: '0.5rem 1rem', color: '#a78bfa', fontSize: '0.75rem' }}>
                  <span>ZorvexBot is thinking</span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}>...</motion.span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div style={{ padding: '0 1rem 0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)}
                    style={{
                      padding: '0.35rem 0.75rem', borderRadius: 20,
                      background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)',
                      border: '1px solid rgba(124,58,237,0.25)',
                      color: '#a78bfa', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '0.75rem 1rem',
              borderTop: `1px solid ${isDark ? 'rgba(124,58,237,0.15)' : '#e5e7eb'}`,
              display: 'flex', gap: 8,
              background: isDark ? '#0a0a14' : '#fafafa',
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about admissions, courses..."
                style={{
                  flex: 1, padding: '0.65rem 1rem', borderRadius: 10,
                  background: isDark ? '#14142a' : '#fff',
                  border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : '#d1d5db'}`,
                  color: c.text, fontSize: '0.85rem', outline: 'none',
                }}
              />
              <button onClick={() => sendMessage()} style={{
                width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #d4af37)' : (isDark ? '#14142a' : '#e5e7eb'),
                color: input.trim() ? '#fff' : '#9ca3af', fontSize: '1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
