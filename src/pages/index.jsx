import React from 'react';
import { Link } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';
import './Home.css';

function HomePage() {
  return (
        <div style={{ 
      minHeight: '100vh', 
      padding: '8rem 4rem 4rem', 
      background: `
        radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
        radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
        radial-gradient(circle at 45% 60%, rgba(0, 140, 140, 0.4) 0%, transparent 35%),
        radial-gradient(circle at 70% 80%, rgba(25, 59, 112, 0.5) 0%, transparent 30%),
        linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
      `,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      overscrollBehavior: 'none'
    }}>
      <div style={{ flex: 1.3, padding: '0 4rem' }}>
        <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '5rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', lineHeight: 1.1 }}>Lorem Ipsum Dolar</h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '1.1rem', color: '#b0b8c1', maxWidth: '500px', marginBottom: '3rem', lineHeight: 1.6 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor Lorem.
        </p>
        <Link to="/auth" style={{ fontFamily: '"Inter", sans-serif', display: 'inline-block', textDecoration: 'none', color: '#ffffff', padding: '1rem 2rem', borderRadius: '8px', background: '#008080', fontWeight: 600, fontSize: '1rem' }}>Sign Up</Link>
      </div>
      <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ModelViewer
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
          width={550}
          height={550}
        />
      </div>
    </div>
  );
}

export default HomePage;
