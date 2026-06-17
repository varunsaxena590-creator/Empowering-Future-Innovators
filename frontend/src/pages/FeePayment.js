/**
 * @file pages/FeePayment.js
 * @description Fee payment page with fee structure + payment form.
 *
 * Features:
 *   - Fee structure table by program/semester
 *   - Simulated payment form (card/UPI/bank transfer)
 *   - Payment confirmation receipt
 *
 * Data: Static fee structure data
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const feeStructure = [
  { program: 'B.Tech Computer Science', duration: '4 Years', tuition: 120000, hostel: 60000, misc: 8000 },
  { program: 'B.Tech AI & Machine Learning', duration: '4 Years', tuition: 135000, hostel: 60000, misc: 8000 },
  { program: 'B.Tech Data Engineering', duration: '4 Years', tuition: 128000, hostel: 60000, misc: 8000 },
  { program: 'B.Tech Cybersecurity', duration: '4 Years', tuition: 130000, hostel: 60000, misc: 8000 },
  { program: 'MBA Business Technology', duration: '2 Years', tuition: 180000, hostel: 65000, misc: 10000 },
  { program: 'M.Tech Advanced Computing', duration: '2 Years', tuition: 95000, hostel: 55000, misc: 7000 },
];

const paymentHistory = [
  { id: 'PAY001', semester: 'Sem 1', amount: 94000, date: '2025-07-15', status: 'Paid', mode: 'Online' },
  { id: 'PAY002', semester: 'Sem 2', amount: 94000, date: '2026-01-10', status: 'Paid', mode: 'Online' },
  { id: 'PAY003', semester: 'Sem 3', amount: 94000, date: '2026-07-01', status: 'Pending', mode: '—' },
];

const statusColor = { Paid: '#22c55e', Pending: '#f59e0b', Overdue: '#ef4444' };
const statusBg = { Paid: 'rgba(34,197,94,0.1)', Pending: 'rgba(245,158,11,0.1)', Overdue: 'rgba(239,68,68,0.1)' };

const FeePayment = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [selected, setSelected] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const pending = paymentHistory.find(p => p.status === 'Pending');
  const totalPaid = paymentHistory.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(212,175,55,0.04) 0%, transparent 100%)' }}>
        <SectionTitle subtitle="Financial Information" title="Fee & Payment" description="View fee structure, payment history, and manage your dues." />
      </section>

      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Paid', value: `₹${(totalPaid).toLocaleString()}`, icon: '✅', color: '#22c55e' },
            { label: 'Due Amount', value: `₹${pending ? pending.amount.toLocaleString() : 0}`, icon: '⏳', color: '#f59e0b' },
            { label: 'Next Due Date', value: 'July 1, 2026', icon: '📅', color: '#3b82f6' },
            { label: 'Scholarship', value: '10% Applied', icon: '🏆', color: '#d4af37' },
          ].map(card => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: c.bgCard, border: `1px solid ${card.color}33`, borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: card.color }}>{card.value}</p>
              <p style={{ color: c.textMuted, fontSize: '0.75rem', marginTop: '0.25rem' }}>{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending Due Banner */}
        {pending && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>⚠️ Payment Due: {pending.semester}</p>
              <p style={{ color: c.textMuted, fontSize: '0.8rem', marginTop: '0.25rem' }}>Amount: ₹{pending.amount.toLocaleString()} • Due by July 1, 2026</p>
            </div>
            <button onClick={() => setShowPayModal(true)}
              style={{ padding: '0.65rem 1.75rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
              Pay Now →
            </button>
          </motion.div>
        )}

        {/* Fee Structure Table */}
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, fontSize: '0.9rem', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>FEE STRUCTURE 2025-26</h3>
        <div style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '3rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(212,175,55,0.06)' }}>
                  {['Program', 'Duration', 'Tuition Fee', 'Hostel', 'Misc.', 'Total/Year'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: c.textDim, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${c.borderGold}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: selected === i ? 'rgba(212,175,55,0.04)' : 'transparent' }}
                    onClick={() => setSelected(selected === i ? null : i)}
                    onMouseEnter={e => { if (selected !== i) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { if (selected !== i) e.currentTarget.style.background = 'transparent'; }}>
                    <td style={{ padding: '0.85rem 1rem', color: c.text, fontSize: '0.85rem', fontWeight: 500 }}>{row.program}</td>
                    <td style={{ padding: '0.85rem 1rem', color: c.textMuted, fontSize: '0.82rem' }}>{row.duration}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#d4af37', fontSize: '0.85rem' }}>₹{row.tuition.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem', color: c.textMuted, fontSize: '0.82rem' }}>₹{row.hostel.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem', color: c.textMuted, fontSize: '0.82rem' }}>₹{row.misc.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem', color: c.text, fontWeight: 700, fontSize: '0.85rem' }}>₹{(row.tuition + row.hostel + row.misc).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History */}
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, fontSize: '0.9rem', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>PAYMENT HISTORY</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {paymentHistory.map(p => (
            <div key={p.id} style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: statusBg[p.status], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {p.status === 'Paid' ? '✅' : p.status === 'Pending' ? '⏳' : '❌'}
                </div>
                <div>
                  <p style={{ color: c.text, fontSize: '0.875rem', fontWeight: 600 }}>{p.semester} Fee Payment</p>
                  <p style={{ color: c.textDim, fontSize: '0.75rem' }}>{p.id} • {p.date} • {p.mode}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: c.text, fontWeight: 700, fontSize: '0.9rem' }}>₹{p.amount.toLocaleString()}</p>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor[p.status], background: statusBg[p.status], padding: '2px 8px', borderRadius: '20px' }}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pay Modal */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', maxWidth: 440, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Pay Semester Fee</h3>
            <p style={{ color: c.textMuted, fontSize: '0.85rem', marginBottom: '1.5rem' }}>Amount: <strong style={{ color: c.text }}>₹94,000</strong></p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {['UPI / PhonePe', 'Net Banking', 'Debit Card', 'Credit Card'].map(m => (
                <button key={m} style={{ padding: '0.85rem', background: 'rgba(212,175,55,0.06)', border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.textMuted, cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.color = '#d4af37'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderGold; e.currentTarget.style.color = c.textMuted; }}>
                  {m}
                </button>
              ))}
            </div>
            <p style={{ color: c.textDim, fontSize: '0.72rem', marginBottom: '1.25rem' }}>🔒 Payments are secured via SSL encryption</p>
            <button onClick={() => setShowPayModal(false)} style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '10px', color: c.textMuted, cursor: 'pointer', fontSize: '0.85rem' }}>
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default FeePayment;
