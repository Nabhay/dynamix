import React, { useState, useEffect } from 'react';

function getProfileFromCookie() {
  const match = document.cookie.match(/(?:^|; )profile=([^;]*)/);
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      return null;
    }
  }
  return null;
}

function setProfileCookie(profile) {
  document.cookie = `profile=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=31536000`;
}

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    handle: '@alexrivera',
    email: 'alex.rivera@example.com',
    bio: 'Full Stack Developer passionate about building beautiful, performant web apps. Loves React, Node.js, and all things modern web. Always learning, always shipping.',
    payment: '',
    address: '',
  });
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const cookieProfile = getProfileFromCookie();
    if (cookieProfile) {
      setProfile(cookieProfile);
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = e => {
    e.preventDefault();
    setSaved(true);
    setEditing(false);
    setProfileCookie(profile);
  };

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
        padding: 0,
      }}
    >
      <h1 style={{
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 700,
        fontSize: '2.7rem',
        marginTop: '112px',
        marginBottom: '2.5rem',
        letterSpacing: '-1px',
        textAlign: 'left',
        width: '100%',
        maxWidth: 1100,
        paddingLeft: 24,
      }}>Profile</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 340px) 1fr',
          gap: '4.5rem',
          alignItems: 'flex-start',
          justifyContent: 'center',
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <aside
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 260,
            maxWidth: 340,
            width: '100%',
            marginRight: 0,
            marginBottom: 0,
            padding: '2.5rem 0 2.5rem 0',
            borderRight: '1.5px solid rgba(0,140,140,0.13)',
            gap: 18,
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
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem', fontFamily: 'Poppins, sans-serif', marginBottom: '0.3rem', textAlign: 'center' }}>{profile.name}</div>
          <div style={{ color: '#008080', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>{profile.handle}</div>
          <div style={{ color: '#b0b8c1', fontSize: '1.05rem', marginBottom: '1.2rem', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>{profile.email}</div>
          <div style={{ color: 'rgba(176, 184, 193, 0.95)', fontSize: '1.05rem', fontFamily: 'Inter, sans-serif', textAlign: 'center', marginBottom: 0, lineHeight: 1.5 }}>{profile.bio}</div>
        </aside>
        <div
          style={{
            maxHeight: 'min(600px, calc(100vh - 180px))',
            minHeight: 420,
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            padding: '32px 24px 32px 32px',
            borderRadius: 18,
            boxShadow: '0 2px 12px 0 rgba(0,140,140,0.04)',
            background: 'rgba(20, 30, 40, 0.55)',
            margin: '0 0 32px 0',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {!editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem 2rem', alignItems: 'start', maxWidth: 700, width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Name</label>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>{profile.name}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Handle</label>
                  <div style={{ color: '#008080', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>{profile.handle}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Email</label>
                  <div style={{ color: '#b0b8c1', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>{profile.email}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Bio</label>
                  <div style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>{profile.bio}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  <label style={{ color: '#b0b8c1', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, paddingLeft: 2 }}>Payment Method</label>
                  <div style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>{profile.payment || <span style={{ color: '#888' }}>Not set</span>}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  <label style={{ color: '#b0b8c1', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, paddingLeft: 2 }}>Address</label>
                  <div style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word' }}>{profile.address || <span style={{ color: '#888' }}>Not set</span>}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={{
                  background: 'linear-gradient(90deg, #008080 0%, #193b70 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  border: 'none',
                  borderRadius: 12,
                  padding: '1rem 2.5rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 2px 12px 0 rgba(0,140,140,0.10)',
                  transition: 'background 0.2s',
                  alignSelf: 'flex-end',
                  marginBottom: 0,
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2.5rem 2rem',
                alignItems: 'start',
                maxWidth: 700,
                width: '100%',
                background: 'none',
                boxShadow: 'none',
                padding: 0,
              }}
            >
              <h2 style={{ gridColumn: '1 / -1', color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '2rem', marginBottom: '0.5rem', marginTop: 0 }}>Edit Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Name"
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1.5px solid #008080',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Handle</label>
                <input
                  type="text"
                  name="handle"
                  value={profile.handle}
                  onChange={handleChange}
                  placeholder="Handle"
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1.5px solid #008080',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#008080',
                    fontSize: '1.1rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Email"
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1.5px solid #008080',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#b0b8c1',
                    fontSize: '1.1rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <label style={{ color: '#b0b8c1', fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Short bio"
                  rows={3}
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1.5px solid #008080',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <label style={{ color: '#b0b8c1', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, paddingLeft: 2 }}>Payment Method</label>
                <input
                  type="text"
                  name="payment"
                  value={profile.payment}
                  onChange={handleChange}
                  placeholder="Card number or payment method"
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1.5px solid #008080',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <label style={{ color: '#b0b8c1', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, paddingLeft: 2 }}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Address"
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1.5px solid #008080',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                />
              </div>
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
                  marginTop: '1.2rem',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 2px 12px 0 rgba(0,140,140,0.10)',
                  transition: 'background 0.2s',
                  gridColumn: '1 / -1',
                  alignSelf: 'flex-end',
                }}
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  background: 'none',
                  color: '#008080',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  border: 'none',
                  borderRadius: 12,
                  padding: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  marginTop: 0,
                  gridColumn: '1 / -1',
                  alignSelf: 'flex-end',
                }}
              >
                Cancel
              </button>
              {saved && <div style={{ color: '#00b386', marginTop: 12, fontWeight: 600, gridColumn: '1 / -1' }}>Profile saved!</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 