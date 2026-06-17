/**
 * @file admin/AdminResults.js
 * @description Admin CRUD for student examination results.
 *
 * Features:
 *   - Table: student, roll number, semester, SGPA, status
 *   - Add/Edit modal: student details, subjects, marks, grades
 *   - Delete with confirmation
 *
 * Data: Result API endpoints (CRUD)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getResults, createResult, updateResult, deleteResult } from '../utils/api';

const mockResults = [
  { _id:'1', rollNumber:'ZI2025CS001', studentName:'Aarav Sharma', semester:1, course:'B.Tech CSE', cgpa:8.6, status:'Pass', academicYear:'2025-26' },
  { _id:'2', rollNumber:'ZI2025CS001', studentName:'Aarav Sharma', semester:2, course:'B.Tech CSE', cgpa:8.9, status:'Pass', academicYear:'2025-26' },
  { _id:'3', rollNumber:'ZI2025ME002', studentName:'Priya Patel', semester:1, course:'B.Tech ME', cgpa:7.8, status:'Pass', academicYear:'2025-26' },
  { _id:'4', rollNumber:'ZI2025EC003', studentName:'Rohit Singh', semester:3, course:'B.Tech ECE', cgpa:6.2, status:'Pass', academicYear:'2025-26' },
  { _id:'5', rollNumber:'ZI2025CS004', studentName:'Anjali Verma', semester:2, course:'B.Tech CSE', cgpa:9.2, status:'Pass', academicYear:'2025-26' },
  { _id:'6', rollNumber:'ZI2025CS005', studentName:'Karan Mehta', semester:1, course:'BCA', cgpa:5.1, status:'Pass', academicYear:'2025-26' },
];

const courses = ['All Courses','B.Tech CSE','B.Tech ME','B.Tech ECE','BCA','MBA'];
const emptySubject = { name:'', code:'', maxMarks:'', obtainedMarks:'' };
const emptyForm = { rollNumber:'', studentName:'', academicYear:'2025-26', semester:'1', course:'B.Tech CSE', cgpa:'', status:'Pass', subjects:[{ ...emptySubject }] };

const inp = { width:'100%', padding:'0.65rem 1rem', background:'#0a0a14', border:'1px solid rgba(212,175,55,0.22)', borderRadius:'10px', color:'#f1f5f9', fontSize:'0.85rem', outline:'none', boxSizing:'border-box' };
const glass = { background:'rgba(20,20,42,0.8)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px' };
const goldBtn = { background:'linear-gradient(135deg,#d4af37,#b8960c)', border:'none', color:'#050509', fontWeight:700, padding:'0.6rem 1.4rem', borderRadius:'10px', cursor:'pointer', fontSize:'0.85rem' };
const iconBtn = (color) => ({ background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color, padding:'0.2rem 0.4rem' });

const ResultModal = ({ result, onClose, onSaved }) => {
  const isEdit = !!result?._id;
  const [form, setForm] = useState(isEdit ? { ...result, subjects: result.subjects || [{ ...emptySubject }] } : { ...emptyForm });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSubj = (i, k, v) => setForm(f => {
    const s = [...f.subjects]; s[i] = { ...s[i], [k]: v }; return { ...f, subjects: s };
  });
  const addSubject = () => setForm(f => ({ ...f, subjects: [...f.subjects, { ...emptySubject }] }));
  const removeSubject = (i) => setForm(f => ({ ...f, subjects: f.subjects.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isEdit ? `Result for ${form.studentName} updated!` : `Result for ${form.studentName} added!`);
    onSaved({ ...form, _id: result?._id || String(Date.now()) });
    onClose();
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', padding:'1rem' }} onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.93, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.93, y:20 }} transition={{ duration:0.22 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'#14142a', border:'1px solid rgba(212,175,55,0.25)', borderRadius:'20px', padding:'2rem', width:'100%', maxWidth:620, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'Orbitron,sans-serif', color:'#f1f5f9', fontSize:'1rem', fontWeight:700 }}>{isEdit ? '✏️ Edit Result' : '📤 Upload Result'}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            {[['Roll Number','rollNumber'],['Student Name','studentName'],['Academic Year','academicYear']].map(([label, key]) => (
              <div key={key} style={key==='studentName' ? { gridColumn:'span 1' } : {}}>
                <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>{label}</label>
                <input style={inp} value={form[key]} onChange={e => set(key, e.target.value)} required />
              </div>
            ))}
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Semester</label>
              <select style={inp} value={form.semester} onChange={e => set('semester', e.target.value)}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Course</label>
              <select style={inp} value={form.course} onChange={e => set('course', e.target.value)}>
                {courses.filter(c => c !== 'All Courses').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>CGPA (0–10)</label>
              <input style={inp} type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={e => set('cgpa', e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.3rem' }}>Status</label>
              <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.4rem' }}>
                {['Pass','Fail'].map(s => (
                  <button key={s} type="button" onClick={() => set('status', s)}
                    style={{ flex:1, padding:'0.55rem', borderRadius:'8px', border:'1px solid', cursor:'pointer', fontSize:'0.82rem', fontWeight:600,
                      borderColor: form.status===s ? (s==='Pass' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                      background: form.status===s ? (s==='Pass' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)') : 'transparent',
                      color: form.status===s ? (s==='Pass' ? '#22c55e' : '#ef4444') : '#64748b' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop:'1rem', marginBottom:'0.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
              <span style={{ color:'#d4af37', fontWeight:700, fontSize:'0.88rem' }}>📚 Subjects</span>
              <button type="button" onClick={addSubject} style={{ ...goldBtn, padding:'0.35rem 0.8rem', fontSize:'0.78rem' }}>+ Add Subject</button>
            </div>
            {form.subjects.map((subj, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr auto', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'center' }}>
                <input style={inp} placeholder="Subject Name" value={subj.name} onChange={e => setSubj(i,'name',e.target.value)} />
                <input style={inp} placeholder="Code" value={subj.code} onChange={e => setSubj(i,'code',e.target.value)} />
                <input style={inp} placeholder="Max" type="number" value={subj.maxMarks} onChange={e => setSubj(i,'maxMarks',e.target.value)} />
                <input style={inp} placeholder="Obtained" type="number" value={subj.obtainedMarks} onChange={e => setSubj(i,'obtainedMarks',e.target.value)} />
                <button type="button" onClick={() => removeSubject(i)} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'1rem' }}>🗑</button>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1.5rem' }}>
            <button type="button" onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', padding:'0.6rem 1.4rem', borderRadius:'10px', cursor:'pointer' }}>Cancel</button>
            <button type="submit" style={goldBtn}>{isEdit ? 'Save Changes' : 'Upload Result'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getResults()
      .then(r => setResults(r.data.data || r.data || []))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = results.filter(r => {
    const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) || r.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchSem = semFilter === '' || String(r.semester) === semFilter;
    const matchCourse = courseFilter === 'All Courses' || r.course === courseFilter;
    return matchSearch && matchSem && matchCourse;
  });

  const passRate = ((results.filter(r => r.status==='Pass').length / results.length) * 100).toFixed(1);
  const avgCgpa = (results.reduce((acc, r) => acc + r.cgpa, 0) / results.length).toFixed(2);

  const handleSaved = async (saved) => {
    try {
      if (saved._id && results.some(r => r._id === saved._id)) {
        await updateResult(saved._id, saved);
        toast.success('Result updated');
      } else {
        await createResult(saved);
        toast.success('Result created');
      }
      load();
    } catch {
      toast.error('Failed to save result');
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await deleteResult(id);
      toast.success('Result deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };
  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (r) => { setEditTarget(r); setModalOpen(true); };

  const statCards = [
    { label:'Total Results', value:results.length, icon:'📊', color:'#7c3aed' },
    { label:'Pass Rate', value:`${passRate}%`, icon:'✅', color:'#22c55e' },
    { label:'Average CGPA', value:avgCgpa, icon:'🎯', color:'#d4af37' },
    { label:'This Semester', value:results.filter(r=>r.semester===1).length, icon:'📅', color:'#3b82f6' },
  ];

  return (
    <AdminLayout title="Student Results">
      <div style={{ padding:'1.5rem', minHeight:'100vh', background:'#050509' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <h1 style={{ fontFamily:'Orbitron,sans-serif', color:'#f1f5f9', fontSize:'1.4rem', fontWeight:800, margin:0 }}>Student Results</h1>
            <p style={{ color:'#64748b', fontSize:'0.82rem', margin:'0.3rem 0 0' }}>Manage and publish academic results</p>
          </div>
          <button onClick={openAdd} style={goldBtn}>📤 Upload Result</button>
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
          <input style={{ ...inp, maxWidth:260 }} placeholder="🔍 Search by name or roll no..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={{ ...inp, maxWidth:160 }} value={semFilter} onChange={e => setSemFilter(e.target.value)}>
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select style={{ ...inp, maxWidth:180 }} value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span style={{ color:'#64748b', fontSize:'0.8rem', marginLeft:'auto' }}>{filtered.length} results</span>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ ...glass, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  {['Roll No','Student Name','Semester','Course','CGPA','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'1rem 1.2rem', textAlign:'left', color:'#64748b', fontWeight:600, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr key={r._id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                    style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(212,175,55,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'0.9rem 1.2rem', color:'#d4af37', fontFamily:'monospace', fontSize:'0.8rem' }}>{r.rollNumber}</td>
                    <td style={{ padding:'0.9rem 1.2rem', color:'#f1f5f9', fontWeight:600 }}>{r.studentName}</td>
                    <td style={{ padding:'0.9rem 1.2rem', color:'#94a3b8' }}>Sem {r.semester}</td>
                    <td style={{ padding:'0.9rem 1.2rem', color:'#94a3b8' }}>{r.course}</td>
                    <td style={{ padding:'0.9rem 1.2rem' }}>
                      <span style={{ color: r.cgpa >= 8 ? '#22c55e' : r.cgpa >= 6 ? '#d4af37' : '#ef4444', fontWeight:700 }}>{r.cgpa.toFixed(1)}</span>
                    </td>
                    <td style={{ padding:'0.9rem 1.2rem' }}>
                      <span style={{ padding:'0.3rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700,
                        background: r.status==='Pass' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: r.status==='Pass' ? '#22c55e' : '#ef4444', border:`1px solid ${r.status==='Pass'?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}` }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding:'0.9rem 1.2rem' }}>
                      <button onClick={() => openEdit(r)} style={iconBtn('#7c3aed')} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(r._id)} style={iconBtn('#ef4444')} title="Delete">🗑</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>No results found</div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {modalOpen && <ResultModal result={editTarget} onClose={() => setModalOpen(false)} onSaved={handleSaved} />}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminResults;
