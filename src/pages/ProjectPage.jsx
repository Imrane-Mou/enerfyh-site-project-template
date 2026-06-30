import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Icon from '../components/Icon';
import projects from '../data/projects.json';

const NAV_LINKS = [
  { label: 'Le Projet', href: '#projet' },
  { label: 'Localisation', href: '#localisation' },
  { label: 'Retombées', href: '#retombees' },
  { label: 'Environnement', href: '#environnement' },
  { label: 'Sécurité', href: '#securite' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Actualités', href: '#actualites' },
];

export default function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const p = projects.find(x => x.slug === slug);
  const others = projects.filter(x => x.slug !== slug && x.visible);

  const [faqOpen, setFaqOpen] = useState(null);
  const [mythOpen, setMythOpen] = useState(null);
  const [faqCat, setFaqCat] = useState('Tous');
  const [mythCat, setMythCat] = useState('Tous');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', newsletter: false });
  const [submitted, setSubmitted] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !p) return;
    const init = () => {
      if (!window.L || !mapRef.current) return;
      const map = window.L.map(mapRef.current).setView([p.location.gpsLat, p.location.gpsLng], 13);
      mapInstance.current = map;
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap © CARTO', maxZoom: 18 }).addTo(map);
      const icon = window.L.divIcon({
        html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#0D1F4A;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);transform:rotate(-45deg)"></div>`,
        iconSize: [32, 32], iconAnchor: [16, 32], className: '',
      });
      window.L.marker([p.location.gpsLat, p.location.gpsLng], { icon }).addTo(map)
        .bindPopup(`<b>${p.location.commune}</b><br>${p.location.address}`).openPopup();
    };
    if (window.L) { init(); } else {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = init; document.head.appendChild(script);
    }
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [p]);

  if (!p || !p.visible) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F5F2EA' }}>
      <h2 style={{ color: '#0D1F4A', marginBottom: 16 }}>Projet introuvable</h2>
      <Link to="/" style={{ color: '#0D1F4A', fontWeight: 700 }}>← Retour à l'accueil</Link>
    </div>
  );

  const faqCategories = ['Tous', ...new Set(p.faq.map(f => f.category))];
  const mythCategories = ['Tous', ...new Set(p.mythsFacts.map(m => m.category))];
  const filteredFaq = faqCat === 'Tous' ? p.faq : p.faq.filter(f => f.category === faqCat);
  const filteredMyths = mythCat === 'Tous' ? p.mythsFacts : p.mythsFacts.filter(m => m.category === mythCat);

  const chip = (text) => ({
    padding: '7px 16px', borderRadius: 20, fontSize: '0.82rem',
    fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
  });

  return (
    <>
      <Navbar projectLinks={NAV_LINKS} />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        backgroundImage: p.heroImage
          ? `linear-gradient(160deg, rgba(13,31,74,0.85) 0%, rgba(13,31,74,0.55) 55%, rgba(13,31,74,0.9) 100%), url('${p.heroImage}')`
          : 'linear-gradient(160deg, #0D1F4A 0%, #1A3A7A 60%, #0D1F4A 100%)',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        {!p.heroImage && (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        )}
        <div className="container" style={{ position: 'relative' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 28, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
            ← Tous nos projets
          </Link>
          <h1 style={{ color: 'white', maxWidth: 800, marginBottom: 24, lineHeight: 1.1 }}>{p.project.name}</h1>
          <div style={{ width: 56, height: 4, background: 'white', opacity: 0.3, borderRadius: 2, marginBottom: 24 }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', maxWidth: 640, lineHeight: 1.7, marginBottom: 12 }}>{p.project.subtitle}</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.98rem', maxWidth: 620, lineHeight: 1.7, marginBottom: 48 }}>{p.project.description}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#projet" style={{ background: 'white', color: '#0D1F4A', padding: '14px 30px', borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F5F2EA'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
              Découvrir le projet ↓
            </a>
            <a href="#contact" style={{ background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.35)', padding: '14px 30px', borderRadius: 6, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}>
              Nous contacter
            </a>
          </div>
        </div>
      </section>
      
    
      {/* ── KEY FIGURES + TIMELINE ── */}
      <section id="projet" style={{ padding: '88px 0', background: '#F5F2EA' }}>
        <div className="container">
          <span className="eyebrow">Le Projet</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 40 }}>En un coup d'œil</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 72 }}>
            {p.keyFigures.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: '24px 20px', border: '1px solid rgba(13,31,74,0.08)', boxShadow: '0 2px 12px rgba(13,31,74,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(13,31,74,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,31,74,0.05)'; }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0D1F4A', opacity: 0.5, marginBottom: 8 }}>{f.label}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0D1F4A', marginBottom: 6, lineHeight: 1.2 }}>{f.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#6B7894', lineHeight: 1.5 }}>{f.detail}</div>
              </div>
            ))}
          </div>
          <h3 style={{ color: '#0D1F4A', marginBottom: 36, fontSize: '1.3rem' }}>Calendrier du projet</h3>
          <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: 12, gap: 0 }} className="timeline-horizontal">
            {p.timeline.map((item, i) => (
              <div key={i} style={{ flex: '1 1 0', minWidth: 190, position: 'relative', padding: '0 16px' }}>
                {/* line + tick */}
                <div style={{ position: 'relative', height: 2, background: 'rgba(13,31,74,0.15)', marginBottom: 16 }}>
                  <div style={{ position: 'absolute', left: 0, top: -3, width: 8, height: 8, borderRadius: '50%', background: '#0D1F4A' }} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0D1F4A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{item.date}</div>
                <div style={{ fontSize: '0.88rem', color: '#3A4A6A', lineHeight: 1.55 }}>{item.event}</div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){.timeline-horizontal{flex-direction:column!important}.timeline-horizontal>div{min-width:auto!important;padding:0!important;margin-bottom:20px}}`}</style>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section id="localisation" style={{ padding: '88px 0', background: 'white' }}>
        <div className="container">
          <span className="eyebrow">Localisation</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Localisation du site</h2>
          <p style={{ color: '#3A4A6A', marginBottom: 48, maxWidth: 700 }}>Découvrez l'emplacement précis du projet et les critères qui ont guidé ce choix.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div ref={mapRef} style={{ height: 380, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(13,31,74,0.12)', boxShadow: '0 4px 24px rgba(13,31,74,0.08)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: 'pin', label: 'Coordonnées GPS', value: p.location.gpsLabel },
                { icon: 'bolt', label: 'Raccordement', value: p.location.raccordement },
                { icon: 'home', label: 'Distance habitations', value: p.location.distanceHabitations },
                { icon: 'map', label: 'Commune', value: `${p.location.commune}, ${p.location.department}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, background: '#F5F2EA', borderRadius: 10, padding: '16px 20px', border: '1px solid rgba(13,31,74,0.07)' }}>
                  <span style={{ flexShrink: 0, marginTop: 2, color: '#0D1F4A' }}><Icon name={item.icon} size={22} strokeWidth={1.5} /></span>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0D1F4A', opacity: 0.55, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: '0.9rem', color: '#1A1A2E', lineHeight: 1.5 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){#localisation .container>div:last-child{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── LOCAL BENEFITS ── */}
      <section id="retombees" style={{ padding: '88px 0', background: '#F5F2EA' }}>
        <div className="container">
          <span className="eyebrow">Retombées locales</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Bénéfices pour le territoire</h2>
          <p style={{ color: '#3A4A6A', marginBottom: 48, maxWidth: 700 }}>Ce projet apporte des ressources concrètes à la commune et à ses habitants.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 40 }}>
            {[p.localBenefits.taxe1, p.localBenefits.taxe2, p.localBenefits.taxe3].map((tax, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: '28px 24px', border: '1px solid rgba(13,31,74,0.08)', borderTop: `4px solid #0D1F4A`, boxShadow: '0 2px 12px rgba(13,31,74,0.05)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D1F4A', marginBottom: 6 }}>{tax.amount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3A4A6A', marginBottom: 10 }}>{tax.label}</div>
                <p style={{ fontSize: '0.85rem', color: '#6B7894', lineHeight: 1.6 }}>{tax.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#0D1F4A', borderRadius: 12, padding: '32px', color: 'white' }}>
              <div style={{ marginBottom: 12, color: 'white' }}><Icon name="worker" size={30} strokeWidth={1.5} /></div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Emploi local</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 10 }}>{p.localBenefits.emplois}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.65 }}>En priorisant les entreprises locales disposant des compétences requises.</p>
            </div>
            <div style={{ background: 'white', borderRadius: 12, padding: '32px', border: '1px solid rgba(13,31,74,0.08)' }}>
              <div style={{ marginBottom: 12, color: '#0D1F4A' }}><Icon name="wheat" size={30} strokeWidth={1.5} /></div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0D1F4A', opacity: 0.5, marginBottom: 10 }}>Agriculture</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0D1F4A', marginBottom: 10 }}>{p.localBenefits.agricultureImpact}</div>
              <p style={{ fontSize: '0.875rem', color: '#3A4A6A', lineHeight: 1.65 }}>{p.localBenefits.agricultureCompensation}</p>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){#retombees .container>div:nth-child(4),#retombees .container>div:nth-child(5){grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── ENVIRONMENT ── */}
      <section id="environnement" style={{ padding: '88px 0', background: 'white' }}>
        <div className="container">
          <span className="eyebrow">Environnement</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Maîtrise des impacts environnementaux</h2>
          <p style={{ color: '#3A4A6A', marginBottom: 48, maxWidth: 700 }}>Le projet a été optimisé pour s'insérer discrètement dans son environnement.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 20 }}>
            {p.environment.map((item, i) => (
              <div key={i} style={{ background: '#F5F2EA', borderRadius: 12, padding: '32px 28px', border: '1px solid rgba(13,31,74,0.07)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(13,31,74,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ marginBottom: 14, color: '#0D1F4A' }}><Icon name={item.icon} size={32} strokeWidth={1.5} /></div>
                <h3 style={{ color: '#0D1F4A', fontSize: '1.05rem', marginBottom: 10 }}>{item.title}</h3>
                <div style={{ width: 32, height: 2, background: '#0D1F4A', opacity: 0.25, borderRadius: 1, marginBottom: 14 }} />
                <p style={{ fontSize: '0.9rem', color: '#3A4A6A', lineHeight: 1.7 }}>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SITE PLAN ── */}
      {p.sitePlan && (
        <section id="plan" style={{ padding: '88px 0', background: '#F5F2EA' }}>
          <div className="container">
            <span className="eyebrow">Plan du projet</span>
            <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Implantation sur le site</h2>
            <p style={{ color: '#3A4A6A', marginBottom: 40, maxWidth: 700 }}>Vue d'ensemble du plan de masse du projet.</p>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(13,31,74,0.1)', boxShadow: '0 4px 24px rgba(13,31,74,0.08)' }}>
              <img src={p.sitePlan} alt="Plan du projet" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </section>
      )}

      {/* ── PHOTO GALLERY ── */}
      {p.galleryPhotos && p.galleryPhotos.length > 0 && (
        <section id="photos" style={{ padding: '88px 0', background: 'white' }}>
          <div className="container">
            <span className="eyebrow">Photos</span>
            <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Photos du site</h2>
            <p style={{ color: '#3A4A6A', marginBottom: 40, maxWidth: 700 }}>Aperçu visuel du site et de son environnement.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {p.galleryPhotos.map((src, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(13,31,74,0.08)', aspectRatio: '4/3', boxShadow: '0 2px 12px rgba(13,31,74,0.06)' }}>
                  <img src={src} alt={`Photo du site ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SAFETY ── */}
      <section id="securite" style={{ padding: '88px 0', background: '#0D1F4A' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>Sécurité</span>
          <h2 style={{ color: 'white', marginBottom: 12 }}>Sécurité maximale</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 48, maxWidth: 700 }}>La sécurité est notre priorité absolue. Le projet applique rigoureusement la réglementation ICPE.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 18 }}>
            {p.safety.map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: 16 }}>
                  <Icon name={['flask','signal','fire','clipboard'][i] || 'bolt'} size={20} color="white" strokeWidth={1.5} />
                </div>
                <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: 10 }}>{item.title}</h3>
                <div style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.25)', borderRadius: 1, marginBottom: 12 }} />
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MYTHS & FACTS ── */}
      <section id="vraidufaux" style={{ padding: '88px 0', background: '#F5F2EA' }}>
        <div className="container">
          <span className="eyebrow">Le vrai du faux</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Idées reçues & réponses</h2>
          <p style={{ color: '#3A4A6A', marginBottom: 32, maxWidth: 700 }}>Retrouvez les réponses aux principales interrogations concernant le projet.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {mythCategories.map(cat => (
              <button key={cat} onClick={() => setMythCat(cat)} style={{ ...chip(), background: mythCat === cat ? '#0D1F4A' : 'white', color: mythCat === cat ? 'white' : '#3A4A6A', border: `1.5px solid ${mythCat === cat ? '#0D1F4A' : 'rgba(13,31,74,0.15)'}` }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredMyths.map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 10, border: `1px solid ${mythOpen === i ? 'rgba(13,31,74,0.25)' : 'rgba(13,31,74,0.08)'}`, overflow: 'hidden' }}>
                <button onClick={() => setMythOpen(mythOpen === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                    <span style={{ flexShrink: 0, marginTop: 2, color: '#C0392B' }}><Icon name="x" size={18} strokeWidth={2} /></span>
                    <div>
                      <div style={{ fontSize: '0.67rem', color: '#6B7894', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Idée reçue · {item.category}</div>
                      <div style={{ fontSize: '0.93rem', fontWeight: 500, color: '#1A1A2E', lineHeight: 1.5 }}>"{item.myth}"</div>
                    </div>
                  </div>
                  <span style={{ color: mythOpen === i ? '#0D1F4A' : '#6B7894', fontSize: '1.2rem', transition: 'transform 0.2s', transform: mythOpen === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>↓</span>
                </button>
                {mythOpen === i && (
                  <div style={{ padding: '0 24px 20px', borderTop: '1px solid rgba(13,31,74,0.08)' }}>
                    <div style={{ display: 'flex', gap: 12, paddingTop: 18 }}>
                      <span style={{ flexShrink: 0, marginTop: 2, color: '#0D1F4A' }}><Icon name="check" size={18} strokeWidth={2} /></span>
                      <div>
                        <div style={{ fontSize: '0.67rem', color: '#0D1F4A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>La réalité</div>
                        <p style={{ fontSize: '0.92rem', color: '#1A1A2E', lineHeight: 1.7 }}>{item.fact}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '88px 0', background: 'white' }}>
        <div className="container">
          <span className="eyebrow">FAQ</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Vos questions, nos réponses</h2>
          <p style={{ color: '#3A4A6A', marginBottom: 32, maxWidth: 700 }}>Retrouvez les réponses aux questions les plus courantes sur le projet.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {faqCategories.map(cat => (
              <button key={cat} onClick={() => setFaqCat(cat)} style={{ ...chip(), background: faqCat === cat ? '#0D1F4A' : '#F5F2EA', color: faqCat === cat ? 'white' : '#3A4A6A', border: `1.5px solid ${faqCat === cat ? '#0D1F4A' : 'transparent'}` }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredFaq.map((item, i) => (
              <div key={i} style={{ background: '#F5F2EA', borderRadius: 10, border: `1px solid ${faqOpen === i ? 'rgba(13,31,74,0.2)' : 'transparent'}`, overflow: 'hidden' }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.93rem', fontWeight: 600, color: '#0D1F4A', lineHeight: 1.4 }}>{item.question}</span>
                  <span style={{ color: faqOpen === i ? '#0D1F4A' : '#6B7894', fontSize: '1.2rem', transition: 'transform 0.2s', transform: faqOpen === i ? 'rotate(45deg)' : 'none', flexShrink: 0, lineHeight: 1 }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 22px 18px', borderTop: '1px solid rgba(13,31,74,0.1)' }}>
                    <p style={{ fontSize: '0.9rem', color: '#3A4A6A', lineHeight: 1.75, paddingTop: 14 }}>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section id="actualites" style={{ padding: '88px 0', background: '#F5F2EA' }}>
        <div className="container">
          <span className="eyebrow">Actualités</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 12 }}>Suivez l'avancement du projet</h2>
          <p style={{ color: '#3A4A6A', marginBottom: 48, maxWidth: 700 }}>Restez informé des dernières nouvelles et des étapes importantes du projet.</p>
          {p.news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7894' }}>
              <div style={{ marginBottom: 12, color: '#6B7894', display: 'flex', justifyContent: 'center' }}><Icon name="news" size={40} strokeWidth={1.3} /></div>
              <p>Les actualités de ce projet seront publiées prochainement.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}>
              {p.news.map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(13,31,74,0.07)', boxShadow: '0 2px 12px rgba(13,31,74,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(13,31,74,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,31,74,0.05)'; }}>
                  {item.image ? (
                    <div style={{ height: 140, overflow: 'hidden' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ) : (
                    <div style={{ height: 4, background: '#0D1F4A' }} />
                  )}
                  <div style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ background: 'rgba(13,31,74,0.08)', color: '#0D1F4A', padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700 }}>{item.tag}</span>
                      <span style={{ fontSize: '0.78rem', color: '#6B7894' }}>{item.date}</span>
                    </div>
                    <h3 style={{ color: '#0D1F4A', fontSize: '1rem', marginBottom: 10, lineHeight: 1.4 }}>{item.title}</h3>
                    <p style={{ fontSize: '0.86rem', color: '#3A4A6A', lineHeight: 1.65 }}>{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '88px 0', background: '#0D1F4A' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>Contact</span>
          <h2 style={{ color: 'white', marginBottom: 12 }}>Restons en contact</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 48, maxWidth: 520 }}>Une question sur le projet ? Notre équipe est à votre disposition.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {submitted ? (
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '48px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ marginBottom: 14, color: 'white', display: 'flex', justifyContent: 'center' }}><Icon name="check" size={40} strokeWidth={2} /></div>
                <h3 style={{ color: 'white', marginBottom: 10 }}>Message envoyé !</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ name: 'name', label: 'Nom', type: 'text', ph: 'Votre nom' }, { name: 'email', label: 'Email', type: 'email', ph: 'votre@email.fr' }].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} required value={formData[f.name]} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'white', fontSize: '0.92rem', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Message</label>
                  <textarea rows={4} placeholder="Votre message..." required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'white', fontSize: '0.92rem', outline: 'none', resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.newsletter} onChange={e => setFormData({ ...formData, newsletter: e.target.checked })} style={{ accentColor: 'white' }} />
                  <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)' }}>Recevoir les actualités du projet</span>
                </label>
                <button type="submit" style={{ background: 'white', color: '#0D1F4A', padding: '14px', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', marginTop: 4, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F2EA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  Envoyer le message →
                </button>
              </form>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Contact</div>
                <a href="mailto:youssef.mabrouk@enerfyh.com" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem' }}><Icon name="mail" size={18} strokeWidth={1.5} /> youssef.mabrouk@enerfyh.com</a>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Documents</div>
                {p.documents.map((doc, i) => (
                  <a key={i} href={doc.url} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.875rem', padding: '10px 0', borderBottom: i < p.documents.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                    <Icon name="doc" size={18} strokeWidth={1.5} /> {doc.label} <span style={{ marginLeft: 'auto', opacity: 0.5 }}>↓</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){#contact .container>div:last-child{grid-template-columns:1fr!important}} input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.3)}`}</style>
      </section>

      {/* ── OTHER PROJECTS ── */}
      {others.length > 0 && (
        <section style={{ padding: '80px 0', background: '#ECE6DB' }}>
          <div className="container">
            <span className="eyebrow">EnerFYH</span>
            <h2 style={{ color: '#0D1F4A', marginBottom: 40 }}>Nos autres projets</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
              {others.map(o => (
                <Link key={o.slug} to={`/projet/${o.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', borderRadius: 12, padding: '28px', border: '1px solid rgba(13,31,74,0.08)', boxShadow: '0 2px 12px rgba(13,31,74,0.05)', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column', gap: 8 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(13,31,74,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,31,74,0.05)'; }}>
                    <div style={{ fontSize: '0.72rem', color: '#6B7894', letterSpacing: '0.05em' }}>{o.department}</div>
                    <div style={{ fontWeight: 700, color: '#0D1F4A', fontSize: '1.05rem' }}>{o.commune}</div>
                    <div style={{ fontSize: '0.82rem', color: '#3A4A6A', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="bolt" size={14} color="#0D1F4A" strokeWidth={1.8} /> {o.capacity}</div>
                    <div style={{ fontSize: '0.8rem', background: 'rgba(13,31,74,0.07)', color: '#0D1F4A', padding: '3px 10px', borderRadius: 12, display: 'inline-block', fontWeight: 600, marginTop: 4 }}>{o.status}</div>
                    <div style={{ color: '#0D1F4A', fontWeight: 700, fontSize: '0.85rem', marginTop: 8 }}>Voir le projet →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: '#0A1733', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} EnerFYH · kyntus group · Tous droits réservés
        </div>
      </footer>
    </>
  );
}