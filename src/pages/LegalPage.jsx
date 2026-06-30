import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LegalPage() {
  const section = { marginBottom: 40 };
  const h2 = { color: '#0D1F4A', fontSize: '1.1rem', marginBottom: 14, fontWeight: 700 };
  const p = { color: '#3A4A6A', fontSize: '0.92rem', lineHeight: 1.75, marginBottom: 10 };
  const strong = { color: '#0D1F4A', fontWeight: 600 };

  return (
    <>
      <Navbar />

      <section style={{ padding: '140px 24px 32px', background: '#0D1F4A' }}>
        <div className="container">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 24 }}>
            ← Retour à l'accueil
          </Link>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 8 }}>Mentions légales</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Dernière mise à jour : juin 2026</p>
        </div>
      </section>

      <section style={{ padding: '64px 0 96px', background: '#F5F2EA' }}>
        <div className="container" style={{ maxWidth: 760 }}>


          <div style={section}>
            <h2 style={h2}>Éditeur du site</h2>
            <p style={p}>Le site <span style={strong}>projets.enerfyh.com</span> est édité par :</p>
            <p style={p}>
              <span style={strong}>EnerFYH SAS</span><br />
              Société par actions simplifiée au capital de 10 000 €<br />
              Siège social : 12 rue de l'Exemple, 75008 Paris, France<br />
              RCS Paris 123 456 789<br />
              SIRET : 123 456 789 00012<br />
              N° TVA intracommunautaire : FR12 123456789
            </p>
            <p style={p}>
              Directeur de la publication : <span style={strong}>Prénom Nom</span><br />
              Contact : <a href="mailto:contact@enerfyh.com" style={{ color: '#0D1F4A', fontWeight: 600 }}>contact@enerfyh.com</a>
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>Hébergement</h2>
            <p style={p}>
              Le site est hébergé par :<br />
              <span style={strong}>Vercel Inc.</span><br />
              340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: '#0D1F4A', fontWeight: 600 }}>vercel.com</a>
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>Conception et développement</h2>
            <p style={p}>
              Site conçu et développé par <span style={strong}>Prénom Nom</span>, dans le cadre d'une mission au sein du groupe Kyntus.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>Propriété intellectuelle</h2>
            <p style={p}>
              L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes) est la propriété exclusive d'EnerFYH SAS, sauf mention contraire. Toute reproduction, représentation, modification ou exploitation totale ou partielle de ces contenus, par quelque procédé que ce soit, sans autorisation préalable écrite, est interdite et constituerait une contrefaçon.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>Données personnelles</h2>
            <p style={p}>
              Les informations recueillies via le formulaire de contact du site sont destinées exclusivement à EnerFYH SAS, dans le cadre du traitement des demandes des utilisateurs. Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
            </p>
            <p style={p}>
              Pour exercer ce droit, contactez : <a href="mailto:contact@enerfyh.com" style={{ color: '#0D1F4A', fontWeight: 600 }}>contact@enerfyh.com</a>
            </p>
            <p style={p}>
              Pour plus de détails, consultez notre <Link to="/confidentialite" style={{ color: '#0D1F4A', fontWeight: 600 }}>politique de confidentialité</Link>.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>Limitation de responsabilité</h2>
            <p style={p}>
              EnerFYH s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, mais ne peut garantir l'exhaustivité de ces informations. EnerFYH décline toute responsabilité pour les éventuelles imprécisions, inexactitudes ou omissions relatives aux informations disponibles sur le site.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>Droit applicable</h2>
            <p style={p}>
              Le présent site et les présentes mentions légales sont soumis au droit français. En cas de litige, et après tentative de recherche d'une solution amiable, compétence est attribuée aux tribunaux français compétents.
            </p>
          </div>

        </div>
      </section>

      <footer style={{ background: '#0A1733', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} EnerFYH · kyntus group · Tous droits réservés
        </div>
      </footer>
    </>
  );
}
