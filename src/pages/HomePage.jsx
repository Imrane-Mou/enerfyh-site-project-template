import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Icon from '../components/Icon';
import projects from '../data/projects.json';

const STATUS_COLORS = {
  'En développement': { bg: '#EEF2FF', text: '#0D1F4A', dot: '#0D1F4A' },
  'En instruction':   { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' },
  'En construction':  { bg: '#DCFCE7', text: '#14532D', dot: '#16A34A' },
  'En exploitation':  { bg: '#DBEAFE', text: '#1E3A8A', dot: '#2563EB' },
};

export default function HomePage() {
  const [filter, setFilter] = useState('Tous');

  const visibleProjects = projects.filter(p => p.visible);
  const regions = ['Tous', ...new Set(visibleProjects.map(p => p.region))];
  const filtered = filter === 'Tous' ? visibleProjects : visibleProjects.filter(p => p.region === filter);

  const totalMW = visibleProjects.reduce((acc, p) => {
    const match = p.capacity.match(/(\d+)\s*MW/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '72vh',
        background: 'linear-gradient(160deg, #0A1733 0%, #0D1F4A 50%, #1A3A7A 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '140px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '30%', right: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', boxShadow: '0 0 8px #4ADE80' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em' }}>EnerFYH · kyntus group</span>
          </div>

          <h1 style={{ color: 'white', maxWidth: 700, marginBottom: 20, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            Nos projets de<br />stockage d'énergie
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 560, lineHeight: 1.75, marginBottom: 52 }}>
            EnerFYH développe des centrales de stockage d'électricité par batteries (BESS Standalone) sur le territoire français, avec des puissances allant jusqu'à 100 MW.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {[
              { value: visibleProjects.length, label: 'Projets en cours' },
              { value: `${totalMW} MW`, label: 'Puissance totale' },
              { value: '100%', label: 'Territoire français' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: 4, letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KYNTUS GROUP ── */}
      <section style={{ padding: '64px 0', background: '#F5F2EA' }}>
        <div className="container">
          <div style={{ background: '#0D1F4A', borderRadius: 14, padding: '36px 40px', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 320px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7ECC52', marginBottom: 8 }}>
                EnerFYH est une filiale de
              </div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.02em', marginBottom: 14 }}>
                KYNTUS GROUP
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Fondé en 2018, Kyntus est un grand groupe français actif dans la construction et la maintenance de réseaux de télécommunications fixes et mobiles (fibre optique, 4G, 5G). Présent en France, en Allemagne, en Irlande et à La Réunion, le groupe apporte à EnerFYH <strong style={{ color: 'rgba(255,255,255,0.9)' }}>un soutien industriel solide, un financement robuste et une excellence opérationnelle</strong> éprouvée sur des déploiements d'infrastructures à grande échelle.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 28 }}>
              {[
                { num: '273M€', label: "Chiffre d'affaires 2024" },
                { num: '+26%', label: 'Croissance annuelle' },
                { num: '3 000', label: 'Collaborateurs (partenaires inclus)' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '12px 16px', minWidth: 100 }}>
                  <div style={{ color: '#7ECC52', fontWeight: 800, fontSize: '1.3rem', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:700px){section div[style*="border-left: 1px solid rgba(255,255,255,0.12)"]{border-left:none!important;padding-left:0!important}}`}</style>
      </section>

      {/* ── PROJECTS ── */}
      <section style={{ padding: '80px 0 96px', background: '#F5F2EA' }}>
        <div className="container">

          {/* Header + filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2 style={{ color: '#0D1F4A', letterSpacing: '-0.02em' }}>Tous nos projets</h2>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {regions.map(r => (
                <button key={r} onClick={() => setFilter(r)} style={{
                  padding: '8px 18px', borderRadius: 24, fontSize: '0.83rem', fontWeight: 600,
                  cursor: 'pointer', border: `1.5px solid ${filter === r ? '#0D1F4A' : 'rgba(13,31,74,0.18)'}`,
                  background: filter === r ? '#0D1F4A' : 'white',
                  color: filter === r ? 'white' : '#3A4A6A',
                  transition: 'all 0.2s',
                }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p style={{ color: '#6B7894', fontSize: '0.85rem', marginBottom: 28 }}>
            {filtered.length} projet{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B7894' }}>
              <div style={{ marginBottom: 12, color: '#6B7894', display: 'flex', justifyContent: 'center' }}><Icon name="battery" size={44} strokeWidth={1.3} /></div>
              <p>Aucun projet dans cette région pour le moment.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {filtered.map(p => {
                const sc = STATUS_COLORS[p.status] || STATUS_COLORS['En développement'];
                return (
                  <Link key={p.slug} to={`/projet/${p.slug}`} style={{ textDecoration: 'none', display: 'flex' }}>
                    <div style={{
                      background: 'white', borderRadius: 16,
                      border: '1px solid rgba(13,31,74,0.08)',
                      boxShadow: '0 2px 16px rgba(13,31,74,0.06)',
                      overflow: 'hidden', width: '100%',
                      transition: 'transform 0.25s, box-shadow 0.25s',
                      display: 'flex', flexDirection: 'column',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(13,31,74,0.14)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(13,31,74,0.06)'; }}
                    >
                      {/* Thumbnail */}
                      <div style={{ height: 200, background: 'linear-gradient(135deg, #0D1F4A 0%, #1A3A7A 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.commune} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ textAlign: 'center', opacity: 0.35 }}>
                            <div style={{ display: 'flex', justifyContent: 'center', color: 'white' }}><Icon name="battery" size={48} strokeWidth={1.3} /></div>
                            <div style={{ color: 'white', fontSize: '0.75rem', marginTop: 8, letterSpacing: '0.12em' }}>BESS · {p.capacity}</div>
                          </div>
                        )}
                        {/* Top gradient */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,20,50,0.5) 0%, transparent 60%)' }} />
                        {/* Status */}
                        <div style={{ position: 'absolute', top: 14, right: 14, background: 'white', borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: sc.text }}>{p.status}</span>
                        </div>
                        {/* Region */}
                        <div style={{ position: 'absolute', bottom: 14, left: 14, color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                          {p.region}
                        </div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '0.72rem', color: '#6B7894', marginBottom: 6, letterSpacing: '0.04em' }}>{p.department}</div>
                        <h3 style={{ color: '#0D1F4A', fontSize: '1.2rem', marginBottom: 10, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{p.commune}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#3A4A6A', lineHeight: 1.65, marginBottom: 20, flex: 1 }}>{p.project.subtitle}</p>

                        {/* Capacity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                          <div style={{ background: '#EEF2FF', color: '#0D1F4A', borderRadius: 20, padding: '5px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="bolt" size={14} color="#0D1F4A" strokeWidth={1.8} /> {p.capacity}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(13,31,74,0.07)' }}>
                          <span style={{ color: '#0D1F4A', fontWeight: 700, fontSize: '0.875rem' }}>Découvrir le projet</span>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0D1F4A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', transition: 'transform 0.2s' }}>→</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* ── ABOUT STRIP ── */}
      <section style={{ padding: '72px 0', background: '#0D1F4A' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
            {[
              { icon: 'scale', title: 'Équilibre du réseau électrique', text: 'EnerFYH développe des centrales qui absorbent les excédents de production et les réinjectent lors des pics de consommation.' },
              { icon: 'leaf', title: 'Réduction des émissions', text: 'En intégrant les énergies renouvelables, nos actifs BESS participent à la décarbonation du mix énergétique national.' },
              { icon: 'shield', title: 'Indépendance énergétique', text: 'Le stockage par batteries valorise l\'électricité produite localement, réduisant la dépendance aux importations.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center', color: 'white', opacity: 0.9 }}><Icon name={item.icon} size={34} strokeWidth={1.4} /></div>
                <h3 style={{ color: 'white', fontSize: '1.05rem', marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.75 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){section div[style*="grid-template-columns: 1fr 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '80px 0', background: '#ECE6DB' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Contact</span>
          <h2 style={{ color: '#0D1F4A', marginBottom: 14, letterSpacing: '-0.02em' }}>Une question sur nos projets ?</h2>
          <p style={{ color: '#3A4A6A', maxWidth: 480, margin: '0 auto 36px', fontSize: '1rem', lineHeight: 1.7 }}>
            Notre équipe est disponible pour répondre à toutes vos questions sur nos projets de stockage d'énergie.
          </p>
          <a href="mailto:contact@enerfyh.com" style={{ background: '#0D1F4A', color: 'white', padding: '15px 36px', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1A3A7A'}
            onMouseLeave={e => e.currentTarget.style.background = '#0D1F4A'}>
            contact@enerfyh.com →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0A1733', padding: '36px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'white', borderRadius: 5, padding: '5px 10px' }}>
              <div style={{ color: '#0D1F4A', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>EnerFYH.</div>
              <div style={{ color: '#0D1F4A', fontSize: '0.45rem', opacity: 0.55, letterSpacing: '0.06em' }}>∧ kyntus group</div>
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} EnerFYH · kyntus group · Tous droits réservés
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Mentions légales', 'Confidentialité'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
