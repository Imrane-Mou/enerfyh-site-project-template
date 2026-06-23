import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PROJECT_NAV = [
  { label: 'Le Projet', href: '#projet' },
  { label: 'Localisation', href: '#localisation' },
  { label: 'Retombées', href: '#retombees' },
  { label: 'Environnement', href: '#environnement' },
  { label: 'Sécurité', href: '#securite' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Actualités', href: '#actualites' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const solid = scrolled || !isHome;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: solid ? 'rgba(17,27,62,0.96)' : 'transparent',
      backdropFilter: solid ? 'blur(16px)' : 'none',
      borderBottom: solid ? '1px solid rgba(255,255,255,0.07)' : 'none',
      transition: 'all 0.3s ease', padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'white', borderRadius: 6, padding: '5px 12px' }}>
            <div style={{ color: '#0D1F4A', fontWeight: 800, fontSize: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>EnerFYH.</div>
            <div style={{ color: '#0D1F4A', fontSize: '0.48rem', opacity: 0.55, letterSpacing: '0.06em' }}>∧ kyntus group</div>
          </div>
          {!isHome && (
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              ← Tous les projets
            </Link>
          )}
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
          {!isHome && PROJECT_NAV.map(link => (
            <a key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, padding: '7px 12px', borderRadius: 6, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent'; }}>
              {link.label}
            </a>
          ))}
          <a href="#contact" style={{ background: 'white', color: '#0D1F4A', padding: '8px 20px', borderRadius: 6, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', marginLeft: 10, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F2EA'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
            Contact
          </a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-btn" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.4rem', padding: 8 }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: 'rgba(17,27,62,0.98)', padding: '16px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.95rem' }}>Tous les projets</Link>
          {!isHome && PROJECT_NAV.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.95rem' }}>{link.label}</a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '12px 0', fontSize: '0.95rem' }}>Contact</a>
        </div>
      )}

      <style>{`@media(max-width:900px){.desktop-nav{display:none!important}.mobile-btn{display:block!important}}`}</style>
    </nav>
  );
}
