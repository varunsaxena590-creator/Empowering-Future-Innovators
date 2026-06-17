/**
 * @file utils/theme.js
 * @description Theme-aware color and style utilities.
 * Returns colors that adapt to the current theme ('dark' or 'light').
 */

export const colors = {
  dark: {
    bgPrimary: '#050509',
    bgMain: '#0a0a14',
    bgSection: '#0f0f1e',
    bgCard: '#14142a',
    bgCardAlpha: 'rgba(20,20,42,0.8)',
    bgInput: '#0a0a14',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    textDim: '#475569',
    border: 'rgba(255,255,255,0.07)',
    borderGold: 'rgba(212,175,55,0.22)',
    navBg: 'rgba(5,5,9,0.88)',
    cardShadow: '0 8px 32px rgba(0,0,0,0.35)',
    overlay: 'linear-gradient(105deg, rgba(5,5,9,0.95) 0%, rgba(5,5,9,0.6) 50%, transparent 100%)',
    heroBg: 'linear-gradient(135deg, #050509 0%, #0a0a14 50%, #14142a 100%)',
  },
  light: {
    bgPrimary: '#ffffff',
    bgMain: '#f8f9fb',
    bgSection: '#f1f3f7',
    bgCard: '#ffffff',
    bgCardAlpha: 'rgba(255,255,255,0.9)',
    bgInput: '#ffffff',
    text: '#1e293b',
    textMuted: '#475569',
    textDim: '#94a3b8',
    border: 'rgba(0,0,0,0.08)',
    borderGold: 'rgba(180,140,20,0.25)',
    navBg: 'rgba(255,255,255,0.92)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.08)',
    overlay: 'linear-gradient(105deg, rgba(248,249,251,0.95) 0%, rgba(248,249,251,0.7) 50%, rgba(248,249,251,0.3) 100%)',
    heroBg: 'linear-gradient(135deg, #f8f9fb 0%, #f1f3f7 50%, #e8eaef 100%)',
  },
  // Common colors (same in both themes)
  gold: '#d4af37',
  goldLight: '#f0c040',
  purple: '#7c3aed',
  gradient: 'linear-gradient(135deg, #d4af37, #7c3aed)',
  gradientGold: 'linear-gradient(135deg, #d4af37, #f0c040)',
};

export const getColors = (isDark) => isDark ? colors.dark : colors.light;
