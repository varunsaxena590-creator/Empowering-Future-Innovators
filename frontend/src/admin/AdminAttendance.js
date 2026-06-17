import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getCourses, getStudents, getAttendance, markAttendance, getAttendanceStats, deleteAttendance } from '../utils/api';

const gold = '#d4af37';
const glass = { background: 'rgba(20,20,42,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' };
const goldBtn = { background: 'linear-gradient(135deg,#d4af37,#b8960c)', border: 'none', color: '#050509', fontWeight: 700, padding: '0.6rem 1.4rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' };
const inp = { width: '100%', padding: '0.65rem 1rem', background: '#0a0a14', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' };

const AdminAttendance = () => {
  const [tab, setTab] = useState('mark'); // mark | history | stats
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsCourse, setStatsCourse] = useState('');
  const [histCourse, setHistCourse] = useState('');
  const [histFrom, setHistFrom] = useState('');
  const [histTo, setHistTo] = useState('');

  useEffect(() => {
    getCourses().then(r => setCourses(r.data.data || [])).catch(() => {});
    getStudents().then(r => setStudents((r.data.data || []).filter(s => s.status === 'approved'))).catch(() => {});
  }, []);

  // When course selected for marking, populate student list
  useEffect(() => {
    if (!selectedCourse) { setRecords([]); return; }
    const courseStudents = students.filter(s => s.course?._id === selectedCourse || s.course === selectedCourse);
    setRecords(courseStudents.map(s => ({ student: s._id, name: `${s.firstName} ${s.lastName}`, status: 'present' })));
  }, [selectedCourse, students]);

  const handleStatusToggle = (idx, status) => {
    setRecords(prev => prev.map((r, i) => i === idx ? { ...r, status } : r));
  };

  const handleMarkAll = (status) => {
    setRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) return toast.error('Please select a course');
    if (!selectedDate) return toast.error('Please select a date');
    if (records.length === 0) return toast.error('No students found for this course');
    setLoading(true);
    try {
      await markAttendance({
        date: selectedDate,
        course: selectedCourse,
        records: records.map(r => ({ student: r.student, status: r.status })),
      });
      toast.success('Attendance marked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally { setLoading(false); }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (histCourse) params.course = histCourse;
      if (histFrom) params.from = histFrom;
      if (histTo) params.to = histTo;
      const res = await getAttendance(params);
      setHistory(res.data.data || []);
    } catch { toast.error('Failed to fetch history'); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    if (!statsCourse) return toast.error('Select a course for stats');
    setLoading(true);
    try {
      const res = await getAttendanceStats({ course: statsCourse });
      setStats(res.data.data);
    } catch { toast.error('Failed to fetch stats'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await deleteAttendance(id);
      setHistory(prev => prev.filter(h => h._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  useEffect(() => {
    if (tab === 'history') fetchHistory();
  }, [tab]);

  const statusColors = { present: '#22c55e', absent: '#ef4444', late: '#f59e0b' };
  const statusIcon = { present: '✅', absent: '❌', late: '⏰' };

  const tabStyle = (t) => ({
    padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Sora, sans-serif',
    background: tab === t ? 'linear-gradient(135deg, #d4af37, #f0c040)' : 'rgba(255,255,255,0.04)',
    color: tab === t ? '#050509' : '#94a3b8', transition: 'all 0.2s',
  });

  return (
    <AdminLayout title="Attendance" subtitle="Mark & track daily student attendance">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('mark')} style={tabStyle('mark')}>📋 Mark Attendance</button>
        <button onClick={() => setTab('history')} style={tabStyle('history')}>📅 History</button>
        <button onClick={() => setTab('stats')} style={tabStyle('stats')}>📊 Statistics</button>
      </div>

      {/* ── MARK TAB ── */}
      {tab === 'mark' && (
        <div style={{ ...glass, padding: '1.5rem' }}>
          {/* Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Course *</label>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">Select Course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Date *</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={inp} />
            </div>
          </div>

          {records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>👨‍🎓</span>
              <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '0.75rem' }}>
                {selectedCourse ? 'No approved students found for this course' : 'Select a course to mark attendance'}
              </p>
            </div>
          ) : (
            <>
              {/* Bulk Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>Mark All:</span>
                <button onClick={() => handleMarkAll('present')} style={{ ...goldBtn, padding: '0.4rem 1rem', fontSize: '0.78rem', background: '#22c55e', color: '#fff' }}>✅ Present</button>
                <button onClick={() => handleMarkAll('absent')} style={{ ...goldBtn, padding: '0.4rem 1rem', fontSize: '0.78rem', background: '#ef4444', color: '#fff' }}>❌ Absent</button>
                <button onClick={() => handleMarkAll('late')} style={{ ...goldBtn, padding: '0.4rem 1rem', fontSize: '0.78rem', background: '#f59e0b', color: '#fff' }}>⏰ Late</button>
                <span style={{ color: '#475569', fontSize: '0.78rem', marginLeft: 'auto' }}>
                  {records.length} students · {records.filter(r => r.status === 'present').length} P / {records.filter(r => r.status === 'absent').length} A / {records.filter(r => r.status === 'late').length} L
                </span>
              </div>

              {/* Student List */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 200px', padding: '0.75rem 1rem', background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>#</span>
                  <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Student</span>
                  <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Status</span>
                </div>
                {records.map((r, i) => (
                  <div key={r.student} style={{
                    display: 'grid', gridTemplateColumns: '50px 1fr 200px', padding: '0.65rem 1rem', alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  }}>
                    <span style={{ color: '#475569', fontSize: '0.82rem' }}>{i + 1}</span>
                    <span style={{ color: '#f1f5f9', fontSize: '0.88rem', fontWeight: 600 }}>{r.name}</span>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      {['present', 'absent', 'late'].map(st => (
                        <button key={st} onClick={() => handleStatusToggle(i, st)}
                          style={{
                            padding: '0.35rem 0.7rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.15s',
                            background: r.status === st ? statusColors[st] : 'rgba(255,255,255,0.04)',
                            color: r.status === st ? '#fff' : '#64748b',
                            boxShadow: r.status === st ? `0 2px 8px ${statusColors[st]}40` : 'none',
                          }}>
                          {statusIcon[st]} {st.charAt(0).toUpperCase() + st.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ ...goldBtn, padding: '0.75rem 2.5rem', fontSize: '0.9rem', opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Saving...' : '💾 Save Attendance'}
                </motion.button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === 'history' && (
        <div style={{ ...glass, padding: '1.5rem' }}>
          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Course</label>
              <select value={histCourse} onChange={e => setHistCourse(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">All Courses</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>From</label>
              <input type="date" value={histFrom} onChange={e => setHistFrom(e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>To</label>
              <input type="date" value={histTo} onChange={e => setHistTo(e.target.value)} style={inp} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <motion.button onClick={fetchHistory} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ ...goldBtn, width: '100%' }}>
                🔍 Search
              </motion.button>
            </div>
          </div>

          {loading ? (
            <p style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>Loading...</p>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>📅</span>
              <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '0.75rem' }}>No attendance records found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map(h => {
                const p = h.records.filter(r => r.status === 'present').length;
                const a = h.records.filter(r => r.status === 'absent').length;
                const l = h.records.filter(r => r.status === 'late').length;
                const total = h.records.length;
                const pct = total > 0 ? Math.round(p / total * 100) : 0;
                return (
                  <motion.div key={h._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h4 style={{ color: '#f1f5f9', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px' }}>
                        {h.course?.title || 'Unknown'} <span style={{ color: '#475569', fontWeight: 400 }}>— {h.course?.department}</span>
                      </h4>
                      <p style={{ color: gold, fontSize: '0.78rem', margin: 0 }}>
                        📅 {new Date(h.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700 }}>✅ {p}</span>
                      <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}>❌ {a}</span>
                      <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>⏰ {l}</span>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f1f5f9' }}>{pct}%</span>
                      </div>
                      <button onClick={() => handleDelete(h._id)} title="Delete"
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', padding: '0.3rem' }}>🗑</button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── STATS TAB ── */}
      {tab === 'stats' && (
        <div style={{ ...glass, padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Course *</label>
              <select value={statsCourse} onChange={e => setStatsCourse(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">Select Course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <motion.button onClick={fetchStats} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={goldBtn}>📊 Get Stats</motion.button>
          </div>

          {loading ? (
            <p style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>Loading...</p>
          ) : !stats ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>📊</span>
              <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '0.75rem' }}>Select a course and click "Get Stats"</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 140, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <p style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{stats.totalDays}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '4px 0 0' }}>Total Days</p>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <p style={{ color: gold, fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{stats.students?.length || 0}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '4px 0 0' }}>Students</p>
                </div>
              </div>

              {/* Student-wise */}
              {stats.students && stats.students.length > 0 ? (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 70px 70px 70px 90px', padding: '0.75rem 1rem', background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['#', 'Student', 'Present', 'Absent', 'Late', 'Attendance'].map(h => (
                      <span key={h} style={{ color: gold, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{h}</span>
                    ))}
                  </div>
                  {stats.students.sort((a, b) => b.percentage - a.percentage).map((s, i) => (
                    <div key={s.studentId} style={{
                      display: 'grid', gridTemplateColumns: '50px 1fr 70px 70px 70px 90px', padding: '0.65rem 1rem', alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    }}>
                      <span style={{ color: '#475569', fontSize: '0.82rem' }}>{i + 1}</span>
                      <span style={{ color: '#f1f5f9', fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</span>
                      <span style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 700 }}>{s.present}</span>
                      <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 700 }}>{s.absent}</span>
                      <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>{s.late}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 3, transition: 'width 0.5s',
                            width: `${s.percentage}%`,
                            background: s.percentage >= 75 ? '#22c55e' : s.percentage >= 50 ? '#f59e0b' : '#ef4444',
                          }} />
                        </div>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 800, minWidth: 36, textAlign: 'right',
                          color: s.percentage >= 75 ? '#22c55e' : s.percentage >= 50 ? '#f59e0b' : '#ef4444',
                        }}>{s.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center' }}>No student data available</p>
              )}
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAttendance;
