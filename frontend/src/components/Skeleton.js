/**
 * @file components/Skeleton.js
 * @description Loading skeleton placeholder components.
 *
 * Exports: SkeletonCourseCard — shimmer animation card matching CourseCard layout.
 * Used while course data is loading to improve perceived performance.
 */
import React from 'react';

/* ─── Keyframe injection (once per page via <style>) ──────────────────── */
const SHIMMER_CSS = `
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}`;

/* Gold shimmer — used by existing card skeletons */
const shimmer = {
  background: 'linear-gradient(90deg, rgba(212,175,55,0.05) 25%, rgba(212,175,55,0.1) 50%, rgba(212,175,55,0.05) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.6s infinite linear',
  borderRadius: '8px',
};

/* White/neutral shimmer — used by new generic skeletons */
const shimmerNew = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite linear',
  borderRadius: '8px',
};

/* ─── Existing exports (preserved) ────────────────────────────────────── */
export const SkeletonBox = ({ width = '100%', height = '1rem', style = {} }) => (
  <div style={{ ...shimmer, width, height, ...style }} />
);

export const SkeletonCourseCard = () => (
  <div style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <SkeletonBox height="10rem" style={{ borderRadius: '10px' }} />
    <SkeletonBox width="60%" height="0.85rem" />
    <SkeletonBox width="90%" height="0.75rem" />
    <SkeletonBox width="75%" height="0.75rem" />
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
      <SkeletonBox width="30%" height="0.75rem" />
      <SkeletonBox width="30%" height="0.75rem" />
    </div>
    <SkeletonBox height="2.5rem" style={{ marginTop: '0.5rem', borderRadius: '8px' }} />
  </div>
);

export const SkeletonFacultyCard = () => (
  <div style={{ background: '#14142a', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
    <SkeletonBox width="80px" height="80px" style={{ borderRadius: '50%' }} />
    <SkeletonBox width="60%" height="0.9rem" />
    <SkeletonBox width="45%" height="0.75rem" />
    <SkeletonBox width="70%" height="0.75rem" />
  </div>
);

/* ─── Updated SkeletonText (width prop + backward-compat lines prop) ─── */
export const SkeletonText = ({ width = '100%', lines }) => {
  if (lines) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBox key={i} width={i === lines - 1 ? '60%' : '100%'} height="0.8rem" />
        ))}
      </div>
    );
  }
  return <div style={{ ...shimmerNew, width, height: '14px', borderRadius: '4px' }} />;
};

/* ─── New exports ──────────────────────────────────────────────────────── */

/** Full-width 200px shimmer card for gallery / course card placeholders */
export const SkeletonCard = () => (
  <>
    <style>{SHIMMER_CSS}</style>
    <div style={{ ...shimmerNew, width: '100%', height: '200px', borderRadius: '12px' }} />
  </>
);

/** Shimmer circle avatar */
export const SkeletonAvatar = ({ size = 48 }) => (
  <>
    <style>{SHIMMER_CSS}</style>
    <div style={{ ...shimmerNew, width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />
  </>
);

/** 5 × 4 shimmer table */
export const SkeletonTable = () => (
  <>
    <style>{SHIMMER_CSS}</style>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {Array.from({ length: 4 }).map((_, col) => (
            <div key={col} style={{ ...shimmerNew, height: '2rem', borderRadius: '6px' }} />
          ))}
        </div>
      ))}
    </div>
  </>
);

/** Generic shimmer box — default export */
const Skeleton = ({ width = '100%', height = '1rem', borderRadius = '8px' }) => (
  <>
    <style>{SHIMMER_CSS}</style>
    <div style={{ ...shimmerNew, width, height, borderRadius }} />
  </>
);

export default Skeleton;
