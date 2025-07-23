import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';
import './Home.css';

function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    setTimeout(() => setFadeIn(true), 50);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        overflow: 'hidden',
        overscrollBehavior: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem',
          maxWidth: '1200px',
          width: '100%',
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 1.1s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div
          style={{
            flex: 1.3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minWidth: 0,
            padding: 0,
          }}
        >
          <h1
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: '5rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
              textAlign: 'left',
            }}
          >
            NeuroTrench
          </h1>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '1.1rem',
              color: '#b0b8c1',
              maxWidth: '500px',
              marginBottom: '3rem',
              lineHeight: 1.6,
              textAlign: 'left',
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor Lorem.
          </p>
          <Link
            to="/auth"
            style={{
              fontFamily: '"Inter", sans-serif',
              display: 'inline-block',
              textDecoration: 'none',
              color: '#ffffff',
              padding: '1rem 2rem',
              borderRadius: '8px',
              background: '#008080',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Sign Up
          </Link>
        </div>
        {!isMobile && (
          <div
            style={{
              flex: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            <ModelViewer
              url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
              width={550}
              height={550}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
