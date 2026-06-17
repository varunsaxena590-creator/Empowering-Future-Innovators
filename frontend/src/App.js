/**
 * @file App.js
 * @description Main application component — defines all routes (27+).
 *
 * Structure:
 *   - ThemeProvider > LanguageProvider > AuthProvider (context wrappers)
 *   - Suspense with PageLoader fallback for lazy-loaded pages
 *   - AnimatedRoutes: Framer Motion page transitions
 *   - Layout: wraps public pages with Navbar + Footer + BackToTop + WhatsApp + PWA
 *
 * Route groups:
 *   - Public pages: /, /about, /courses, /faculty, /gallery, /contact, /admission, etc.
 *   - Auth pages: /login, /register, /forgot-password, /reset-password/:token
 *   - Protected: /portal (student dashboard)
 *   - Admin: /admin/* (12 admin routes, adminOnly)
 *   - 404 catch-all: *
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import WhatsAppButton from './components/WhatsAppButton';
import PWAInstallButton from './components/PWAInstallButton';
import LiveChat from './components/LiveChat';
import AIChatbot from './components/AIChatbot';
import ProtectedRoute from './components/ProtectedRoute';

// Code-split all pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Faculty = lazy(() => import('./pages/Faculty'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Admission = lazy(() => import('./pages/Admission'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const Events = lazy(() => import('./pages/Events'));
const Blog = lazy(() => import('./pages/Blog'));
const FAQ = lazy(() => import('./pages/FAQ'));
const StudentPortal = lazy(() => import('./pages/StudentPortal'));
const NoticeBoard = lazy(() => import('./pages/NoticeBoard'));
const Placement = lazy(() => import('./pages/Placement'));
const Result = lazy(() => import('./pages/Result'));
const Timetable = lazy(() => import('./pages/Timetable'));
const FeePayment = lazy(() => import('./pages/FeePayment'));
const Alumni = lazy(() => import('./pages/Alumni'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const AdminStudents = lazy(() => import('./admin/Students'));
const AdminCourses = lazy(() => import('./admin/AdminCourses'));
const AdminGallery = lazy(() => import('./admin/AdminGallery'));
const AdminFaculty = lazy(() => import('./admin/AdminFaculty'));
const AdminContacts = lazy(() => import('./admin/AdminContacts'));
const AdminAnalytics = lazy(() => import('./admin/Analytics'));
const AdminApplications = lazy(() => import('./admin/Applications'));
const AdminNotices = lazy(() => import('./admin/AdminNotices'));
const AdminResults = lazy(() => import('./admin/AdminResults'));
const AdminPlacements = lazy(() => import('./admin/AdminPlacements'));
const AdminAlumni = lazy(() => import('./admin/AdminAlumni'));
const AdminChat = lazy(() => import('./admin/AdminChat'));
const AdminAttendance = lazy(() => import('./admin/AdminAttendance'));

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const PageLoader = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(212,175,55,0.2)', borderTop: '3px solid #d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
      <p style={{ color: '#475569', fontSize: '0.8rem' }}>Loading...</p>
    </div>
  </div>
);

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <BackToTop />
    <WhatsAppButton />
    <PWAInstallButton />
  </>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Pages */}
        <Route path="/" element={<Layout><PageTransition><Home /></PageTransition></Layout>} />
        <Route path="/about" element={<Layout><PageTransition><About /></PageTransition></Layout>} />
        <Route path="/courses" element={<Layout><PageTransition><Courses /></PageTransition></Layout>} />
        <Route path="/courses/:id" element={<Layout><PageTransition><CourseDetail /></PageTransition></Layout>} />
        <Route path="/faculty" element={<Layout><PageTransition><Faculty /></PageTransition></Layout>} />
        <Route path="/gallery" element={<Layout><PageTransition><Gallery /></PageTransition></Layout>} />
        <Route path="/contact" element={<Layout><PageTransition><Contact /></PageTransition></Layout>} />
        <Route path="/admission" element={<Layout><PageTransition><Admission /></PageTransition></Layout>} />
        <Route path="/events" element={<Layout><PageTransition><Events /></PageTransition></Layout>} />
        <Route path="/blog" element={<Layout><PageTransition><Blog /></PageTransition></Layout>} />
        <Route path="/faq" element={<Layout><PageTransition><FAQ /></PageTransition></Layout>} />
        <Route path="/notices" element={<Layout><PageTransition><NoticeBoard /></PageTransition></Layout>} />
        <Route path="/placements" element={<Layout><PageTransition><Placement /></PageTransition></Layout>} />
        <Route path="/result" element={<Layout><PageTransition><Result /></PageTransition></Layout>} />
        <Route path="/timetable" element={<Layout><PageTransition><Timetable /></PageTransition></Layout>} />
        <Route path="/fees" element={<Layout><PageTransition><FeePayment /></PageTransition></Layout>} />
        <Route path="/alumni" element={<Layout><PageTransition><Alumni /></PageTransition></Layout>} />
        {/* Auth */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/verify-otp" element={<PageTransition><VerifyOTP /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password/:token" element={<PageTransition><ResetPassword /></PageTransition>} />
        {/* Protected */}
        <Route path="/portal" element={<ProtectedRoute><PageTransition><StudentPortal /></PageTransition></ProtectedRoute>} />
        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute adminOnly><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute adminOnly><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/gallery" element={<ProtectedRoute adminOnly><AdminGallery /></ProtectedRoute>} />
        <Route path="/admin/faculty" element={<ProtectedRoute adminOnly><AdminFaculty /></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute adminOnly><AdminContacts /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute adminOnly><AdminApplications /></ProtectedRoute>} />
        <Route path="/admin/notices" element={<ProtectedRoute adminOnly><AdminNotices /></ProtectedRoute>} />
        <Route path="/admin/results" element={<ProtectedRoute adminOnly><AdminResults /></ProtectedRoute>} />
        <Route path="/admin/placements" element={<ProtectedRoute adminOnly><AdminPlacements /></ProtectedRoute>} />
        <Route path="/admin/alumni" element={<ProtectedRoute adminOnly><AdminAlumni /></ProtectedRoute>} />
        <Route path="/admin/chat" element={<ProtectedRoute adminOnly><AdminChat /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute adminOnly><AdminAttendance /></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
            <Toaster position="top-right" toastOptions={{ style: { background: '#14142a', color: '#fff', border: '1px solid #d4af37' } }} />
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
            </Suspense>
            <LiveChat />
            <AIChatbot />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
