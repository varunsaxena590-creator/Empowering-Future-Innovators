/**
 * @file pages/CourseDetail.js
 * @description Individual course detail page (dynamic route /course/:id).
 *
 * Sections:
 *   - Course header: title, department, duration, fees, seats
 *   - Tabs: Overview | Curriculum | Eligibility | Faculty
 *   - Reviews section: star rating, submit review
 *   - Sidebar: quick info + action buttons
 *
 * Data: getCourseById(id) API, getReviews()
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { getCourse } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const mockCourse = {
  _id: '1', title: 'B.Tech Computer Science', department: 'Technology',
  description: 'A comprehensive 4-year engineering program covering software development, algorithms, data structures, AI, machine learning, and cutting-edge technology. Designed in collaboration with industry leaders like Google, Microsoft, and TCS.',
  duration: '4 Years', seats: 120, fees: 85000, eligibility: '12th with PCM, 60%+',
  averageRating: 4.7, numReviews: 156,
  syllabus: [
    { semester: 1, subjects: ['Mathematics I', 'Physics', 'C Programming', 'Digital Logic', 'English Communication'] },
    { semester: 2, subjects: ['Mathematics II', 'Data Structures', 'OOP with Java', 'Database Systems', 'Computer Networks'] },
    { semester: 3, subjects: ['Algorithms', 'OS Concepts', 'Web Technologies', 'Software Engineering', 'Discrete Math'] },
    { semester: 4, subjects: ['AI Fundamentals', 'Machine Learning', 'Computer Graphics', 'Cloud Computing', 'Project Work'] },
    { semester: 5, subjects: ['Compiler Design', 'Information Security', 'Mobile Development', 'Big Data Analytics', 'Elective I'] },
    { semester: 6, subjects: ['Distributed Systems', 'IoT & Embedded', 'Deep Learning', 'DevOps & CI/CD', 'Elective II'] },
    { semester: 7, subjects: ['Capstone Project I', 'Research Methods', 'Blockchain Technology', 'AR/VR Concepts', 'Industry Internship'] },
    { semester: 8, subjects: ['Capstone Project II', 'Startup Ideation', 'Tech Ethics & Law', 'Global IT Trends', 'Final Viva'] },
  ],
  highlights: ['AICTE Approved', '100% Placement Assistance', 'Industry Mentorship', 'Research Opportunities', 'Modern Labs', 'Startup Incubator Access'],
};

const mockReviews = [
  { name: 'Aarav S.', rating: 5, comment: 'Best decision of my life! Excellent faculty and amazing placement support.', year: '2024' },
  { name: 'Priya M.', rating: 4, comment: 'Great curriculum, very industry-focused. Internship support was exceptional.', year: '2025' },
  { name: 'Rohit K.', rating: 5, comment: 'Got placed at Google through campus. The coding culture here is outstanding!', year: '2023' },
];

const mockFaculty = [
  { name: 'Dr. Anil Sharma', designation: 'Professor & HOD', dept: 'CSE' },
  { name: 'Prof. Sunita Rao', designation: 'Associate Professor', dept: 'AI & ML' },
  { name: 'Dr. Vikram Nair', designation: 'Assistant Professor', dept: 'Networks' },
  { name: 'Prof. Kavitha R.', designation: 'Senior Lecturer', dept: 'Web Tech' },
];

const mockRelated = [
  { _id: '2', title: 'M.Tech AI & ML', department: 'Technology', duration: '2 Years', fees: 95000 },
  { _id: '3', title: 'B.Tech Data Science', department: 'Technology', duration: '4 Years', fees: 80000 },
  { _id: '4', title: 'MCA', department: 'Technology', duration: '3 Years', fees: 60000 },
];

const learnPoints = [
  'Full-Stack Web Development', 'Machine Learning & AI', 'Cloud Architecture (AWS/GCP)',
  'Data Structures & Algorithms', 'Database Design & SQL', 'Cybersecurity Fundamentals',
  'DevOps & Agile Practices', 'System Design & Scalability',
];

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} style={{ color: '#d4af37', fontSize: '1rem' }}>⭐</span>
      ))}
      {partial >= 0.5 && <span style={{ color: '#d4af37', fontSize: '1rem', opacity: 0.6 }}>⭐</span>}
    </span>
  );
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSem, setOpenSem] = useState(null);
  const { isDark } = useTheme();
  const c = getColors(isDark);

  useEffect(() => {
  let active = true;
  getCourse(id)
    .then((res) => { if (active) setCourse(res.data.data || res.data); })
    .catch(() => { if (active) setCourse(mockCourse); })
    .finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, border: '3px solid rgba(212,175,55,0.2)', borderTop: '3px solid #d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: c.textDim, fontSize: '0.9rem' }}>Loading course...</p>
        </div>
      </div>
    );
  }

  const cr = course || mockCourse;

  return (
    <div style={{ background: c.bgPrimary, minHeight: '100vh', color: c.text }}>

      {/* Hero */}
      <section style={{ paddingTop: '5rem', background: `linear-gradient(135deg, ${c.bgMain} 0%, ${c.bgCard} 50%, ${c.bgPrimary} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.1) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem 3rem', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: c.textMuted, marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: c.textMuted, textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link to="/courses" style={{ color: c.textMuted, textDecoration: 'none' }}>Courses</Link>
            <span>›</span>
            <span style={{ color: '#d4af37' }}>{cr.title}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span style={{ display: 'inline-block', padding: '0.3rem 1rem', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em' }}>
              {cr.department}
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, background: 'linear-gradient(135deg, #fff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem', lineHeight: 1.2 }}>
              {cr.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <StarRating rating={cr.averageRating || 4.7} />
              <span style={{ color: '#d4af37', fontWeight: 700 }}>{cr.averageRating || 4.7}</span>
              <span style={{ color: c.textDim, fontSize: '0.85rem' }}>({cr.numReviews || 156} reviews)</span>
              <span style={{ color: c.textDim, fontSize: '0.85rem' }}>• {cr.seats || 120} enrolled this year</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Info Bar */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ background: c.bgCardAlpha, borderBottom: `1px solid ${c.borderGold}`, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {[
            { icon: '⏱', label: 'Duration', val: cr.duration || '4 Years' },
            { icon: '💺', label: 'Seats', val: `${cr.seats || 120} seats` },
            { icon: '💰', label: 'Fee/year', val: `₹${(cr.fees || 85000).toLocaleString()}` },
            { icon: '📋', label: 'Eligibility', val: cr.eligibility || '12th PCM, 60%+' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.2rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '999px', flex: '0 0 auto' }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ color: c.textMuted, fontSize: '0.78rem' }}>{item.label}:</span>
              <span style={{ color: c.text, fontWeight: 600, fontSize: '0.85rem' }}>{item.val}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

        {/* Left Column */}
        <div style={{ flex: '1 1 0%', minWidth: 0 }}>

          {/* About */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: c.bgCardAlpha, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#d4af37', marginBottom: '1rem' }}>About This Course</h2>
            <p style={{ color: c.textMuted, lineHeight: 1.8, fontSize: '0.95rem' }}>{cr.description}</p>
          </motion.div>

          {/* What You'll Learn */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: c.bgCardAlpha, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#d4af37', marginBottom: '1.25rem' }}>What You'll Learn</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {learnPoints.map((pt) => (
                <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#10b981', fontWeight: 700, marginTop: '2px', flexShrink: 0 }}>✓</span>
                  <span style={{ color: c.textMuted, fontSize: '0.88rem', lineHeight: 1.5 }}>{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Syllabus Accordion */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: c.bgCardAlpha, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#d4af37', marginBottom: '1.25rem' }}>Syllabus</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(cr.syllabus || mockCourse.syllabus || []).map((sem) => (
                  <div key={sem.semester} style={{ border: `1px solid ${c.borderGold}`, borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenSem(openSem === sem.semester ? null : sem.semester)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.25rem', background: openSem === sem.semester ? 'rgba(212,175,55,0.12)' : c.bgCardAlpha, border: 'none', cursor: 'pointer', color: c.text, fontWeight: 600, fontSize: '0.9rem', textAlign: 'left' }}
                  >
                    <span>Semester {sem.semester}</span>
                    <span style={{ color: '#d4af37', fontSize: '1.1rem', transition: 'transform 0.3s', transform: openSem === sem.semester ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
                  </button>
                  <AnimatePresence>
                    {openSem === sem.semester && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0.75rem 1.25rem 1rem', background: 'rgba(10,10,20,0.5)' }}>
                          {sem.subjects.map((subj, i) => (
                            <div key={subj} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0', borderBottom: i < sem.subjects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                              <span style={{ color: '#7c3aed', fontSize: '0.75rem' }}>◆</span>
                              <span style={{ color: c.textMuted, fontSize: '0.875rem' }}>{subj}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Faculty */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: c.bgCardAlpha, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#d4af37', marginBottom: '1.25rem' }}>Faculty</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {mockFaculty.map((f) => (
                <div key={f.name} style={{ background: 'rgba(10,10,20,0.6)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #d4af37)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                    {f.name.charAt(0)}
                  </div>
                  <p style={{ color: c.text, fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.25rem' }}>{f.name}</p>
                  <p style={{ color: c.textMuted, fontSize: '0.78rem' }}>{f.designation}</p>
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.15rem 0.6rem', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: '0.72rem', borderRadius: '999px' }}>{f.dept}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Student Reviews */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: c.bgCardAlpha, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#d4af37', marginBottom: '1.25rem' }}>Student Reviews</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockReviews.map((rev) => (
                  <div key={rev.name} style={{ background: 'rgba(10,10,20,0.5)', border: `1px solid ${c.border}`, borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ color: c.text, fontWeight: 600, fontSize: '0.9rem' }}>{rev.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <StarRating rating={rev.rating} />
                        <span style={{ color: c.textDim, fontSize: '0.75rem' }}>· Class of {rev.year}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: c.textMuted, fontSize: '0.875rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (Sticky) */}
        <div style={{ flex: '0 0 340px', maxWidth: '100%' }}>
          <div style={{ position: 'sticky', top: '5rem' }}>

            {/* Enrollment Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ background: c.bgCardAlpha, backdropFilter: 'blur(20px)', border: `1px solid ${c.borderGold}`, borderRadius: '20px', padding: '2rem', marginBottom: '1.25rem', boxShadow: '0 8px 40px rgba(212,175,55,0.08)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: c.textMuted, fontSize: '0.82rem', marginBottom: '0.25rem' }}>Annual Fee</p>
                <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#d4af37' }}>₹{(cr.fees || 85000).toLocaleString()}</p>
                <p style={{ color: c.textDim, fontSize: '0.78rem' }}>per year · EMI available</p>
              </div>
              <Link to="/admission" style={{ display: 'block', width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 800, borderRadius: '12px', textDecoration: 'none', textAlign: 'center', fontSize: '1rem', letterSpacing: '0.03em', marginBottom: '0.75rem', transition: 'opacity 0.2s' }}>
                Apply Now →
              </Link>
              <button style={{ width: '100%', padding: '0.9rem', background: 'transparent', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', fontWeight: 600, borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem' }}>
                📄 Download Brochure
              </button>
            </motion.div>

            {/* Course Highlights */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ background: c.bgCardAlpha, backdropFilter: 'blur(12px)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#a78bfa', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>✨ Course Highlights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(cr.highlights || mockCourse.highlights).map((h) => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                    <span style={{ color: c.textMuted, fontSize: '0.875rem' }}>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Admission Dates */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ background: c.bgCardAlpha, backdropFilter: 'blur(12px)', border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ color: '#d4af37', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>📅 Admission Dates</h3>
              {[
                { label: 'Application Deadline', date: 'April 30, 2025' },
                { label: 'Counseling Begins', date: 'May 15, 2025' },
                { label: 'Session Start', date: 'July 1, 2025' },
              ].map((d) => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: c.textMuted, fontSize: '0.82rem' }}>{d.label}</span>
                  <span style={{ color: c.text, fontWeight: 600, fontSize: '0.82rem' }}>{d.date}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: c.text, marginBottom: '1.5rem' }}>
          Related <span style={{ color: '#d4af37' }}>Courses</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {mockRelated.map((rel) => (
            <motion.div key={rel._id} whileHover={{ scale: 1.02 }} style={{ background: c.bgCardAlpha, border: `1px solid ${c.borderGold}`, borderRadius: '14px', padding: '1.5rem', cursor: 'pointer' }}>
              <span style={{ display: 'inline-block', padding: '0.2rem 0.7rem', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: '0.72rem', borderRadius: '999px', marginBottom: '0.75rem' }}>{rel.department}</span>
              <h3 style={{ color: c.text, fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{rel.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: c.textDim, marginBottom: '1rem' }}>
                <span>⏱ {rel.duration}</span>
                <span style={{ color: '#d4af37', fontWeight: 700 }}>₹{rel.fees?.toLocaleString()}/yr</span>
              </div>
              <Link to={`/courses/${rel._id}`} style={{ display: 'block', padding: '0.5rem', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontSize: '0.82rem', fontWeight: 600 }}>
                View Course →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default CourseDetail;
