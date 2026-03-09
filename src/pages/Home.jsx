import React, { useState } from 'react';

const HERO_BG = '/svg/PORTADA.webp';
const LOGO_GLOW = '/svg/LOGO%20CON%20LUZ.svg';
const INFO_BG = 'https://www.figma.com/api/mcp/asset/e8fb845f-35ff-4694-b25d-aff80b692f9e';
const INFO_OVERLAY = 'https://www.figma.com/api/mcp/asset/d2ac79f0-89fd-43e7-bda2-b85d5c208fc2';
const WSP_TOP_PNG = '/landing/whatsapp-top.png';
const GRILLA_BG = '/landing/grilla-mobile.jpg';
const TORNEOS_BG = '/landing/torneos-mobile.jpg';

let trackingModulePromise;

const loadTrackingModule = () => {
  if (!trackingModulePromise) {
    trackingModulePromise = import('../services/metaConversions');
  }

  return trackingModulePromise;
};

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [phone, setPhone] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const { sendSubscribeEvent } = await loadTrackingModule();
      void sendSubscribeEvent({ email });
      setTimeout(() => {
        setStatus('success');
        setEmail('');
      }, 1200);
    } catch (error) {
      console.error('Error enviando suscripcion:', error);
      setStatus('idle');
    }
  };

  const handleWhatsAppClick = async () => {
    const { sendContactEvent } = await loadTrackingModule();
    void sendContactEvent({ phone });
  };

  return (
    <div className="mobile-landing">
      <section className="section hero-section">
        <div className="hero-top-wrap">
          <img
            className="hero-bg"
            src={HERO_BG}
            alt=""
            width="559"
            height="426"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="hero-ellipse" aria-hidden="true" />
        <div className="hero-bottom-band" />

        <div className="hero-content">
          <img
            className="hero-logo"
            src={LOGO_GLOW}
            alt="Fichas Online"
            width="249"
            height="117"
            fetchPriority="high"
            decoding="async"
          />
          <p className="hero-label">DEJA TU CORREO ACA</p>

          <form className="hero-form" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="TUCORRE@...."
              disabled={status === 'loading' || status === 'success'}
              required
            />
            <button className="hero-cta-btn" type="submit" disabled={status === 'loading' || status === 'success'}>
              {status === 'idle' && 'SUMATE A LA COMUNIDAD'}
              {status === 'loading' && 'ENVIANDO...'}
              {status === 'success' && 'YA ESTAS ADENTRO'}
            </button>
          </form>

          <h1 className="hero-title-main">
            <span>UNITE A LA</span>
            <span className="violet">COMUNIDAD</span>
            <span>Y ENTERATE</span>
            <span>DE TODO</span>
          </h1>

          <p className="hero-copy-main">
            RECIBE ANTES QUE NADIE LA INFORMACION EXCLUSIVA DE LOS MEJORES EVENTOS, TORNEOS Y MESAS DEL CIRCUITO.
          </p>
        </div>

        <div className="hero-cta-shape" aria-hidden="true" />
      </section>

      <section className="section info-section">
        <div className="info-head" aria-hidden="true">
          <div className="info-head-glow info-head-glow-primary" />
          <div className="info-head-glow info-head-glow-secondary" />
          <img
            className="info-head-image info-head-image-base"
            src={INFO_BG}
            alt=""
            width="393"
            height="426"
            loading="lazy"
            decoding="async"
          />
          <img
            className="info-head-image info-head-image-overlay"
            src={INFO_OVERLAY}
            alt=""
            width="393"
            height="426"
            loading="lazy"
            decoding="async"
          />
          <div className="info-head-grid" />
        </div>
        <div className="info-copy">
          <h2>
            <span>LA </span>
            <span className="violet">INFORMACION</span>
            <span> ES </span>
            <span className="green">PODER</span>
            <span>. </span>
            <span>ASEGURA TU ASIENTO</span>
          </h2>
        </div>
        <div className="info-foot">
          <p>
            Cada semana enviamos nuestra grilla con los detalles que la comunidad necesita saber. Torneos, horarios y
            novedades del circuito directamente en tu bandeja de entrada.
          </p>
        </div>
      </section>

      <section className="section split-section">
        <div className="split-block split-top">
          <img
            className="split-media"
            src={GRILLA_BG}
            alt=""
            width="393"
            height="360"
            loading="lazy"
            decoding="async"
          />
          <div className="split-scrim" aria-hidden="true" />
          <div className="split-content">
            <h3>GRILLA</h3>
            <p>
              ACCEDE A LA SELECCION MAS PRECISA DE MESAS Y EVENTOS, FILTRADA POR CALIDAD Y RELEVANCIA TECNOLOGICA.
            </p>
          </div>
        </div>
        <div className="split-block split-bottom">
          <img
            className="split-media"
            src={TORNEOS_BG}
            alt=""
            width="393"
            height="360"
            loading="lazy"
            decoding="async"
          />
          <div className="split-scrim" aria-hidden="true" />
          <div className="split-content">
            <h3>TORNEOS</h3>
            <p>NO TE PIERDAS NINGUNA INSCRIPCION. RECIBE ALERTAS EN TIEMPO REAL DE LOS TORNEOS MAS IMPORTANTES DEL ECOSISTEMA.</p>
          </div>
        </div>
      </section>

      <section className="section whatsapp-section">
        <div className="whatsapp-main">
          <img
            className="whatsapp-top-image"
            src={WSP_TOP_PNG}
            alt=""
            aria-hidden="true"
            width="378"
            height="250"
            loading="lazy"
            decoding="async"
          />

          <h2>¿PREFIERES ENTERARTE POR WHATSAPP?</h2>
          <p className="whatsapp-copy">
            SI QUIERES RECIBIR ALERTAS RÁPIDAS Y LAS ÚLTIMAS NOVEDADES DIRECTO EN TU CELULAR, ESCRÍBENOS. TE
            MANTENDREMOS INFORMADO AL INSTANTE.
          </p>
          <p className="small-label">DEJÁ TU NUMERO PARA MÁS INFO</p>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="099 000 000" />
          <a href="https://wa.me/SU_NUMERO_AQUI" target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick}>
            SUMATÉ A LA COMUNIDAD
          </a>
        </div>
        <div className="whatsapp-footer">
          <img src={LOGO_GLOW} alt="Fichas Online" width="352" height="166" loading="lazy" decoding="async" />
        </div>
      </section>
    </div>
  );
}
