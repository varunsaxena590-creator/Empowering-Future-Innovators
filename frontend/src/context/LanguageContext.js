/**
 * @file context/LanguageContext.js
 * @description Multi-language (i18n) context — English & Hindi.
 *
 * Provides:
 *   - lang       — Current language code ('en' or 'hi')
 *   - toggleLang — Switch between English and Hindi
 *   - t(key)     — Translation function: returns translated string for given key
 *
 * Translations cover: Navbar, Hero, Sections, Footer, Portal, Forms, etc.
 * Persists to localStorage key 'zorvex-lang'. Default: English.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navbar
    home: 'Home', about: 'About', courses: 'Courses', faculty: 'Faculty',
    events: 'Events', blog: 'Blog', gallery: 'Gallery', contact: 'Contact',
    signIn: 'Sign In', applyNow: 'Apply Now', logout: 'Logout', dashboard: 'Dashboard',
    // Hero
    heroTitle: 'Shape Your Future at Zorvex Institute',
    heroSubtitle: 'World-class education in AI, Data Science, and Technology. Join 5,000+ innovators.',
    applyNowBtn: 'Apply Now — Free',
    exploreCourses: 'Explore Courses',
    // Common
    loading: 'Loading...', search: 'Search', all: 'All',
    // Sections
    ourCourses: 'Our Courses', meetFaculty: 'Meet Our Faculty',
    upcomingEvents: 'Upcoming Events', contactUs: 'Contact Us',
    // Footer
    quickLinks: 'Quick Links', programs: 'Programs', followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved.',
    // Portal
    myPortal: 'My Portal', myApplications: 'My Applications', myResults: 'My Results',
    myTimetable: 'My Timetable', feePayment: 'Fee Payment', notices: 'Notices',
    // Misc
    readMore: 'Read More', viewAll: 'View All', submit: 'Submit', cancel: 'Cancel',
    name: 'Name', email: 'Email', phone: 'Phone', message: 'Message',
    send: 'Send Message', thankYou: 'Thank You!',
  },
  hi: {
    // Navbar
    home: 'होम', about: 'हमारे बारे में', courses: 'कोर्सेज़', faculty: 'फैकल्टी',
    events: 'इवेंट्स', blog: 'ब्लॉग', gallery: 'गैलरी', contact: 'संपर्क करें',
    signIn: 'साइन इन', applyNow: 'अभी अप्लाई करें', logout: 'लॉगआउट', dashboard: 'डैशबोर्ड',
    // Hero
    heroTitle: 'ज़ोर्वेक्स इंस्टीट्यूट में अपना भविष्य बनाएं',
    heroSubtitle: 'AI, डेटा साइंस और टेक्नोलॉजी में विश्व स्तरीय शिक्षा। 5,000+ इनोवेटर्स से जुड़ें।',
    applyNowBtn: 'अभी अप्लाई करें — मुफ़्त',
    exploreCourses: 'कोर्सेज़ देखें',
    // Common
    loading: 'लोड हो रहा है...', search: 'खोजें', all: 'सभी',
    // Sections
    ourCourses: 'हमारे कोर्सेज़', meetFaculty: 'हमारी फैकल्टी से मिलें',
    upcomingEvents: 'आगामी इवेंट्स', contactUs: 'संपर्क करें',
    // Footer
    quickLinks: 'क्विक लिंक्स', programs: 'प्रोग्राम्स', followUs: 'फ़ॉलो करें',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    // Portal
    myPortal: 'मेरा पोर्टल', myApplications: 'मेरी एप्लीकेशन', myResults: 'मेरे परिणाम',
    myTimetable: 'मेरा टाइमटेबल', feePayment: 'फीस भुगतान', notices: 'सूचनाएं',
    // Misc
    readMore: 'और पढ़ें', viewAll: 'सभी देखें', submit: 'जमा करें', cancel: 'रद्द करें',
    name: 'नाम', email: 'ईमेल', phone: 'फ़ोन', message: 'संदेश',
    send: 'संदेश भेजें', thankYou: 'धन्यवाद!',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('zorvex-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('zorvex-lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en');
  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isHindi: lang === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
