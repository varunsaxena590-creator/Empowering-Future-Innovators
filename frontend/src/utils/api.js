/**
 * @file utils/api.js
 * @description Centralized Axios HTTP client for all API calls.
 *
 * Base URL: VITE_API_URL env var or http://localhost:5000/api
 * Auto-attaches JWT token from localStorage to every request.
 *
 * Exports 30+ API functions grouped by:
 *   - Auth: registerUser, loginUser, getMe, updateProfile, changePassword, forgotPassword, resetPassword
 *   - Courses: getCourses, getCourse, createCourse, updateCourse, deleteCourse
 *   - Students: applyAdmission, getStudents, updateStudentStatus, deleteStudent, bulkImportStudents
 *   - Contact: submitContact, getContacts, markContactRead, deleteContact
 *   - Gallery: getGallery, uploadGalleryImage, updateGalleryImage, deleteGalleryImage
 *   - Faculty: getFaculty, createFaculty, updateFaculty, deleteFaculty
 *   - Notices: getNotices, createNotice, updateNotice, deleteNotice
 *   - Results: getResults, getResultByRoll, createResult, deleteResult
 *   - Placements: getPlacements, getPlacementStats, createPlacement, deletePlacement
 *   - Alumni: getAlumni, createAlumni, deleteAlumni
 *   - Reviews: getReviews, submitReview, getPendingReviews, approveReview, deleteReview
 *   - Analytics: getAnalyticsSummary
 */
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

const MAX_RETRIES = 3;
const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  const method = error.config?.method?.toLowerCase();
  const status = error.response?.status;

  if (!RETRYABLE_METHODS.has(method)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return [502, 503, 504].includes(status);
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;

    if (!shouldRetry(error) || config.__retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;
    await wait(400 * config.__retryCount);
    return API(config);
  }
);

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const resendOTP = (data) => API.post('/auth/resend-otp', data);
export const getMe = () => API.get('/auth/me');
export const getCourses = () => API.get('/courses');
export const getSystemStatus = () => API.get('/status');
export const getCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const applyAdmission = (data) => API.post('/students/apply', data);
export const getMyApplications = () => API.get('/students/my-applications');
export const getStudents = () => API.get('/students');
export const updateStudentStatus = (id, status) => API.put(`/students/${id}/status`, { status });
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const submitContact = (data) => API.post('/contact', data);
export const getContacts = () => API.get('/contact');
export const markContactRead = (id) => API.put(`/contact/${id}/read`);
export const deleteContact = (id) => API.delete(`/contact/${id}`);
export const getGallery = (category) => API.get('/gallery', { params: category ? { category } : {} });
export const uploadGalleryImage = (data) => API.post('/gallery', data);
export const deleteGalleryImage = (id) => API.delete(`/gallery/${id}`);
export const updateGalleryImage = (id, data) => API.put(`/gallery/${id}`, data);
export const getFaculty = () => API.get('/faculty');
export const createFaculty = (data) => API.post('/faculty', data);
export const updateFaculty = (id, data) => API.put(`/faculty/${id}`, data);
export const deleteFaculty = (id) => API.delete(`/faculty/${id}`);

// Notices
export const getNotices = (params) => API.get('/notices', { params });
export const createNotice = (data) => API.post('/notices', data);
export const updateNotice = (id, data) => API.put(`/notices/${id}`, data);
export const deleteNotice = (id) => API.delete(`/notices/${id}`);

// Results
export const getResultByRoll = (roll) => API.get(`/results/roll/${roll}`);
export const getResults = () => API.get('/results');
export const createResult = (data) => API.post('/results', data);
export const updateResult = (id, data) => API.put(`/results/${id}`, data);
export const deleteResult = (id) => API.delete(`/results/${id}`);

// Placements
export const getPlacements = (params) => API.get('/placements', { params });
export const getPlacementStats = () => API.get('/placements/stats');
export const createPlacement = (data) => API.post('/placements', data);
export const deletePlacement = (id) => API.delete(`/placements/${id}`);

// Alumni
export const getAlumni = (params) => API.get('/alumni', { params });
export const createAlumni = (data) => API.post('/alumni', data);
export const deleteAlumni = (id) => API.delete(`/alumni/${id}`);

// Analytics
export const getAnalytics = () => API.get('/analytics/summary');

// Auth - Password Reset & Profile
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/auth/reset-password/${token}`, { password });
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Students - Bulk Import
export const bulkImportStudents = (csv) => API.post('/students/bulk-import', { csv });
export const getStudentsFiltered = (params) => API.get('/students', { params });

// Reviews
export const getReviews = (courseId) => API.get('/reviews', { params: courseId ? { course: courseId } : {} });
export const submitReview = (data) => API.post('/reviews', data);
export const getPendingReviews = () => API.get('/reviews/pending');
export const approveReview = (id) => API.put(`/reviews/${id}/approve`);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Attendance
export const getAttendance = (params) => API.get('/attendance', { params });
export const markAttendance = (data) => API.post('/attendance', data);
export const getAttendanceStats = (params) => API.get('/attendance/stats', { params });
export const deleteAttendance = (id) => API.delete(`/attendance/${id}`);

// AI Assistant
export const askAssistant = (payload) => API.post('/assistant/chat', payload);

export default API;
