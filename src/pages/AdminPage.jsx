import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import existingProjects from '../data/projects.json';

// ─── Reusable styled inputs ───
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#0D1F4A', marginBottom: 6, letterSpacing: '0.02em' };
const inputStyle = { width: '100%', padding: '11px 14px', background: 'white', border: '1px solid rgba(13,31,74,0.18)', borderRadius: 8, color: '#1A1A2E', fontSize: '0.9rem', fontFamily: 'Inter', outline: 'none', transition: 'border-color 0.2s' };
const focusOn = e => e.target.style.borderColor = '#0D1F4A';
const focusOff = e => e.target.style.borderColor = 'rgba(13,31,74,0.18)';

function Field({ label, value, onChange, placeholder, type = 'text', textarea, rows = 3 }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <Tag type={type} rows={textarea ? rows : undefined} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)} onFocus={focusOn} onBlur={focusOff}
        style={{ ...inputStyle, resize: textarea ? 'vertical' : undefined }} />
    </div>
  );
}

const slugify = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const blankFigure = () => ({ label: '', value: '', detail: '' });
const blankTimeline = () => ({ date: '', event: '' });
const blankEnv = () => ({ title: '', icon: 'leaf', content: '' });
const blankSafety = () => ({ title: '', content: '' });
const blankMyth = () => ({ category: '', myth: '', fact: '' });
const blankFaq = () => ({ category: '', question: '', answer: '' });
const blankNews = () => ({ date: '', title: '', summary: '', tag: '', image: '' });
const blankDoc = () => ({ label: '', url: '#' });

const BLANK_FORM = {
  slug: '', visible: true, status: 'En développement',
  commune: '', department: '', region: '', capacity: '', thumbnail: '', heroImage: '', sitePlan: '', galleryPhotos: [],
  projectName: '', subtitle: '', description: '',
  address: '', gpsLat: '', gpsLng: '', gpsLabel: '', raccordement: '', distanceHabitations: '',
  taxe1: { label: 'Taxe Foncière (TFPB)', amount: '', detail: '' },
  taxe2: { label: 'Cotisation Foncière (CFE)', amount: '', detail: '' },
  taxe3: { label: "Taxe d'aménagement", amount: '', detail: '' },
  emplois: '', agricultureImpact: '', agricultureCompensation: '',
  keyFigures: [blankFigure()],
  timeline: [blankTimeline()],
  environment: [blankEnv()],
  safety: [blankSafety()],
  mythsFacts: [blankMyth()],
  faq: [blankFaq()],
  news: [],
  documents: [blankDoc()],
};

// Converts a project object from projects.json into the flat form shape
function projectToForm(p) {
  return {
    slug: p.slug || '', visible: p.visible !== false, status: p.status || 'En développement',
    commune: p.commune || '', department: p.department || '', region: p.region || '',
    capacity: p.capacity || '', thumbnail: p.thumbnail || '', heroImage: p.heroImage || '',
    sitePlan: p.sitePlan || '', galleryPhotos: p.galleryPhotos && p.galleryPhotos.length ? [...p.galleryPhotos] : [],
    projectName: p.project?.name || '', subtitle: p.project?.subtitle || '', description: p.project?.description || '',
    address: p.location?.address || '', gpsLat: p.location?.gpsLat ?? '', gpsLng: p.location?.gpsLng ?? '',
    gpsLabel: p.location?.gpsLabel || '', raccordement: p.location?.raccordement || '', distanceHabitations: p.location?.distanceHabitations || '',
    taxe1: p.localBenefits?.taxe1 || BLANK_FORM.taxe1,
    taxe2: p.localBenefits?.taxe2 || BLANK_FORM.taxe2,
    taxe3: p.localBenefits?.taxe3 || BLANK_FORM.taxe3,
    emplois: p.localBenefits?.emplois || '', agricultureImpact: p.localBenefits?.agricultureImpact || '', agricultureCompensation: p.localBenefits?.agricultureCompensation || '',
    keyFigures: p.keyFigures && p.keyFigures.length ? p.keyFigures.map(x => ({ ...x })) : [blankFigure()],
    timeline: p.timeline && p.timeline.length ? p.timeline.map(x => ({ ...x })) : [blankTimeline()],
    environment: p.environment && p.environment.length ? p.environment.map(x => ({ ...x })) : [blankEnv()],
    safety: p.safety && p.safety.length ? p.safety.map(x => ({ ...x })) : [blankSafety()],
    mythsFacts: p.mythsFacts && p.mythsFacts.length ? p.mythsFacts.map(x => ({ ...x })) : [blankMyth()],
    faq: p.faq && p.faq.length ? p.faq.map(x => ({ ...x })) : [blankFaq()],
    news: p.news ? p.news.map(x => ({ image: '', ...x })) : [],
    documents: p.documents && p.documents.length ? p.documents.map(x => ({ ...x })) : [blankDoc()],
  };
}

