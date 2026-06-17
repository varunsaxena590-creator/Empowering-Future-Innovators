/**
 * @file pages/FAQ.js
 * @description Frequently Asked Questions page.
 *
 * Features:
 *   - Categorized FAQ tabs: General, Admission, Fees, Campus
 *   - Accordion expand/collapse with AnimatePresence
 *   - Search/filter FAQs by keyword
 *
 * Data: Static FAQ data arrays
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const mockFAQs = [
  { _id: '1', q: 'What is the admission process for B.Tech?', a: 'The admission process involves: 1) Online application form, 2) Document submission, 3) Merit list based on 12th marks or JEE score, 4) Counseling session. Visit our Admission page to apply online.', category: 'Admissions' },
  { _id: '2', q: 'What documents are required for admission?', a: 'Required documents: 10th marksheet, 12th marksheet, Transfer Certificate, Character Certificate, Medical Certificate, 6 passport photos, Aadhar Card copy, and Category certificate (if applicable).', category: 'Admissions' },
  { _id: '3', q: 'What is the annual fee structure?', a: 'Fees vary by course. B.Tech: ₹85,000/year, MBA: ₹1,20,000/year, BCA: ₹65,000/year. Hostel: ₹80,000/year. Scholarships available for merit students. Visit Fee Payment page for complete details.', category: 'Fees' },
  { _id: '4', q: 'Are there any scholarships available?', a: 'Yes! We offer merit scholarships for students with 90%+ in 12th boards, need-based scholarships, SC/ST/OBC government scholarships, and sports/cultural achievement scholarships.', category: 'Fees' },
  { _id: '5', q: 'How many courses does Zorvex Institute offer?', a: 'We offer 15+ UG and PG programs including B.Tech (6 specializations), MBA, BCA, MCA, B.Sc., and Diploma courses. All programs are AICTE approved and affiliated with State University.', category: 'Courses' },
  { _id: '6', q: 'Is hostel facility available?', a: 'Yes, we have separate hostels for boys and girls with capacity for 800 students. Facilities include Wi-Fi, 24/7 security, mess, laundry, gym, and common room. Apply during admission.', category: 'Campus Life' },
  { _id: '7', q: 'What is the exam pattern?', a: 'Exams are conducted at the end of each semester. Internal assessment: 30 marks, External exam: 70 marks. Practical exams and project submissions are separate. Revaluation facility available.', category: 'Exams' },
  { _id: '8', q: 'What is the placement record?', a: 'Our placement record for 2025: 850+ students placed, average package ₹8.5 LPA, highest package ₹42 LPA. Top recruiters include TCS, Infosys, Wipro, Google, Amazon, and 200+ more companies.', category: 'Placements' },
  { _id: '9', q: 'Are there lateral entry admissions?', a: 'Yes, students with 3-year Diploma can take lateral entry directly into 2nd year B.Tech. Separate merit list for lateral entry. Limited seats available.', category: 'Admissions' },
  { _id: '10', q: 'What extracurricular activities are available?', a: 'We have 30+ clubs and societies including coding club, robotics club, drama society, music band, NSS, NCC, photography club, entrepreneurship cell, and various sports teams.', category: 'Campus Life' },
  { _id: '11', q: 'How can I access my exam results?', a: 'Results are published on the college website under Student > Results section. You can also check via the university website. Roll number is required to view results.', category: 'Exams' },
  { _id: '12', q: 'Does the college provide internship opportunities?', a: 'Yes! Our Training & Placement Cell ties up with 500+ companies. Summer internships are mandatory for B.Tech 3rd year. We also run an in-house startup incubator for student entrepreneurs.', category: 'Placements' },
];

const FILTER_TABS = ['All', 'Admissions', 'Fees', 'Courses', 'Campus Life', 'Exams', 'Placements'];

const CAT_COLORS = {
  Admissions: { border: '#d4af37', light: 'rgba(212,175,55,0.1)', text: '#d4af37' },
  Fees: { border: '#f59e0b', light: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  Courses: { border: '#7c3aed', light: 'rgba(124,58,237,0.1)', text: '#a855f7' },
  'Campus Life': { border: '#22c55e', light: 'rgba(34,197,94,0.1)', text: '#4ade80' },
  Exams: { border: '#3b82f6', light: 'rgba(59,130,246,0.1)', text: '#60a5fa' },
  Placements: { border: '#ec4899', light: 'rgba(236,72,153,0.1)', text: '#f472b6' },
};

const getClr = cat => CAT_COLORS[cat] || { border: '#d4af37', light: 'rgba(212,175,55,0.1)', text: '#d4af37' };

const FAQ = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  const filtered = mockFAQs.filter(faq => {
    const matchCat = activeTab === 'All' || faq.category === activeTab;
    const matchSearch = !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, color: c.text }}>

      {/* ── Hero ── */}
      <section style={{ padding: '7rem 1.5rem 3.5rem', background: `linear-gradient(180deg, ${c.bgPrimary} 0%, ${c.bgSection} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(212,175,55,0.05) 1px, transparent 1px)', backgroundSize: '26px 26px', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 350, background: 'radial-gradient(ellipse, rgba(124,58,237,0.09), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span style={{ display: 'inline-block', padding: '0.35rem 1.1rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '999px', color: '#d4af37', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Got Questions?
            </span>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, margin: '0 0 1.25rem', lineHeight: 1.15 }}>
              <span style={{ color: c.text }}>Frequently</span>{' '}
              <span style={{ background: 'linear-gradient(90deg, #d4af37, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Asked Questions</span>
            </h1>
            <p style={{ color: c.textMuted, maxWidth: 540, margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.8 }}>
              Everything you need to know about admissions, fees, courses, campus life and more.
            </p>
            {/* Live search */}
            <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: c.textDim, fontSize: '1rem', pointerEvents: 'none' }}>🔍</span>
              <input placeholder="Search your question..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.95rem 1.1rem 0.95rem 2.75rem', background: c.bgCardAlpha, border: `1px solid ${c.border}`, borderRadius: '12px', color: c.text, fontSize: '0.92rem', boxSizing: 'border-box', backdropFilter: 'blur(12px)' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <div style={{ padding: '0 1.5rem', position: 'sticky', top: 72, zIndex: 10, backdropFilter: 'blur(16px)', background: c.navBg, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {FILTER_TABS.map(tab => {
            const clr = tab === 'All' ? { border: 'rgba(212,175,55,0.5)', light: 'rgba(212,175,55,0.12)', text: '#d4af37' } : getClr(tab);
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '0.4rem 1.1rem', borderRadius: '8px', border: activeTab === tab ? `1px solid ${clr.border}` : `1px solid ${c.border}`, background: activeTab === tab ? clr.light : 'transparent', color: activeTab === tab ? clr.text : c.textDim, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAQ Accordion ── */}
      <section style={{ padding: '3.5rem 1.5rem 5rem', background: c.bgPrimary }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <SectionTitle subtitle={`${filtered.length} Questions`} title="Find Your Answer" />
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: c.textDim }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem' }}>No matching questions</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.5rem', color: c.textDim }}>Try different keywords or browse by category</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.map((faq, i) => {
                const clr = getClr(faq.category);
                const isOpen = openId === faq._id;
                return (
                  <motion.div key={faq._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: c.bgCardAlpha, backdropFilter: 'blur(16px)', border: isOpen ? `1px solid ${clr.border}` : `1px solid ${c.border}`, borderRadius: '14px', overflow: 'hidden', borderLeft: `3px solid ${clr.border}`, transition: 'border-color 0.25s' }}>
                    <button onClick={() => setOpenId(isOpen ? null : faq._id)}
                      style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1 }}>
                        <span style={{ padding: '0.15rem 0.55rem', background: clr.light, border: `1px solid ${clr.border}`, borderRadius: '5px', color: clr.text, fontSize: '0.62rem', fontWeight: 700, whiteSpace: 'nowrap', marginTop: '0.1rem' }}>{faq.category}</span>
                        <span style={{ color: c.text, fontSize: '0.93rem', fontWeight: 500, lineHeight: 1.5 }}>{faq.q}</span>
                      </div>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}
                        style={{ color: isOpen ? clr.text : c.textDim, fontSize: '1.1rem', flexShrink: 0, lineHeight: 1 }}>
                        ▾
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                          <p style={{ padding: '0 1.5rem 1.4rem 3.5rem', color: c.textMuted, fontSize: '0.88rem', lineHeight: 1.85, borderTop: `1px solid ${c.border}` }}>
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Still have questions CTA ── */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ marginTop: '3.5rem', background: c.bgCardAlpha, backdropFilter: 'blur(16px)', border: `1px solid ${c.borderGold}`, borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #d4af37, #7c3aed)' }} />
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', marginBottom: '0.6rem' }}>Still Have Questions?</h3>
            <p style={{ color: c.textDim, fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.7 }}>Our admissions team is here to help you, Monday–Friday 8 AM–6 PM.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact"
                style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', fontSize: '0.88rem' }}>
                📧 Contact Us
              </a>
              <a href="https://wa.me/918888967320" target="_blank" rel="noreferrer"
                style={{ padding: '0.75rem 1.75rem', border: '1px solid rgba(37,211,102,0.4)', color: '#4ade80', borderRadius: '10px', textDecoration: 'none', fontSize: '0.88rem', background: 'rgba(37,211,102,0.06)' }}>
                💬 WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default FAQ;
