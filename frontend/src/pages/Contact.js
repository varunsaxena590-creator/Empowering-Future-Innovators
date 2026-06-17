/**
 * @file pages/Contact.js
 * @description Contact Us page with info cards + form.
 *
 * Left column: Address, Email, Phone, Office Hours, Map placeholder
 * Right column: Contact form (name, email, phone, subject, message)
 * Validation: name ≥2, subject ≥5, message ≥20 chars, phone regex
 *
 * Data: submitContact() API on form submit
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SectionTitle from '../components/SectionTitle';
import { submitContact } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const contactInfo = [
  { icon: '📍', title: 'Address', value: '42 Innovation Drive, Zorvex City, ZX 10001' },
  { icon: '📧', title: 'Email', value: 'info@zorvexinstitute.edu' },
  { icon: '📞', title: 'Phone', value: '+1 (888) 967-3200' },
  { icon: '⏰', title: 'Office Hours', value: 'Monday – Friday: 8AM – 6PM' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const inp = { width: '100%', padding: '0.85rem 1.2rem', background: c.bgInput, border: `1px solid ${c.borderGold}`, borderRadius: '10px', color: c.text, fontSize: '0.9rem', boxSizing: 'border-box' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error('Name must be at least 2 characters.');
    if (form.subject.trim().length < 5) return toast.error('Subject must be at least 5 characters.');
    if (form.message.trim().length < 20) return toast.error('Message must be at least 20 characters.');
    if (form.phone && !/^[+\d\s\-()]{7,15}$/.test(form.phone)) return toast.error('Enter a valid phone number.');
    setLoading(true);
    try {
      await submitContact(form);
      toast.success('Message sent! We\'ll reply within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally { setLoading(false); }
  };

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <SectionTitle subtitle="Get In Touch" title="Contact Us" description="Have questions about admissions, programs, or campus life? We're here to help." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '3rem' }}>

            {/* Info cards */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {contactInfo.map((item) => (
                <div key={item.title} className="hover-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem' }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(212,175,55,0.1)', border: `1px solid ${c.borderGold}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ color: '#d4af37', fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.title}</h4>
                    <p style={{ color: c.textMuted, fontSize: '0.84rem', lineHeight: 1.5 }}>{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div style={{ marginTop: '1.5rem', height: 180, background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: c.textDim, gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🗺️</span>
                <p style={{ fontSize: '0.8rem' }}>42 Innovation Drive, Zorvex City</p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <h3 style={{ color: c.text, fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Send us a message</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.3rem' }}>Name</label>
                  <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.3rem' }}>Email</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.3rem' }}>Phone (Optional)</label>
                <input type="tel" placeholder="+1 (000) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inp} />
              </div>

              <div>
                <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.3rem' }}>Subject</label>
                <input placeholder="What is this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required style={inp} />
              </div>

              <div>
                <label style={{ display: 'block', color: c.textMuted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.3rem' }}>Message</label>
                <textarea placeholder="Tell us everything..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows="5" style={{ ...inp, resize: 'none' }} />
              </div>

              <button type="submit" disabled={loading}
                style={{ padding: '0.9rem', background: loading ? c.textDim : 'linear-gradient(135deg, #d4af37, #f0c040)', color: c.bgPrimary, fontWeight: 700, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', letterSpacing: '0.04em', marginTop: '0.25rem' }}>
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
