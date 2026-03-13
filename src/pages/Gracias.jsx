import { useEffect, useState } from 'react';

const LOGO_GLOW = '/svg/LOGO%20CON%20LUZ.svg';
const REDIRECT_URL = 'https://fichasonline.uy';
const COUNTDOWN_SECONDS = 20;

export default function Gracias() {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      window.location.href = REDIRECT_URL;
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="mobile-landing gracias-page">
      <div className="gracias-content">
        <img
          src={LOGO_GLOW}
          alt="Fichas Online"
          width="220"
          height="104"
          className="gracias-logo"
        />

        <h1 className="gracias-title">
          <span>¡YA ESTÁS</span>
          <span className="violet"> ADENTRO!</span>
        </h1>

        <p className="gracias-copy">
          Te contactamos pronto con toda la info.
        </p>

        <div className="gracias-divider" />

        <h2 className="gracias-subtitle">¿QUÉ ES FICHAS ONLINE?</h2>

        <p className="gracias-body">
          La comunidad de poker más activa de Uruguay. Grilla de mesas en tiempo real, torneos, resultados y las últimas novedades del circuito — todo en un solo lugar.
        </p>

        <p className="gracias-body">
          Desde cash games hasta los torneos más grandes del país, en Fichas Online siempre sabés dónde jugar y cuándo.
        </p>

        <div className="gracias-redirect-box">
          <p>Entrá a la plataforma en</p>
          <span className="gracias-countdown">{seconds}</span>
          <p>segundos</p>
        </div>

        <a href={REDIRECT_URL} className="gracias-cta-btn">
          IR A FICHAS ONLINE AHORA
        </a>
      </div>
    </div>
  );
}
