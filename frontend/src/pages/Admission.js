/**
 * @file pages/Admission.js
 * @description Real-world style admission application form.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SectionTitle from '../components/SectionTitle';
import { applyAdmission, getCourses } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../utils/theme';

const steps = [
  'Personal Details',
  'Family and Contact',
  'Academic History',
  'Program and Preferences',
  'Documents and Declaration',
];

const DEADLINE = new Date('2026-06-30T23:59:59');

const createInitialForm = () => ({
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  category: 'general',
  dateOfBirth: '',
  nationality: 'Indian',
  bloodGroup: '',
  aadhaarNumber: '',

  email: '',
  phone: '',
  alternatePhone: '',
  currentAddress: '',
  permanentAddress: '',
  sameAsCurrentAddress: true,
  city: '',
  state: '',
  country: 'India',
  pincode: '',

  fatherName: '',
  motherName: '',
  guardianName: '',
  parentPhone: '',
  parentEmail: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyRelation: '',

  academic10Board: '',
  academic10School: '',
  academic10Year: '',
  academic10Percentage: '',
  academic12Board: '',
  academic12School: '',
  academic12Year: '',
  academic12Percentage: '',
  entranceExamName: '',
  entranceExamScore: '',
  entranceExamRank: '',

  course: '',
  desiredBatch: '2026-27',
  hostelRequired: false,
  transportRequired: false,
  statementOfPurpose: '',

  documents: {
    marksheet10: false,
    marksheet12: false,
    idProof: false,
    transferCertificate: false,
    passportPhoto: false,
    characterCertificate: false,
    categoryCertificate: false,
  },
  termsAccepted: false,
});

const useCountdown = (target) => {
  const calc = () => {
    const diff = target - new Date();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  };

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const timer = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
};

const toNumberOrUndefined = (value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const Admission = () => {
  const countdown = useCountdown(DEADLINE);
  const { isDark } = useTheme();
  const c = getColors(isDark);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [form, setForm] = useState(createInitialForm);

  const inputStyle = useMemo(() => ({
    width: '100%',
    padding: '0.85rem 1rem',
    background: c.bgInput,
    border: `1px solid ${c.borderGold}`,
    borderRadius: '10px',
    color: c.text,
    fontSize: '0.9rem',
    boxSizing: 'border-box',
  }), [c]);

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res?.data?.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (form.sameAsCurrentAddress) {
      setForm((prev) => ({ ...prev, permanentAddress: prev.currentAddress }));
    }
  }, [form.currentAddress, form.sameAsCurrentAddress]);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setBool = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.checked }));
  const setDoc = (field) => (e) => setForm((prev) => ({ ...prev, documents: { ...prev.documents, [field]: e.target.checked } }));

  const validateForm = () => {
    const required = [
      ['First Name', form.firstName],
      ['Last Name', form.lastName],
      ['Gender', form.gender],
      ['Email', form.email],
      ['Phone', form.phone],
      ['Date of Birth', form.dateOfBirth],
      ['Current Address', form.currentAddress],
      ['City', form.city],
      ['State', form.state],
      ['Pincode', form.pincode],
      ['Father Name', form.fatherName],
      ['Mother Name', form.motherName],
      ['Parent Phone', form.parentPhone],
      ['Emergency Contact Name', form.emergencyContactName],
      ['Emergency Contact Phone', form.emergencyContactPhone],
      ['10th Board', form.academic10Board],
      ['10th School', form.academic10School],
      ['10th Percentage', form.academic10Percentage],
      ['12th Board', form.academic12Board],
      ['12th School', form.academic12School],
      ['12th Percentage', form.academic12Percentage],
      ['Program', form.course],
    ];

    const missing = required.filter(([, value]) => !String(value || '').trim()).map(([name]) => name);
    if (missing.length) {
      toast.error(`Please fill required fields: ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? '...' : ''}`);
      return false;
    }

    if (!form.termsAccepted) {
      toast.error('Please accept terms and declaration before submitting');
      return false;
    }

    const dob = new Date(form.dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      toast.error('Please enter a valid date of birth');
      return false;
    }

    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 14) {
      toast.error('Minimum age for admission is 14 years');
      return false;
    }

    const percentage = Number(form.academic12Percentage || form.percentage || 0);
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      toast.error('12th percentage must be between 0 and 100');
      return false;
    }

    if (!/^\d{10,15}$/.test((form.phone || '').replace(/\D/g, ''))) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    if (!/^\d{6}$/.test((form.pincode || '').trim())) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        category: form.category,
        dateOfBirth: form.dateOfBirth,
        nationality: form.nationality.trim(),
        bloodGroup: form.bloodGroup.trim(),
        aadhaarNumber: form.aadhaarNumber.trim(),

        email: form.email.trim(),
        phone: form.phone.trim(),
        alternatePhone: form.alternatePhone.trim(),
        currentAddress: form.currentAddress.trim(),
        permanentAddress: (form.sameAsCurrentAddress ? form.currentAddress : form.permanentAddress).trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        pincode: form.pincode.trim(),

        fatherName: form.fatherName.trim(),
        motherName: form.motherName.trim(),
        guardianName: form.guardianName.trim(),
        parentPhone: form.parentPhone.trim(),
        parentEmail: form.parentEmail.trim(),
        emergencyContactName: form.emergencyContactName.trim(),
        emergencyContactPhone: form.emergencyContactPhone.trim(),
        emergencyRelation: form.emergencyRelation.trim(),

        previousSchool: form.academic12School.trim(),
        percentage: toNumberOrUndefined(form.academic12Percentage),
        academic10: {
          board: form.academic10Board.trim(),
          schoolName: form.academic10School.trim(),
          passingYear: toNumberOrUndefined(form.academic10Year),
          percentage: toNumberOrUndefined(form.academic10Percentage),
        },
        academic12: {
          board: form.academic12Board.trim(),
          schoolName: form.academic12School.trim(),
          passingYear: toNumberOrUndefined(form.academic12Year),
          percentage: toNumberOrUndefined(form.academic12Percentage),
        },
        entranceExam: {
          examName: form.entranceExamName.trim(),
          score: toNumberOrUndefined(form.entranceExamScore),
          rank: toNumberOrUndefined(form.entranceExamRank),
        },

        course: form.course,
        desiredBatch: form.desiredBatch,
        hostelRequired: form.hostelRequired,
        transportRequired: form.transportRequired,
        statementOfPurpose: form.statementOfPurpose.trim(),
        documents: form.documents,
        termsAccepted: form.termsAccepted,
      };

      const res = await applyAdmission(payload);
      setApplicationId(res?.data?.data?.applicationId || '');
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setSubmitted(false);
    setApplicationId('');
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: c.bgMain, paddingTop: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: 560 }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#d4af37', fontSize: '1.5rem', marginBottom: '0.8rem' }}>Application Submitted Successfully</h2>
          <p style={{ color: c.textMuted, lineHeight: 1.8 }}>
            Thank you for applying to Zorvex Institute. Our admissions team will review your application and contact you within 3 to 5 business days.
          </p>
          {applicationId && (
            <p style={{ marginTop: '1rem', color: '#f1f5f9', fontWeight: 700 }}>
              Application ID: <span style={{ color: '#d4af37' }}>{applicationId}</span>
            </p>
          )}
          <button
            onClick={resetForm}
            style={{ marginTop: '1.5rem', padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main style={{ paddingTop: '5rem', background: c.bgMain, minHeight: '100vh' }}>
      {!countdown.expired && (
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(124,58,237,0.08))', borderBottom: `1px solid ${c.borderGold}`, padding: '1.25rem 1.5rem', textAlign: 'center' }}
        >
          <p style={{ color: c.textMuted, fontSize: '0.82rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            Admissions 2026-27 close on June 30, 2026. Apply before the deadline.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {[['Days', countdown.days], ['Hours', countdown.hours], ['Minutes', countdown.mins], ['Seconds', countdown.secs]].map(([label, value]) => (
              <div key={label} style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${c.borderGold}`, borderRadius: '10px', padding: '0.5rem 1rem', minWidth: 64, textAlign: 'center' }}>
                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', color: '#d4af37', fontWeight: 700, lineHeight: 1 }}>{String(value).padStart(2, '0')}</p>
                <p style={{ color: c.textDim, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <SectionTitle subtitle="Join Zorvex" title="Admission Application" description="Complete the full form with accurate details. Fields marked with * are required." />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {steps.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.7rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0c040)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#050509' }}>{i + 1}</div>
                  <span style={{ fontSize: '0.7rem', color: c.textMuted, whiteSpace: 'nowrap' }}>{step}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 56, height: 1, background: 'rgba(212,175,55,0.2)', margin: '0 0.5rem', marginBottom: '1.2rem' }} />}
              </div>
            ))}
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: c.bgCard, border: `1px solid ${c.borderGold}`, borderRadius: '16px', padding: '2rem' }}
          >
            <h3 style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>1. Personal Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <div><label style={labelStyle(c)}>First Name *</label><input value={form.firstName} onChange={setField('firstName')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Middle Name</label><input value={form.middleName} onChange={setField('middleName')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Last Name *</label><input value={form.lastName} onChange={setField('lastName')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Gender *</label>
                <select value={form.gender} onChange={setField('gender')} required style={inputStyle}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div><label style={labelStyle(c)}>Category *</label>
                <select value={form.category} onChange={setField('category')} style={inputStyle}>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div><label style={labelStyle(c)}>Date of Birth *</label><input type="date" value={form.dateOfBirth} onChange={setField('dateOfBirth')} required style={{ ...inputStyle, colorScheme: 'dark' }} /></div>
              <div><label style={labelStyle(c)}>Nationality</label><input value={form.nationality} onChange={setField('nationality')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Blood Group</label><input value={form.bloodGroup} onChange={setField('bloodGroup')} placeholder="O+, A-, etc" style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Aadhaar Number</label><input value={form.aadhaarNumber} onChange={setField('aadhaarNumber')} placeholder="12-digit (optional)" style={inputStyle} /></div>
            </div>

            <h3 style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>2. Family and Contact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <div><label style={labelStyle(c)}>Email *</label><input type="email" value={form.email} onChange={setField('email')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Phone *</label><input type="tel" value={form.phone} onChange={setField('phone')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Alternate Phone</label><input type="tel" value={form.alternatePhone} onChange={setField('alternatePhone')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Father Name *</label><input value={form.fatherName} onChange={setField('fatherName')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Mother Name *</label><input value={form.motherName} onChange={setField('motherName')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Guardian Name</label><input value={form.guardianName} onChange={setField('guardianName')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Parent Phone *</label><input type="tel" value={form.parentPhone} onChange={setField('parentPhone')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Parent Email</label><input type="email" value={form.parentEmail} onChange={setField('parentEmail')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Emergency Contact Name *</label><input value={form.emergencyContactName} onChange={setField('emergencyContactName')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Emergency Contact Phone *</label><input type="tel" value={form.emergencyContactPhone} onChange={setField('emergencyContactPhone')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Emergency Relation</label><input value={form.emergencyRelation} onChange={setField('emergencyRelation')} placeholder="Parent / Guardian / Relative" style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle(c)}>Current Address *</label><textarea rows="3" value={form.currentAddress} onChange={setField('currentAddress')} required style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input id="sameAddress" type="checkbox" checked={form.sameAsCurrentAddress} onChange={setBool('sameAsCurrentAddress')} />
                <label htmlFor="sameAddress" style={{ color: c.textMuted, fontSize: '0.82rem' }}>Permanent address same as current address</label>
              </div>
              {!form.sameAsCurrentAddress && (
                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle(c)}>Permanent Address *</label><textarea rows="3" value={form.permanentAddress} onChange={setField('permanentAddress')} required style={{ ...inputStyle, resize: 'vertical' }} /></div>
              )}
              <div><label style={labelStyle(c)}>City *</label><input value={form.city} onChange={setField('city')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>State *</label><input value={form.state} onChange={setField('state')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Country</label><input value={form.country} onChange={setField('country')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Pincode *</label><input value={form.pincode} onChange={setField('pincode')} required style={inputStyle} /></div>
            </div>

            <h3 style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>3. Academic History</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <div><label style={labelStyle(c)}>10th Board *</label><input value={form.academic10Board} onChange={setField('academic10Board')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>10th School *</label><input value={form.academic10School} onChange={setField('academic10School')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>10th Passing Year</label><input type="number" value={form.academic10Year} onChange={setField('academic10Year')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>10th Percentage *</label><input type="number" step="0.01" value={form.academic10Percentage} onChange={setField('academic10Percentage')} required style={inputStyle} /></div>

              <div><label style={labelStyle(c)}>12th Board *</label><input value={form.academic12Board} onChange={setField('academic12Board')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>12th School *</label><input value={form.academic12School} onChange={setField('academic12School')} required style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>12th Passing Year</label><input type="number" value={form.academic12Year} onChange={setField('academic12Year')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>12th Percentage *</label><input type="number" step="0.01" value={form.academic12Percentage} onChange={setField('academic12Percentage')} required style={inputStyle} /></div>

              <div><label style={labelStyle(c)}>Entrance Exam Name</label><input value={form.entranceExamName} onChange={setField('entranceExamName')} placeholder="JEE / CUET / NEET etc" style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Entrance Score</label><input type="number" value={form.entranceExamScore} onChange={setField('entranceExamScore')} style={inputStyle} /></div>
              <div><label style={labelStyle(c)}>Entrance Rank</label><input type="number" value={form.entranceExamRank} onChange={setField('entranceExamRank')} style={inputStyle} /></div>
            </div>

            <h3 style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>4. Program and Preferences</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <div><label style={labelStyle(c)}>Select Program *</label>
                <select value={form.course} onChange={setField('course')} required style={inputStyle}>
                  <option value="">Choose a program...</option>
                  {courses.map((cr) => <option key={cr._id} value={cr._id}>{cr.title}</option>)}
                </select>
              </div>
              <div><label style={labelStyle(c)}>Desired Batch</label><input value={form.desiredBatch} onChange={setField('desiredBatch')} style={inputStyle} /></div>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.hostelRequired} onChange={setBool('hostelRequired')} /> Hostel Required</label>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.transportRequired} onChange={setBool('transportRequired')} /> Transport Required</label>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle(c)}>Statement of Purpose</label>
                <textarea rows="4" value={form.statementOfPurpose} onChange={setField('statementOfPurpose')} placeholder="Tell us why you want to join this program..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            <h3 style={{ color: '#d4af37', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>5. Documents and Declaration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.documents.marksheet10} onChange={setDoc('marksheet10')} /> 10th Marksheet Available</label>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.documents.marksheet12} onChange={setDoc('marksheet12')} /> 12th Marksheet Available</label>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.documents.idProof} onChange={setDoc('idProof')} /> Govt ID Proof Available</label>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.documents.transferCertificate} onChange={setDoc('transferCertificate')} /> Transfer Certificate Available</label>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.documents.passportPhoto} onChange={setDoc('passportPhoto')} /> Passport Photo Available</label>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.documents.characterCertificate} onChange={setDoc('characterCertificate')} /> Character Certificate Available</label>
              <label style={checkboxLabel(c)}><input type="checkbox" checked={form.documents.categoryCertificate} onChange={setDoc('categoryCertificate')} /> Category Certificate (if applicable)</label>
            </div>

            <div style={{ borderTop: `1px solid ${c.borderGold}`, paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: c.textMuted, fontSize: '0.82rem', lineHeight: 1.6 }}>
                <input type="checkbox" checked={form.termsAccepted} onChange={setBool('termsAccepted')} style={{ marginTop: '0.22rem' }} />
                I declare that the information provided is true and complete. I agree to the admission terms and privacy policy.
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: loading ? '#334155' : 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#050509', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}
              >
                {loading ? 'Submitting Application...' : 'Submit Admission Application'}
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
};

const labelStyle = (c) => ({
  display: 'block',
  color: c.textDim,
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '0.35rem',
});

const checkboxLabel = (c) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: c.textMuted,
  fontSize: '0.82rem',
  border: `1px solid ${c.borderGold}`,
  borderRadius: '10px',
  padding: '0.6rem 0.75rem',
  background: c.bgInput,
});

export default Admission;
