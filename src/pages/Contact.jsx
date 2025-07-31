import React, { useState, useEffect } from 'react';
import ChromaGrid from '../components/ChromaGrid';
import chromaGridDemo from '../components/ChromaGrid.jsx'; 

const demoContacts = [
  {
    image: "./src/assets/manvik.png",
    title: "Manvik Kumar",
    subtitle: "3D Designer",
    handle: "@sus",
    borderColor: "#4F46E5",
    url: "https://www.artstation.com/manvik_kumar13",
  },
  {
    image: "./src/assets/nabhay.png",
    title: "Nabhay Khanna",
    subtitle: "Website Developer",
    handle: "@tinyuncle",
    borderColor: "#10B981",
     url: "https://linkedin.com/in/dwarf-king",
  },
  {
    image: "./src/assets/ayan.png",
    title: "Ayan Alam",
    subtitle: "Designer",
    handle: "@ayanalam",
    borderColor: "#F59E0B",
    url: "",
  },
  {
    image: "./src/assets/rayhaan.png",
    title: "Rayhaan Rajkumar",
    subtitle: "Motion Designer",
    handle: "@momo",
    borderColor: "#EF4444",
    url: "",
  },
  {
    image: "./src/assets/siddhant.png",
    title: "Siddhant Dubey",
    subtitle: "Website Developer",
    handle: "@slave",
    borderColor: "#8B5CF6",
    url: "https://github.com/",
  },
];

export default function Contact() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const CustomChromaGrid = () => (
    <ChromaGrid
      items={demoContacts}
      onCardClick={contact => setSelectedContact(contact)}
    />
  );

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
        padding: '7rem 0 4rem 0',
      }}
    >

      {!selectedContact ? (
        <div 
          style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '3.5rem',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}
        >
          <div className="chroma-grid" style={{ width: '100%' }}>
            {demoContacts.map((c, i) => (
              <article
                key={i}
                className="chroma-card"
                style={{
                  '--card-border': c.borderColor || 'transparent',
                  cursor: 'pointer',
                  border: `1.5px solid ${c.borderColor}`,
                  background: 'transparent',
                  margin: '0.5rem',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  animationDelay: `${i * 0.1}s`,
                  opacity: fadeIn ? 1 : 0,
                  transform: fadeIn ? 'scale(1)' : 'scale(0.9)',
                  animation: fadeIn ? `fadeInUp 0.6s ease ${i * 0.1}s both` : 'none'
                }}
                onClick={() => setSelectedContact(c)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="chroma-img-wrapper">
                  <img src={c.image} alt={c.title} loading="lazy" />
                </div>
                <footer className="chroma-info">
                  <h3 className="name">{c.title}</h3>
                  {c.handle && <span className="handle">{c.handle}</span>}
                  <p className="role">{c.subtitle}</p>
                  {c.location && <span className="location">{c.location}</span>}
                </footer>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <form
          style={{
            maxWidth: 480,
            width: '100%',
            margin: '0 auto',
            background: 'rgba(20,40,60,0.55)',
            borderRadius: 24,
            boxShadow: '0 8px 32px 0 rgba(0,140,140,0.10)',
            padding: '2.5rem 2rem 2rem 2rem',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            animation: fadeIn ? 'slideInUp 0.6s ease' : 'none'
          }}
          onSubmit={e => { e.preventDefault(); alert('Message sent!'); }}
        >
          <button
            type="button"
            onClick={() => setSelectedContact(null)}
            style={{
              alignSelf: 'flex-start',
              marginBottom: '1rem',
              background: 'none',
              border: 'none',
              color: '#008080',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.3s ease, transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00a0a0';
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#008080';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ← Back to Team
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.5rem' }}>
            <img src={selectedContact.image} alt={selectedContact.title} style={{ width: 56, height: 56, borderRadius: 16, border: `2px solid ${selectedContact.borderColor}` }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'Poppins, sans-serif' }}>{selectedContact.title}</div>
              <div style={{ color: '#b0b8c1', fontSize: '1rem', fontFamily: 'Inter, sans-serif' }}>{selectedContact.subtitle}</div>
              {selectedContact.handle && <div style={{ color: '#008080', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>{selectedContact.handle}</div>}
            </div>
          </div>
          <h2 style={{
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '2rem',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}>Contact {selectedContact.title.split(' ')[0]}</h2>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            style={{
              padding: '1rem',
              borderRadius: 12,
              border: '1.5px solid #008080',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              marginBottom: 0,
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00a0a0';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 160, 160, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#008080';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            style={{
              padding: '1rem',
              borderRadius: 12,
              border: '1.5px solid #008080',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              marginBottom: 0,
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00a0a0';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 160, 160, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#008080';
              e.target.style.boxShadow = 'none';
            }}
          />
          <textarea
            name="message"
            placeholder={`Your message to ${selectedContact.title.split(' ')[0]}`}
            required
            rows={5}
            style={{
              padding: '1rem',
              borderRadius: 12,
              border: '1.5px solid #008080',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              resize: 'vertical',
              marginBottom: 0,
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00a0a0';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 160, 160, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#008080';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #008080 0%, #193b70 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: 12,
              padding: '1rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 2px 12px 0 rgba(0,140,140,0.10)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px 0 rgba(0,140,140,0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(0,140,140,0.10)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
            }}
          >
            Send Message
          </button>
        </form>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