export default function AdminPage() {
  // ── Authentification ──
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [sessionPassword, setSessionPassword] = useState(''); // gardé en mémoire pour les appels API suivants
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [form, setForm] = useState(BLANK_FORM);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [mode, setMode] = useState('new'); // 'new' | 'edit'
  const [output, setOutput] = useState('');
  const [outputMode, setOutputMode] = useState('save'); // 'save' | 'delete'
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null); // { success, message, commitUrl } | { error }
  const outputRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.valid) {
        setSessionPassword(passwordInput);
        setAuthenticated(true);
      } else {
        setAuthError('Mot de passe incorrect.');
      }
    } catch (err) {
      setAuthError('Erreur de connexion au serveur.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Publie directement sur GitHub via le backend (au lieu de juste copier-coller)
  const publishToGitHub = async (action, projectData, slugForAction) => {
    setPublishing(true);
    setPublishResult(null);
    try {
      const res = await fetch('/api/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: sessionPassword,
          action,                 // 'create' | 'update' | 'delete'
          project: projectData,   // objet projet complet (sauf pour delete)
          slug: slugForAction,    // slug ciblé (pour update/delete)
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPublishResult({ success: true, message: data.message, commitUrl: data.commitUrl });
      } else {
        setPublishResult({ success: false, error: data.error, details: data.details });
      }
    } catch (err) {
      setPublishResult({ success: false, error: 'Erreur réseau', details: err.message });
    } finally {
      setPublishing(false);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const loadProject = (slug) => {
    setSelectedSlug(slug);
    setPublishResult(null);
    if (!slug) {
      setForm(BLANK_FORM);
      setMode('new');
      setOutput('');
      return;
    }
    const p = existingProjects.find(x => x.slug === slug);
    if (p) {
      setForm(projectToForm(p));
      setMode('edit');
      setOutput('');
    }
  };

  const startNewProject = () => {
    setSelectedSlug('');
    setForm(BLANK_FORM);
    setMode('new');
    setOutput('');
  };

  const deleteProject = () => {
    const ok = window.confirm(`Supprimer définitivement le projet "${form.commune || selectedSlug}" du site ? Cette action publie immédiatement le changement.`);
    if (!ok) return;
    publishToGitHub('delete', null, selectedSlug);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setNested = (key, sub, val) => setForm(f => ({ ...f, [key]: { ...f[key], [sub]: val } }));

  const setListItem = (key, i, sub, val) => setForm(f => {
    const arr = [...f[key]]; arr[i] = { ...arr[i], [sub]: val }; return { ...f, [key]: arr };
  });
  const addListItem = (key, blank) => setForm(f => ({ ...f, [key]: [...f[key], blank()] }));
  const removeListItem = (key, i) => setForm(f => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const buildProjectObject = () => ({
    slug: form.slug || slugify(form.commune || 'projet'),
    visible: form.visible,
    status: form.status,
    commune: form.commune,
    department: form.department,
    region: form.region,
    capacity: form.capacity,
    thumbnail: form.thumbnail,
    heroImage: form.heroImage,
    sitePlan: form.sitePlan,
    galleryPhotos: form.galleryPhotos.filter(Boolean),
    project: { name: form.projectName, subtitle: form.subtitle, description: form.description },
    keyFigures: form.keyFigures.filter(x => x.label || x.value),
    timeline: form.timeline.filter(x => x.date || x.event),
    location: {
      address: form.address, commune: form.commune, department: form.department,
      gpsLat: parseFloat(form.gpsLat) || 0, gpsLng: parseFloat(form.gpsLng) || 0,
      gpsLabel: form.gpsLabel, raccordement: form.raccordement, distanceHabitations: form.distanceHabitations,
    },
    localBenefits: {
      taxe1: form.taxe1, taxe2: form.taxe2, taxe3: form.taxe3,
      emplois: form.emplois, agricultureImpact: form.agricultureImpact, agricultureCompensation: form.agricultureCompensation,
    },
    environment: form.environment.filter(x => x.title),
    safety: form.safety.filter(x => x.title),
    mythsFacts: form.mythsFacts.filter(x => x.myth),
    faq: form.faq.filter(x => x.question),
    news: form.news.filter(x => x.title),
    documents: form.documents.filter(x => x.label),
  });

  // Publie directement (création ou mise à jour selon le mode actuel)
  const handlePublish = () => {
    const obj = buildProjectObject();
    if (mode === 'edit') {
      publishToGitHub('update', obj, selectedSlug);
    } else {
      publishToGitHub('create', obj, obj.slug);
    }
  };

  const sectionCard = { background: 'white', borderRadius: 14, padding: '28px 28px 20px', border: '1px solid rgba(13,31,74,0.1)', boxShadow: '0 2px 12px rgba(13,31,74,0.05)', marginBottom: 24 };
  const sectionTitle = { fontSize: '1rem', fontWeight: 700, color: '#0D1F4A', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 };
  const sectionDesc = { fontSize: '0.82rem', color: '#6B7894', marginBottom: 20 };
  const addBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(13,31,74,0.07)', color: '#0D1F4A', border: '1px dashed rgba(13,31,74,0.3)', borderRadius: 8, padding: '9px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' };
  const removeBtn = { background: 'none', border: 'none', color: '#C0392B', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 };
  const itemBox = { background: '#F8F6F3', borderRadius: 10, padding: '18px', marginBottom: 14, border: '1px solid rgba(13,31,74,0.06)' };
  const row3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 };

  // ── Écran de connexion : affiché tant que le mot de passe n'est pas validé ──
  if (!authenticated) {
    return (
      <div style={{ background: '#0D1F4A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ background: 'white', borderRadius: 6, padding: '6px 14px' }}>
              <div style={{ color: '#0D1F4A', fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>EnerFYH.</div>
              <div style={{ color: '#0D1F4A', fontSize: '0.48rem', opacity: 0.55, letterSpacing: '0.06em' }}>∧ kyntus group</div>
            </div>
          </div>
          <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '32px' }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6, textAlign: 'center' }}>Accès administrateur</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginBottom: 24, textAlign: 'center' }}>Entrez le mot de passe pour gérer les projets</div>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Mot de passe"
              autoFocus
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'white', fontSize: '0.95rem', outline: 'none', marginBottom: 16 }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
            {authError && (
              <div style={{ color: '#FF8A75', fontSize: '0.82rem', marginBottom: 16, textAlign: 'center' }}>{authError}</div>
            )}
            <button type="submit" disabled={authLoading} style={{ width: '100%', background: 'white', color: '#0D1F4A', border: 'none', borderRadius: 8, padding: '13px', fontSize: '0.92rem', fontWeight: 700, cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.6 : 1 }}>
              {authLoading ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.82rem' }}>← Retour au site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F5F2EA', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#0D1F4A', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: 'white', borderRadius: 6, padding: '5px 12px' }}>
              <div style={{ color: '#0D1F4A', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>EnerFYH.</div>
              <div style={{ color: '#0D1F4A', fontSize: '0.45rem', opacity: 0.55, letterSpacing: '0.06em' }}>∧ kyntus group</div>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Générateur de projet</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>Remplissez le formulaire, copiez le JSON généré</div>
            </div>
          </div>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>← Retour au site</Link>
        </div>
      </header>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Intro */}
        <div style={{ background: 'rgba(13,31,74,0.06)', border: '1px solid rgba(13,31,74,0.12)', borderRadius: 12, padding: '18px 22px', marginBottom: 32, fontSize: '0.88rem', color: '#3A4A6A', lineHeight: 1.6 }}>
          <strong style={{ color: '#0D1F4A' }}>Comment ça marche :</strong> remplissez les champs ci-dessous, puis cliquez sur <em>Publier</em> en bas — le site est mis à jour automatiquement en 1-2 minutes, aucune autre action n'est nécessaire.
        </div>

        {/* ── PROJECT SELECTOR ── */}
        <div style={{ ...sectionCard, background: '#0D1F4A', border: 'none' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7ECC52', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
            Charger un projet existant
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 260px' }}>
              <select value={selectedSlug} onChange={e => loadProject(e.target.value)} style={{ ...inputStyle, border: 'none' }}>
                <option value="">— Créer un nouveau projet —</option>
                {existingProjects.map(p => (
                  <option key={p.slug} value={p.slug}>{p.commune} ({p.slug}) {p.visible === false ? '· masqué' : ''}</option>
                ))}
              </select>
            </div>
            {mode === 'edit' && (
              <>
                <div style={{ background: 'rgba(126,204,82,0.15)', border: '1px solid rgba(126,204,82,0.4)', color: '#7ECC52', borderRadius: 8, padding: '11px 16px', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Mode édition — "{form.commune}"
                </div>
                <button onClick={startNewProject} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '11px 18px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  + Nouveau projet
                </button>
                <button onClick={deleteProject} disabled={publishing} style={{ background: 'rgba(220,60,50,0.15)', color: '#FF8A75', border: '1px solid rgba(220,60,50,0.4)', borderRadius: 8, padding: '11px 18px', fontSize: '0.82rem', fontWeight: 600, cursor: publishing ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: publishing ? 0.5 : 1 }}>
                  {publishing ? 'Suppression...' : 'Supprimer ce projet'}
                </button>
              </>
            )}
          </div>
          {mode === 'new' && (
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: 10 }}>
              Vous créez un nouveau projet. Sélectionnez un projet ci-dessus pour le modifier ou le supprimer à la place.
            </div>
          )}
        </div>

        {/* ── GENERAL ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="clipboard" size={18} color="#0D1F4A" /> Informations générales</div>
          <div style={sectionDesc}>Ces infos apparaissent sur la carte de la page d'accueil.</div>
          <Field label="Commune" value={form.commune} onChange={v => set('commune', v)} placeholder="Ex : Saint-Martin" />
          <div style={row3}>
            <Field label="Département" value={form.department} onChange={v => set('department', v)} placeholder="Ex : Gironde (33)" />
            <Field label="Région" value={form.region} onChange={v => set('region', v)} placeholder="Ex : Région Sud" />
            <Field label="Capacité" value={form.capacity} onChange={v => set('capacity', v)} placeholder="Ex : 50 MW / 200 MWh" />
          </div>
          <div style={row3}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Statut</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff}>
                <option>En développement</option>
                <option>En instruction</option>
                <option>En construction</option>
                <option>En exploitation</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Visible sur le site ?</label>
              <div onClick={() => set('visible', !form.visible)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: form.visible ? 'rgba(22,163,74,0.1)' : 'rgba(192,57,43,0.08)', border: `1px solid ${form.visible ? 'rgba(22,163,74,0.3)' : 'rgba(192,57,43,0.25)'}`, borderRadius: 8 }}>
                <div style={{ width: 38, height: 22, borderRadius: 12, background: form.visible ? '#16A34A' : '#C0392B', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: form.visible ? 19 : 3, transition: 'left 0.2s' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: form.visible ? '#15803D' : '#A93226' }}>{form.visible ? 'Oui, publié' : 'Non, masqué'}</span>
              </div>
            </div>
            <Field label="Slug (URL, optionnel)" value={form.slug} onChange={v => set('slug', v)} placeholder={form.commune ? slugify(form.commune) : 'auto'} />
          </div>
          <Field label="Image miniature (URL, optionnel)" value={form.thumbnail} onChange={v => set('thumbnail', v)} placeholder="https://... (laisser vide pour l'icône par défaut)" />
          <Field label="Image de fond du hero (URL, optionnel)" value={form.heroImage} onChange={v => set('heroImage', v)} placeholder="/images/nom-du-projet.jpg (laisser vide pour le dégradé bleu par défaut)" />
          <Field label="Plan du projet (URL, optionnel)" value={form.sitePlan} onChange={v => set('sitePlan', v)} placeholder="/images/plan-du-projet.jpg (laisser vide pour masquer cette section)" />
          <div style={{ fontSize: '0.78rem', color: '#6B7894', marginTop: -8, marginBottom: 16 }}>
            Déposez vos photos dans <code style={{ background: 'rgba(13,31,74,0.08)', padding: '1px 5px', borderRadius: 3 }}>public/images/</code> sur GitHub, puis indiquez ici <code style={{ background: 'rgba(13,31,74,0.08)', padding: '1px 5px', borderRadius: 3 }}>/images/nom-du-fichier.jpg</code>
          </div>
        </div>

        {/* ── PHOTO GALLERY ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="news" size={18} color="#0D1F4A" /> Photos du site <span style={{ fontWeight: 400, color: '#6B7894', fontSize: '0.8rem' }}>(optionnel)</span></div>
          <div style={sectionDesc}>Photos affichées dans une galerie sur la page projet. Laissez vide si vous n'avez pas encore de photos.</div>
          {form.galleryPhotos.map((src, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Field label={`Photo ${i + 1}`} value={src} onChange={v => setForm(f => { const arr = [...f.galleryPhotos]; arr[i] = v; return { ...f, galleryPhotos: arr }; })} placeholder="/images/site-photo-1.jpg" />
              </div>
              <button onClick={() => setForm(f => ({ ...f, galleryPhotos: f.galleryPhotos.filter((_, idx) => idx !== i) }))} style={{ ...removeBtn, marginTop: 30 }}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>
            </div>
          ))}
          <button onClick={() => setForm(f => ({ ...f, galleryPhotos: [...f.galleryPhotos, ''] }))} style={addBtn}>+ Ajouter une photo</button>
        </div>

        {/* ── HERO ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="bolt" size={18} color="#0D1F4A" /> En-tête de la page projet</div>
          <div style={sectionDesc}>Le grand titre et la description en haut de la page dédiée.</div>
          <Field label="Nom du projet (titre principal)" value={form.projectName} onChange={v => set('projectName', v)} placeholder="Plateforme de stockage d'énergie de..." />
          <Field label="Sous-titre" value={form.subtitle} onChange={v => set('subtitle', v)} placeholder="50 MW / 200 MWh de capacité de stockage..." textarea rows={2} />
          <Field label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Connectée au poste RTE de..." textarea rows={3} />
        </div>

        {/* ── KEY FIGURES ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="scale" size={18} color="#0D1F4A" /> Chiffres clés</div>
          <div style={sectionDesc}>La grille de chiffres en haut de la section "Le Projet".</div>
          {form.keyFigures.map((fig, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Chiffre {i + 1}</span>
                {form.keyFigures.length > 1 && <button onClick={() => removeListItem('keyFigures', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>}
              </div>
              <div style={row3}>
                <Field label="Libellé" value={fig.label} onChange={v => setListItem('keyFigures', i, 'label', v)} placeholder="PUISSANCE" />
                <Field label="Valeur" value={fig.value} onChange={v => setListItem('keyFigures', i, 'value', v)} placeholder="50 MW / 200 MWh" />
                <Field label="Détail" value={fig.detail} onChange={v => setListItem('keyFigures', i, 'detail', v)} placeholder="50 MW pendant 4h" />
              </div>
            </div>
          ))}
          <button onClick={() => addListItem('keyFigures', blankFigure)} style={addBtn}>+ Ajouter un chiffre</button>
        </div>

        {/* ── TIMELINE ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="news" size={18} color="#0D1F4A" /> Calendrier</div>
          <div style={sectionDesc}>Les étapes chronologiques du projet.</div>
          {form.timeline.map((item, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Étape {i + 1}</span>
                {form.timeline.length > 1 && <button onClick={() => removeListItem('timeline', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <Field label="Date" value={item.date} onChange={v => setListItem('timeline', i, 'date', v)} placeholder="Mars 2025" />
                <Field label="Événement" value={item.event} onChange={v => setListItem('timeline', i, 'event', v)} placeholder="Dépôt du permis de construire" />
              </div>
            </div>
          ))}
          <button onClick={() => addListItem('timeline', blankTimeline)} style={addBtn}>+ Ajouter une étape</button>
        </div>

        {/* ── LOCATION ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="pin" size={18} color="#0D1F4A" /> Localisation</div>
          <div style={sectionDesc}>Coordonnées GPS et infos techniques. Latitude/longitude pour la carte.</div>
          <Field label="Adresse complète" value={form.address} onChange={v => set('address', v)} placeholder="Lieu-dit, route..." />
          <div style={row3}>
            <Field label="Latitude GPS" value={form.gpsLat} onChange={v => set('gpsLat', v)} placeholder="44.8378" />
            <Field label="Longitude GPS" value={form.gpsLng} onChange={v => set('gpsLng', v)} placeholder="-0.5792" />
            <Field label="Coordonnées (texte)" value={form.gpsLabel} onChange={v => set('gpsLabel', v)} placeholder="44°50'N 0°34'O" />
          </div>
          <Field label="Raccordement" value={form.raccordement} onChange={v => set('raccordement', v)} placeholder="Poste RTE de..., liaison souterraine 90kV" />
          <Field label="Distance aux habitations" value={form.distanceHabitations} onChange={v => set('distanceHabitations', v)} placeholder="Environ 300 mètres de la résidence la plus proche" />
          <div style={{ fontSize: '0.78rem', color: '#6B7894', marginTop: 4 }}>
            Astuce : pour trouver lat/long, clic droit sur Google Maps → les coordonnées s'affichent.
          </div>
        </div>

        {/* ── LOCAL BENEFITS ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="wheat" size={18} color="#0D1F4A" /> Retombées locales</div>
          <div style={sectionDesc}>Fiscalité, emploi et impact agricole.</div>
          {['taxe1', 'taxe2', 'taxe3'].map((t) => (
            <div key={t} style={itemBox}>
              <Field label="Titre de la taxe" value={form[t].label} onChange={v => setNested(t, 'label', v)} placeholder="Taxe Foncière sur les Propriétés Bâties (TFPB)" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Montant" value={form[t].amount} onChange={v => setNested(t, 'amount', v)} placeholder="20 000 – 30 000 €/an" />
                <Field label="Détail" value={form[t].detail} onChange={v => setNested(t, 'detail', v)} placeholder="Versée à la commune." />
              </div>
            </div>
          ))}
          <Field label="Emploi local" value={form.emplois} onChange={v => set('emplois', v)} placeholder="~30 emplois équivalents temps plein sur la construction" />
          <Field label="Impact agricole" value={form.agricultureImpact} onChange={v => set('agricultureImpact', v)} placeholder="3 hectares, soit 4% de l'exploitation" />
          <Field label="Compensation agricole" value={form.agricultureCompensation} onChange={v => set('agricultureCompensation', v)} placeholder="L'agriculteur bénéficie d'une compensation intégrale..." textarea rows={2} />
        </div>

        {/* ── ENVIRONMENT ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="leaf" size={18} color="#0D1F4A" /> Environnement</div>
          <div style={sectionDesc}>Points environnementaux (3 recommandés).</div>
          {form.environment.map((item, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Point {i + 1}</span>
                {form.environment.length > 1 && <button onClick={() => removeListItem('environment', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Titre" value={item.title} onChange={v => setListItem('environment', i, 'title', v)} placeholder="Protection de l'eau" />
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Icône</label>
                  <select value={item.icon} onChange={e => setListItem('environment', i, 'icon', e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff}>
                    <option value="water">Eau</option>
                    <option value="leaf">Feuille / nature</option>
                    <option value="sound">Son / bruit</option>
                    <option value="shield">Bouclier</option>
                    <option value="bolt">Éclair</option>
                  </select>
                </div>
              </div>
              <Field label="Contenu" value={item.content} onChange={v => setListItem('environment', i, 'content', v)} placeholder="Zéro rejet en fonctionnement normal..." textarea rows={2} />
            </div>
          ))}
          <button onClick={() => addListItem('environment', blankEnv)} style={addBtn}>+ Ajouter un point</button>
        </div>

        {/* ── SAFETY ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="shield" size={18} color="#0D1F4A" /> Sécurité</div>
          <div style={sectionDesc}>Points de sécurité (4 recommandés).</div>
          {form.safety.map((item, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Point {i + 1}</span>
                {form.safety.length > 1 && <button onClick={() => removeListItem('safety', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>}
              </div>
              <Field label="Titre" value={item.title} onChange={v => setListItem('safety', i, 'title', v)} placeholder="Technologie stable LFP" />
              <Field label="Contenu" value={item.content} onChange={v => setListItem('safety', i, 'content', v)} placeholder="Batteries Lithium Fer Phosphate..." textarea rows={2} />
            </div>
          ))}
          <button onClick={() => addListItem('safety', blankSafety)} style={addBtn}>+ Ajouter un point</button>
        </div>

        {/* ── MYTHS ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="check" size={18} color="#0D1F4A" /> Le vrai du faux</div>
          <div style={sectionDesc}>Idées reçues et leurs réponses.</div>
          {form.mythsFacts.map((item, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Idée reçue {i + 1}</span>
                {form.mythsFacts.length > 1 && <button onClick={() => removeListItem('mythsFacts', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>}
              </div>
              <Field label="Catégorie" value={item.category} onChange={v => setListItem('mythsFacts', i, 'category', v)} placeholder="Sécurité / Environnement / Économie" />
              <Field label="Idée reçue (le mythe)" value={item.myth} onChange={v => setListItem('mythsFacts', i, 'myth', v)} placeholder="Les batteries présentent un risque d'incendie élevé." textarea rows={2} />
              <Field label="La réalité (réponse)" value={item.fact} onChange={v => setListItem('mythsFacts', i, 'fact', v)} placeholder="La technologie LFP présente une stabilité..." textarea rows={2} />
            </div>
          ))}
          <button onClick={() => addListItem('mythsFacts', blankMyth)} style={addBtn}>+ Ajouter une idée reçue</button>
        </div>

        {/* ── FAQ ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="news" size={18} color="#0D1F4A" /> FAQ</div>
          <div style={sectionDesc}>Questions fréquentes.</div>
          {form.faq.map((item, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Question {i + 1}</span>
                {form.faq.length > 1 && <button onClick={() => removeListItem('faq', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>}
              </div>
              <Field label="Catégorie" value={item.category} onChange={v => setListItem('faq', i, 'category', v)} placeholder="Sécurité et technologie" />
              <Field label="Question" value={item.question} onChange={v => setListItem('faq', i, 'question', v)} placeholder="Quelle technologie est utilisée ?" />
              <Field label="Réponse" value={item.answer} onChange={v => setListItem('faq', i, 'answer', v)} placeholder="Le projet utilise des batteries..." textarea rows={2} />
            </div>
          ))}
          <button onClick={() => addListItem('faq', blankFaq)} style={addBtn}>+ Ajouter une question</button>
        </div>

        {/* ── NEWS ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="news" size={18} color="#0D1F4A" /> Actualités <span style={{ fontWeight: 400, color: '#6B7894', fontSize: '0.8rem' }}>(optionnel)</span></div>
          <div style={sectionDesc}>Articles d'actualité du projet. Peut rester vide.</div>
          {form.news.map((item, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Actualité {i + 1}</span>
                <button onClick={() => removeListItem('news', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Date" value={item.date} onChange={v => setListItem('news', i, 'date', v)} placeholder="15/03/2025" />
                <Field label="Tag" value={item.tag} onChange={v => setListItem('news', i, 'tag', v)} placeholder="Concertation" />
              </div>
              <Field label="Titre" value={item.title} onChange={v => setListItem('news', i, 'title', v)} placeholder="Réunion publique à la mairie" />
              <Field label="Résumé" value={item.summary} onChange={v => setListItem('news', i, 'summary', v)} placeholder="EnerFYH a présenté le projet..." textarea rows={2} />
              <Field label="Image (URL, optionnel)" value={item.image} onChange={v => setListItem('news', i, 'image', v)} placeholder="/images/actualite-1.jpg" />
            </div>
          ))}
          <button onClick={() => addListItem('news', blankNews)} style={addBtn}>+ Ajouter une actualité</button>
        </div>

        {/* ── DOCUMENTS ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}><Icon name="doc" size={18} color="#0D1F4A" /> Documents</div>
          <div style={sectionDesc}>Fichiers PDF à télécharger (mettez l'URL une fois le fichier hébergé).</div>
          {form.documents.map((item, i) => (
            <div key={i} style={itemBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7894' }}>Document {i + 1}</span>
                {form.documents.length > 1 && <button onClick={() => removeListItem('documents', i)} style={removeBtn}><Icon name="x" size={12} strokeWidth={2.5} /> Retirer</button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Libellé" value={item.label} onChange={v => setListItem('documents', i, 'label', v)} placeholder="Étude environnementale" />
                <Field label="URL du fichier" value={item.url} onChange={v => setListItem('documents', i, 'url', v)} placeholder="https://... ou #" />
              </div>
            </div>
          ))}
          <button onClick={() => addListItem('documents', blankDoc)} style={addBtn}>+ Ajouter un document</button>
        </div>

        {/* ── PUBLISH ── */}
        <button onClick={handlePublish} disabled={publishing} style={{
          width: '100%', background: publishing ? '#5A6B8C' : '#0D1F4A', color: 'white', border: 'none',
          borderRadius: 10, padding: '18px', fontSize: '1rem', fontWeight: 700,
          cursor: publishing ? 'not-allowed' : 'pointer', marginTop: 8, marginBottom: 24, transition: 'background 0.2s',
        }}
          onMouseEnter={e => { if (!publishing) e.currentTarget.style.background = '#1A3A7A'; }}
          onMouseLeave={e => { if (!publishing) e.currentTarget.style.background = '#0D1F4A'; }}>
          {publishing
            ? 'Publication en cours...'
            : mode === 'edit' ? 'Publier les modifications →' : 'Publier ce nouveau projet →'}
        </button>

        {/* ── RESULT ── */}
        {publishResult && (
          <div ref={outputRef} style={{
            background: '#0A1733', borderRadius: 14, padding: '24px',
            border: `1px solid ${publishResult.success ? 'rgba(126,204,82,0.3)' : 'rgba(220,60,50,0.3)'}`,
          }}>
            {publishResult.success ? (
              <>
                <div style={{ color: '#7ECC52', fontSize: '0.9rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="check" size={16} strokeWidth={2.5} /> Publié avec succès
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 12 }}>
                  {publishResult.message}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.7 }}>
                  Vercel va redéployer automatiquement le site (1-2 minutes). Le changement sera ensuite visible en ligne.
                </p>
                {publishResult.commitUrl && (
                  <a href={publishResult.commitUrl} target="_blank" rel="noreferrer" style={{ color: '#7ECC52', fontSize: '0.82rem', display: 'inline-block', marginTop: 10 }}>
                    Voir le commit sur GitHub →
                  </a>
                )}
              </>
            ) : (
              <>
                <div style={{ color: '#FF8A75', fontSize: '0.9rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="x" size={16} strokeWidth={2.5} /> Échec de la publication
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.7 }}>{publishResult.error}</p>
                {publishResult.details && (
                  <pre style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{publishResult.details}</pre>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
