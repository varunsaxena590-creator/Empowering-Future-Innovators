/**
 * @file admin/AdminAlumni.js
 * @description Admin CRUD for alumni records.
 *
 * Features:
 *   - Table/Grid: name, batch, company, designation
 *   - Add/Edit modal: photo, name, batch year, company, designation, bio
 *   - Delete with confirmation
 *
 * Data: Alumni API endpoints (CRUD)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';

const mockAlumni = [
  { _id:'1', name:'Arjun Nair', batch:2020, course:'B.Tech CSE', company:'Google', title:'Software Engineer', location:'Bangalore', linkedin:'', achievements:'Led a team of 5 at Google Cloud division' },
  { _id:'2', name:'Sneha Rao', batch:2021, course:'MBA', company:'McKinsey & Co', title:'Business Analyst', location:'Mumbai', linkedin:'', achievements:'Promoted to senior analyst in 18 months' },
  { _id:'3', name:'Vikram Shah', batch:2019, course:'B.Tech ME', company:'Tata Motors', title:'Design Engineer', location:'Pune', linkedin:'', achievements:'Filed 2 patents for EV battery design' },
  { _id:'4', name:'Pritha Das', batch:2022, course:'B.Tech CSE', company:'Microsoft', title:'SDE-2', location:'Hyderabad', linkedin:'', achievements:'Joined as fresher, promoted in 1.5 years' },
  { _id:'5', name:'Rohan Mehra', batch:2020, course:'BCA', company:'Startup (Own)', title:'Co-Founder & CTO', location:'Delhi', linkedin:'', achievements:'Raised ₹2Cr seed funding in 2024' },
  { _id:'6', name:'Kavya Pillai', batch:2021, course:'B.Tech ECE', company:'Qualcomm', title:'Hardware Engineer', location:'Bangalore', linkedin:'', achievements:'Working on 5G chipset development' },
];

const avatarColors = ['#7c3aed','#d4af37','#22c55e','#3b82f6','#ef4444','#ec4899','#f59e0b','#06b6d4'];
const getAvatarColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);

const courses = ['All Courses','B.Tech CSE','B.Tech ME','B.Tech ECE','BCA','MBA'];
const years = ['All Years', ...Array.from({ length:10 }, (_, i) => 2015 + i)];
const emptyForm = { name:'', email:'', batch:'2020', course:'B.Tech CSE', company:'', title:'', linkedin:'', location:'', achievements:'' };

const inp = { width:'100%', padding:'0.65rem 1rem', background:'#0a0a14', border:'1px solid rgba(212,175,55,0.22)', borderRadius:'10px', color:'#f1f5f9', fontSize:'0.85rem', outline:'none', boxSizing:'border-box' };
const glass = { background:'rgba(20,20,42,0.8)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px' };
const goldBtn = { background:'linear-gradient(135deg,#d4af37,#b8960c)', border:'none', color:'#050509', fontWeight:700, padding:'0.6rem 1.4rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.85rem' };
const iconBtn = (color) => ({ background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color, padding:'0.2rem 0.4rem' });

const AlumniModal = ({ alumni, onClose, onSaved }) => {
  const isEdit = !!alumni?._id;
  const [form, setForm] = useState(isEdit ? { ...alumni } : { ...emptyForm });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isEdit ? `${form.name}'s record updated!` : `${form.name} added to alumni!`);
    onSaved({ ...form, _id: alumni?._id || String(Date.now()) });
    onClose();
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', padding:'1rem' }} onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.93, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.93, y:20 }} transition={{ duration:0.22 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'#14142a', border:'1px solid rgba(212,175,55,0.25)', borderRadius:'20px', padding:'2rem', width:'100%', maxWidth:580, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'Orbitron,sans-serif', color:'#f1f5f9', fontSize:'1rem', fontWeight:700 }}>{isEdit ? '✏️ Edit Alumni' : '➕ Add Alumni'}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Full Name</label>
              <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Email</label>
              <input style={inp} type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Batch Year</label>
              <select style={inp} value={form.batch} onChange={e => set('batch', Number(e.target.value))}>
                {Array.from({ length:15 }, (_, i) => 2010 + i).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Course</label>
              <select style={inp} value={form.course} onChange={e => set('course', e.target.value)}>
                {courses.filter(c => c !== 'All Courses').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Current Company</label>
              <input style={inp} value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Job Title</label>
              <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Location</label>
              <input style={inp} value={form.location || ''} onChange={e => set('location', e.target.value)} />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>LinkedIn URL</label>
              <input style={inp} value={form.linkedin || ''} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div style={{ gridColumn:'span 2' }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Achievements</label>
              <textarea style={{ ...inp, minHeight:80, resize:'vertical' }} value={form.achievements || ''} onChange={e => set('achievements', e.target.value)} />
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'0.5rem' }}>
            <button type="button" onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', padding:'0.6rem 1.4rem', borderRadius:'10px', cursor:'pointer' }}>Cancel</button>
            <button type="submit" style={goldBtn}>{isEdit ? 'Save Changes' : 'Add Alumni'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminAlumni = () => {
  const [alumni, setAlumni] = useState(mockAlumni);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [companyFilter, setCompanyFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const companies = ['', ...Array.from(new Set(alumni.map(a => a.company)))];

  const filtered = alumni.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || (a.company || '').toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === 'All Years' || String(a.batch) === String(yearFilter);
    const matchCompany = !companyFilter || a.company === companyFilter;
    return matchSearch && matchYear && matchCompany;
  });

  const employed = alumni.filter(a => a.company && a.company !== 'Seeking').length;
  const employedPct = ((employed / alumni.length) * 100).toFixed(0);
  const countries = new Set(alumni.map(a => (a.location || '').split(',').pop().trim())).size;

  const statCards = [
    { label:'Total Alumni', value:alumni.length, icon:'🎓', color:'#7c3aed' },
    { label:'Employed %', value:`${employedPct}%`, icon:'💼', color:'#22c55e' },
    { label:'Avg Experience', value:'2.4 yrs', icon:'📈', color:'#d4af37' },
    { label:'Locations', value:countries, icon:'🌍', color:'#3b82f6' },
  ];

  const handleSaved = (saved) => {
    setAlumni(prev => prev.some(a => a._id === saved._id) ? prev.map(a => a._id===saved._id ? saved : a) : [...prev, saved]);
  };
  const handleDelete = (id) => { if (window.confirm('Remove this alumni record?')) setAlumni(prev => prev.filter(a => a._id !== id)); };
  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (a) => { setEditTarget(a); setModalOpen(true); };

  return (
    <AdminLayout title="Alumni Management">
      <div style={{ padding:'1.5rem', minHeight:'100vh', background:'#050509' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <h1 style={{ fontFamily:'Orbitron,sans-serif', color:'#f1f5f9', fontSize:'1.4rem', fontWeight:800, margin:0 }}>Alumni Management</h1>
            <p style={{ color:'#64748b', fontSize:'0.82rem', margin:'0.3rem 0 0' }}>Connect and track Zorvex Institute alumni</p>
          </div>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button onClick={() => setViewMode(v => v==='grid'?'list':'grid')}
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', padding:'0.6rem 1rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.85rem' }}>
              {viewMode==='grid' ? '☰ List' : '⊞ Grid'}
            </button>
            <button onClick={openAdd} style={goldBtn}>➕ Add Alumni</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
              style={{ ...glass, padding:'1.2rem 1.4rem', display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ width:44, height:44, borderRadius:'12px', background:`${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>{s.icon}</div>
              <div>
                <div style={{ color:'#f1f5f9', fontWeight:800, fontSize:'1.4rem' }}>{s.value}</div>
                <div style={{ color:'#64748b', fontSize:'0.75rem' }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ ...glass, padding:'1rem 1.2rem', marginBottom:'1.2rem', display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap' }}>
          <input style={{ ...inp, maxWidth:260 }} placeholder="🔍 Search by name or company..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={{ ...inp, maxWidth:160 }} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y==='All Years'?y:`Batch ${y}`}</option>)}
          </select>
          <select style={{ ...inp, maxWidth:180 }} value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
            <option value="">All Companies</option>
            {companies.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span style={{ color:'#64748b', fontSize:'0.8rem', marginLeft:'auto' }}>{filtered.length} alumni</span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem' }}>
            {filtered.map((a, i) => (
              <motion.div key={a._id} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                style={{ ...glass, padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background:getAvatarColor(a.name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:800, color:'#fff', fontFamily:'Orbitron,sans-serif', flexShrink:0 }}>
                    {getInitials(a.name)}
                  </div>
                  <div>
                    <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:'0.95rem' }}>{a.name}</div>
                    <div style={{ color:'#64748b', fontSize:'0.75rem' }}>Batch {a.batch} • {a.course}</div>
                  </div>
                </div>
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'0.8rem' }}>
                  <div style={{ color:'#d4af37', fontWeight:700, fontSize:'0.88rem' }}>{a.company}</div>
                  <div style={{ color:'#94a3b8', fontSize:'0.78rem', marginTop:'0.2rem' }}>{a.title}</div>
                  {a.location && <div style={{ color:'#64748b', fontSize:'0.73rem', marginTop:'0.2rem' }}>📍 {a.location}</div>}
                </div>
                {a.achievements && (
                  <div style={{ color:'#64748b', fontSize:'0.76rem', lineHeight:1.5, borderLeft:'2px solid rgba(212,175,55,0.3)', paddingLeft:'0.6rem' }}>
                    {a.achievements}
                  </div>
                )}
                <div style={{ display:'flex', gap:'0.5rem', justifyContent:'space-between', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'0.75rem', alignItems:'center' }}>
                  <div style={{ display:'flex', gap:'0.4rem' }}>
                    {a.linkedin && (
                      <a href={a.linkedin} target="_blank" rel="noopener noreferrer"
                        style={{ background:'rgba(10,102,194,0.15)', border:'1px solid rgba(10,102,194,0.3)', color:'#0a66c2', padding:'0.35rem 0.65rem', borderRadius:'8px', textDecoration:'none', fontSize:'0.78rem' }}>
                        🔗 LinkedIn
                      </a>
                    )}
                  </div>
                  <div style={{ display:'flex', gap:'0.4rem' }}>
                    <button onClick={() => openEdit(a)} style={{ ...iconBtn('#7c3aed'), background:'rgba(124,58,237,0.1)', padding:'0.35rem 0.7rem', borderRadius:'8px', border:'1px solid rgba(124,58,237,0.2)' }}>✏️</button>
                    <button onClick={() => handleDelete(a._id)} style={{ ...iconBtn('#ef4444'), background:'rgba(239,68,68,0.1)', padding:'0.35rem 0.7rem', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.2)' }}>🗑</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List / Table View */
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ ...glass, overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                    {['Alumni','Batch','Course','Company','Title','Location','Actions'].map(h => (
                      <th key={h} style={{ padding:'1rem 1.2rem', textAlign:'left', color:'#64748b', fontWeight:600, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <motion.tr key={a._id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                      style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(212,175,55,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'0.9rem 1.2rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.7rem' }}>
                          <div style={{ width:34, height:34, borderRadius:'50%', background:getAvatarColor(a.name), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.8rem', flexShrink:0 }}>{getInitials(a.name)}</div>
                          <span style={{ color:'#f1f5f9', fontWeight:600 }}>{a.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#94a3b8' }}>{a.batch}</td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#94a3b8' }}>{a.course}</td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#d4af37', fontWeight:600 }}>{a.company}</td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#94a3b8' }}>{a.title}</td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#64748b', fontSize:'0.8rem' }}>📍 {a.location}</td>
                      <td style={{ padding:'0.9rem 1.2rem' }}>
                        <button onClick={() => openEdit(a)} style={iconBtn('#7c3aed')} title="Edit">✏️</button>
                        <button onClick={() => handleDelete(a._id)} style={iconBtn('#ef4444')} title="Delete">🗑</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>No alumni found</div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && <AlumniModal alumni={editTarget} onClose={() => setModalOpen(false)} onSaved={handleSaved} />}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminAlumni;
