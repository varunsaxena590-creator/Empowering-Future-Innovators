/**
 * @file admin/AdminPlacements.js
 * @description Admin CRUD for placement records.
 *
 * Features:
 *   - Table: student, company, package, role, year, actions
 *   - Add/Edit modal: student name, company, CTC, role, year
 *   - Delete with confirmation
 *
 * Data: Placement API endpoints (CRUD)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';

const mockPlacements = [
  { _id:'1', company:'Google', industry:'Technology', studentsHired:5, minPackage:24, maxPackage:42, year:2026, status:'Completed', color:'#4285f4' },
  { _id:'2', company:'TCS', industry:'IT Services', studentsHired:82, minPackage:3.5, maxPackage:7, year:2026, status:'Completed', color:'#00539f' },
  { _id:'3', company:'Infosys', industry:'IT Services', studentsHired:60, minPackage:3.6, maxPackage:6.5, year:2026, status:'Completed', color:'#007cc3' },
  { _id:'4', company:'Amazon', industry:'E-Commerce', studentsHired:8, minPackage:18, maxPackage:32, year:2026, status:'Active', color:'#ff9900' },
  { _id:'5', company:'Wipro', industry:'IT Services', studentsHired:45, minPackage:3.5, maxPackage:5.5, year:2026, status:'Completed', color:'#341c78' },
  { _id:'6', company:'Microsoft', industry:'Technology', studentsHired:3, minPackage:28, maxPackage:40, year:2026, status:'Active', color:'#00a4ef' },
];

const emptyForm = { company:'', industry:'', minPackage:'', maxPackage:'', studentsHired:'', visitDate:'', status:'Active', year: new Date().getFullYear() };

const inp = { width:'100%', padding:'0.65rem 1rem', background:'#0a0a14', border:'1px solid rgba(212,175,55,0.22)', borderRadius:'10px', color:'#f1f5f9', fontSize:'0.85rem', outline:'none', boxSizing:'border-box' };
const glass = { background:'rgba(20,20,42,0.8)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px' };
const goldBtn = { background:'linear-gradient(135deg,#d4af37,#b8960c)', border:'none', color:'#050509', fontWeight:700, padding:'0.6rem 1.4rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.85rem' };
const iconBtn = (color) => ({ background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color, padding:'0.2rem 0.4rem' });

const PlacementModal = ({ placement, onClose, onSaved }) => {
  const isEdit = !!placement?._id;
  const [form, setForm] = useState(isEdit ? { ...placement } : { ...emptyForm });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isEdit ? `${form.company} record updated!` : `${form.company} added!`);
    onSaved({ ...form, _id: placement?._id || String(Date.now()), color: placement?.color || `#${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}` });
    onClose();
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', padding:'1rem' }} onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.93, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.93, y:20 }} transition={{ duration:0.22 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'#14142a', border:'1px solid rgba(212,175,55,0.25)', borderRadius:'20px', padding:'2rem', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'Orbitron,sans-serif', color:'#f1f5f9', fontSize:'1rem', fontWeight:700 }}>{isEdit ? '✏️ Edit Company' : '➕ Add Company'}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div style={{ gridColumn:'span 2' }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Company Name</label>
              <input style={inp} value={form.company} onChange={e => set('company', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Industry</label>
              <input style={inp} value={form.industry} onChange={e => set('industry', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Year</label>
              <input style={inp} type="number" value={form.year} onChange={e => set('year', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Min Package (LPA)</label>
              <input style={inp} type="number" step="0.1" value={form.minPackage} onChange={e => set('minPackage', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Max Package (LPA)</label>
              <input style={inp} type="number" step="0.1" value={form.maxPackage} onChange={e => set('maxPackage', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Students Hired</label>
              <input style={inp} type="number" value={form.studentsHired} onChange={e => set('studentsHired', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Visit Date</label>
              <input style={inp} type="date" value={form.visitDate || ''} onChange={e => set('visitDate', e.target.value)} />
            </div>
            <div style={{ gridColumn:'span 2' }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Status</label>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                {['Active','Completed'].map(s => (
                  <button key={s} type="button" onClick={() => set('status', s)}
                    style={{ flex:1, padding:'0.55rem', borderRadius:'8px', border:'1px solid', cursor:'pointer', fontSize:'0.82rem', fontWeight:600,
                      borderColor: form.status===s ? (s==='Active' ? '#22c55e' : '#3b82f6') : 'rgba(255,255,255,0.1)',
                      background: form.status===s ? (s==='Active' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)') : 'transparent',
                      color: form.status===s ? (s==='Active' ? '#22c55e' : '#3b82f6') : '#64748b' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
            <button type="button" onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', padding:'0.6rem 1.4rem', borderRadius:'10px', cursor:'pointer' }}>Cancel</button>
            <button type="submit" style={goldBtn}>{isEdit ? 'Save Changes' : 'Add Company'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPlacements = () => {
  const [placements, setPlacements] = useState(mockPlacements);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const totalStudents = placements.reduce((acc, p) => acc + Number(p.studentsHired), 0);
  const avgPkg = (placements.reduce((acc, p) => acc + Number(p.maxPackage), 0) / placements.length).toFixed(1);
  const highestPkg = Math.max(...placements.map(p => Number(p.maxPackage)));

  const statCards = [
    { label:'Total Companies', value:placements.length, icon:'🏢', color:'#7c3aed' },
    { label:'Students Placed', value:totalStudents, icon:'🎓', color:'#22c55e' },
    { label:'Avg Package', value:`${avgPkg} LPA`, icon:'💰', color:'#d4af37' },
    { label:'Highest Package', value:`${highestPkg} LPA`, icon:'🏆', color:'#ef4444' },
  ];

  const handleSaved = (saved) => {
    setPlacements(prev => prev.some(p => p._id === saved._id) ? prev.map(p => p._id===saved._id ? saved : p) : [...prev, saved]);
  };
  const handleDelete = (id) => { if (window.confirm('Delete this placement record?')) setPlacements(prev => prev.filter(p => p._id !== id)); };
  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (p) => { setEditTarget(p); setModalOpen(true); };

  return (
    <AdminLayout title="Placement Records">
      <div style={{ padding:'1.5rem', minHeight:'100vh', background:'#050509' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <h1 style={{ fontFamily:'Orbitron,sans-serif', color:'#f1f5f9', fontSize:'1.4rem', fontWeight:800, margin:0 }}>Placement Records</h1>
            <p style={{ color:'#64748b', fontSize:'0.82rem', margin:'0.3rem 0 0' }}>Track campus recruitment and placements</p>
          </div>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button onClick={() => setViewMode(v => v==='grid'?'list':'grid')}
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', padding:'0.6rem 1rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.85rem' }}>
              {viewMode==='grid' ? '☰ List' : '⊞ Grid'}
            </button>
            <button onClick={openAdd} style={goldBtn}>➕ Add Company</button>
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

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.2rem' }}>
            {placements.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                style={{ ...glass, padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.9rem' }}>
                    <div style={{ width:48, height:48, borderRadius:'14px', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:900, color:'#fff', fontFamily:'Orbitron,sans-serif', flexShrink:0 }}>
                      {p.company[0]}
                    </div>
                    <div>
                      <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:'0.95rem' }}>{p.company}</div>
                      <div style={{ color:'#64748b', fontSize:'0.75rem' }}>{p.industry} • {p.year}</div>
                    </div>
                  </div>
                  <span style={{ padding:'0.25rem 0.65rem', borderRadius:'20px', fontSize:'0.7rem', fontWeight:700,
                    background: p.status==='Active' ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)',
                    color: p.status==='Active' ? '#22c55e' : '#64748b',
                    border:`1px solid ${p.status==='Active'?'rgba(34,197,94,0.3)':'rgba(100,116,139,0.3)'}` }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'0.75rem', textAlign:'center' }}>
                    <div style={{ color:'#d4af37', fontWeight:800, fontSize:'1.1rem' }}>{p.studentsHired}</div>
                    <div style={{ color:'#64748b', fontSize:'0.7rem' }}>Students Hired</div>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'0.75rem', textAlign:'center' }}>
                    <div style={{ color:'#22c55e', fontWeight:800, fontSize:'0.95rem' }}>{p.minPackage}–{p.maxPackage} LPA</div>
                    <div style={{ color:'#64748b', fontSize:'0.7rem' }}>Package Range</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'0.75rem' }}>
                  <button onClick={() => openEdit(p)} style={{ ...iconBtn('#7c3aed'), background:'rgba(124,58,237,0.1)', padding:'0.4rem 0.8rem', borderRadius:'8px', border:'1px solid rgba(124,58,237,0.2)' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ ...iconBtn('#ef4444'), background:'rgba(239,68,68,0.1)', padding:'0.4rem 0.8rem', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.2)' }}>🗑 Delete</button>
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
                    {['Company','Industry','Year','Students Hired','Package (LPA)','Status','Actions'].map(h => (
                      <th key={h} style={{ padding:'1rem 1.2rem', textAlign:'left', color:'#64748b', fontWeight:600, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {placements.map((p, i) => (
                    <motion.tr key={p._id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                      style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(212,175,55,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'0.9rem 1.2rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                          <div style={{ width:30, height:30, borderRadius:'8px', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:'0.85rem' }}>{p.company[0]}</div>
                          <span style={{ color:'#f1f5f9', fontWeight:600 }}>{p.company}</span>
                        </div>
                      </td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#94a3b8' }}>{p.industry}</td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#94a3b8' }}>{p.year}</td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#d4af37', fontWeight:700 }}>{p.studentsHired}</td>
                      <td style={{ padding:'0.9rem 1.2rem', color:'#22c55e' }}>{p.minPackage}–{p.maxPackage}</td>
                      <td style={{ padding:'0.9rem 1.2rem' }}>
                        <span style={{ padding:'0.3rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700,
                          background: p.status==='Active' ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)',
                          color: p.status==='Active' ? '#22c55e' : '#64748b' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding:'0.9rem 1.2rem' }}>
                        <button onClick={() => openEdit(p)} style={iconBtn('#7c3aed')} title="Edit">✏️</button>
                        <button onClick={() => handleDelete(p._id)} style={iconBtn('#ef4444')} title="Delete">🗑</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && <PlacementModal placement={editTarget} onClose={() => setModalOpen(false)} onSaved={handleSaved} />}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminPlacements;
