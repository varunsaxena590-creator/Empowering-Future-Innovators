/**
 * @file pages/Courses.js
 * @description Browse all courses/programs page.
 *
 * Features:
 *   - Search bar: real-time text search
 *   - Department filter: dynamic buttons from API data
 *   - Course grid: CourseCard components
 *   - Course comparison: select up to 3 courses, compare in modal
 *
 * Data: getCourses() API, filtered by department & search query
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import CourseCard from '../components/CourseCard';
import { getCourses } from '../utils/api';
import { SkeletonCourseCard } from '../components/Skeleton';
import CourseComparison, { useComparison } from '../components/CourseComparison';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const depts = ['All', 'Technology', 'Security', 'Engineering', 'Business', 'Science'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');
  const { selectedCourses: compareList, toggleCourse: toggleCompare, clearAll } = useComparison();
  const { isDark } = useTheme();
  const c = getColors(isDark);

  useEffect(() => {
  let active = true;
  getCourses().then((res) => { if (active) setCourses(res?.data?.data || []); }).catch(() => {}).finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
  }, []);

  const availableDepts = useMemo(() => {
    const found = new Set(courses.map((c) => c.department));
    return ['All', ...depts.slice(1).filter((d) => found.has(d)), ...Array.from(found).filter((d) => !depts.includes(d))];
  }, [courses]);

  const filtered = useMemo(() => courses.filter((c) => {
    const matchDept = activeDept === 'All' || c.department === activeDept;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.department.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  }), [courses, activeDept, search]);

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <SectionTitle subtitle="Academic Programs" title="Our Programs" description="Industry-designed degrees built for the future of technology and innovation." />

          {/* Search */}
          <motion.div style={{ maxWidth: 500, margin: '0 auto 1.5rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <input type="text" placeholder="🔍  Search programs or departments..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.85rem 1.25rem', background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '12px', color: c.text, fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </motion.div>

          {/* Dept Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
            {availableDepts.map((d) => (
              <button key={d} onClick={() => setActiveDept(d)}
                style={{ padding: '0.45rem 1.1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: activeDept === d ? 'none' : `1px solid ${c.borderGold}`, background: activeDept === d ? 'linear-gradient(135deg, #d4af37, #f0c040)' : 'transparent', color: activeDept === d ? c.bgPrimary : c.textMuted }}>
                {d}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCourseCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((course, i) => (
                <div key={course._id} style={{ position: 'relative' }}>
                  <CourseCard course={course} index={i} />
                  <button onClick={() => toggleCompare(course)}
                    style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', padding: '0.25rem 0.6rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px', border: compareList.find((cc) => cc._id === course._id) ? '1px solid #d4af37' : `1px solid ${c.borderGold}`, background: compareList.find((cc) => cc._id === course._id) ? 'rgba(212,175,55,0.2)' : 'rgba(5,5,9,0.7)', color: '#d4af37', cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 2 }}>
                    {compareList.find((cc) => cc._id === course._id) ? '✓ Added' : '+ Compare'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: c.textDim }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</p>
              <p>{search || activeDept !== 'All' ? 'No programs match your search.' : 'No programs available yet.'}</p>
            </div>
          )}
        </div>
      </section>

      <CourseComparison selectedCourses={compareList} onRemove={toggleCompare} onClear={clearAll} />
    </main>
  );
};

export default Courses;
