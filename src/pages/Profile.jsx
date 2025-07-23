import React from 'react';

export default function Profile() {
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7rem 0 4rem 0',
      }}
    >
      <div
        style={{
          background: 'rgba(20,40,60,0.55)',
          borderRadius: 32,
          boxShadow: '0 8px 32px 0 rgba(0,140,140,0.10)',
          padding: '3rem 2.5rem 2.5rem 2.5rem',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 420,
          width: '100%',
        }}
      >
        <img
          src="https://i.pravatar.cc/300?img=8"
          alt="Profile"
          style={{
            width: 110,
            height: 110,
            borderRadius: 24,
            border: '3px solid #008080',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 12px 0 rgba(0,140,140,0.10)',
            objectFit: 'cover',
          }}
        />
        <h1
          style={{
            color: '#fff',
            fontSize: '2.2rem',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            marginBottom: '0.3rem',
            textAlign: 'center',
          }}
        >
          Alex Rivera
        </h1>
        <div style={{ color: '#008080', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
          @alexrivera
        </div>
        <div style={{ color: '#b0b8c1', fontSize: '1.05rem', marginBottom: '1.2rem', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          alex.rivera@example.com
        </div>
        <p
          style={{
            color: 'rgba(176, 184, 193, 0.95)',
            fontSize: '1.1rem',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            marginBottom: 0,
            lineHeight: 1.6,
          }}
        >
          Full Stack Developer passionate about building beautiful, performant web apps. Loves React, Node.js, and all things modern web. Always learning, always shipping.
        </p>
      </div>
    </div>
  );
} 