import React from 'react';
import MagicBento from '../components/MagicBento';

export default function About() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: `
          radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
          radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
          radial-gradient(circle at 45% 60%, rgba(0, 140, 140, 0.4) 0%, transparent 35%),
          radial-gradient(circle at 70% 80%, rgba(25, 59, 112, 0.5) 0%, transparent 30%),
          linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        scrollBehavior: 'smooth',
      }}
    >
      <h1
        style={{
          color: '#fff',
          fontSize: '3.5rem',
          fontWeight: 700,
          margin: '7rem 0 2.5rem 0',
          fontFamily: 'Poppins, sans-serif',
          letterSpacing: '-1px',
    textAlign: 'center',
          textShadow: '0 2px 24px #193b70',
        }}
      >
        About NeuroTrench
      </h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
        <MagicBento
          glowColor="0, 140, 140" // teal
          enableSpotlight={true}
          enableStars={true}
          enableBorderGlow={true}
          spotlightRadius={320}
          particleCount={14}
          enableTilt={false}
          disableAnimations={false}
          clickEffect={true}
          enableMagnetism={true}
        />
      </div>
    </div>
  );
}
