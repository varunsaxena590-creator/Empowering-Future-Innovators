/**
 * @file pages/Faculty.js
 * @description Faculty directory page.
 *
 * Features:
 *   - Search by name or designation
 *   - Department filter buttons (dynamic from data)
 *   - Faculty cards: photo/initials, name, designation, department, bio, experience
 *
 * Data: getFaculty() API, filtered by department & search
 */
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { getFaculty } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const FacultyCard = ({ member, index, c }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
    whileHover={{ y: -5 }} style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '1rem', overflow: 'hidden' }}>
    <div style={{ height: 200, background: `linear-gradient(135deg, ${c.bgPrimary}, ${c.bgCard})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {member.image ? (
        <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
      ) : (
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '2px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2rem', color: '#d4af37' }}>{member.name[0]}</span>
        </div>
      )}
    </div>
    <div style={{ padding: '1.25rem' }}>
      <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: c.text, marginBottom: '0.25rem' }}>{member.name}</h3>
      <p style={{ color: '#d4af37', fontSize: '0.85rem', fontWeight: 500 }}>{member.designation}</p>
      <p style={{ color: c.textDim, fontSize: '0.8rem', marginTop: '0.25rem' }}>{member.department}</p>
      {member.bio && <p style={{ color: c.textDim, fontSize: '0.78rem', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{member.bio}</p>}
      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${c.borderGold}`, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: c.textDim }}>
        <span>{member.qualification}</span>
        <span>{member.experience}</span>
      </div>
    </div>
  </motion.div>
);

const Faculty = () => {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');

  useEffect(() => {
  let active = true;
  getFaculty().then((res) => { if (active) setFaculty(res.data.data || []); }).catch(() => {}).finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
  }, []);

  const departments = useMemo(() => ['All', ...Array.from(new Set(faculty.map((f) => f.department).filter(Boolean))).sort()], [faculty]);

  const filtered = useMemo(() => faculty.filter((f) => {
    const matchDept = activeDept === 'All' || f.department === activeDept;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.designation.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  }), [faculty, activeDept, search]);

  return (
    <main style={{ paddingTop: '5rem', background: c.bgPrimary, minHeight: '100vh' }}>
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionTitle subtitle="Meet Our Team" title="Expert Faculty" description="Our distinguished faculty brings decades of academic and industry experience." />

          <div style={{ maxWidth: 420, margin: '0 auto 1.5rem' }}>
            <input type="text" placeholder="Search by name or designation..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1.2rem', background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '0.75rem', color: c.text, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {departments.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', marginBottom: '2.5rem' }}>
              {departments.map((dept) => (
                <button key={dept} onClick={() => setActiveDept(dept)}
                  style={{ padding: '0.45rem 1.1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: activeDept === dept ? 'none' : `1px solid ${c.borderGold}`, background: activeDept === dept ? 'linear-gradient(135deg, #d4af37, #f0c040)' : 'transparent', color: activeDept === dept ? '#050509' : c.textMuted }}>
                  {dept}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p style={{ textAlign: 'center', color: c.textDim, padding: '4rem 0' }}>Loading faculty...</p>
          ) : filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((member, i) => <FacultyCard key={member._id} member={member} index={i} c={c} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: c.textDim }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</p>
              <p>{search || activeDept !== 'All' ? 'No faculty match your filters.' : 'Faculty information coming soon.'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Faculty;
