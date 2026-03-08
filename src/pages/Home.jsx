import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendSubscribeEvent, sendContactEvent } from '../services/metaConversions';

export default function Home() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptTerms) {
            alert("Debes aceptar el tratamiento de datos para continuar.");
            return;
        }

        setStatus('loading');

        // n8n Webhook connection placeholder
        const n8nWebhookUrl = 'https://TU_N8N_WEBHOOK_URL/webhook/contacto';

        try {
            // Disparamos el Evento "Suscribirte" a nuestro Backend Proxy de Meta CAPI
            sendSubscribeEvent({ email: email });

            // Simulate network request
            setTimeout(() => {
                setStatus('success');
                setEmail('');
            }, 1500);
        } catch (error) {
            console.error("Error enviando a n8n:", error);
            setStatus('idle');
        }
    };

    return (
        <div className="w-full overflow-x-hidden max-w-[1440px] mx-auto relative bg-zinc-950 text-white min-h-screen font-sans">

            <section className="flex flex-col justify-center items-center min-h-screen px-6 py-16 md:px-20 lg:py-32 text-center relative z-10">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-indigo-500/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-emerald-400 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Acceso a la Comunidad Cerrada
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
                        El Circuito en <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Un Solo Lugar.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl lg:text-2xl text-zinc-400 max-w-2xl leading-relaxed mt-2 font-light">
                        Recibe antes que nadie la información exclusiva de los mejores eventos, torneos y mesas del circuito. Únete a nuestra lista de correo y mantente siempre un paso adelante en la estrategia y la acción.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 mt-8 w-full sm:w-auto items-center justify-center">
                        <a href="#registro" className="px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-base md:text-lg hover:bg-zinc-200 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-center inline-flex justify-center items-center">
                            Suscribirme Gratis
                        </a>
                        <span className="text-sm text-zinc-500 font-light mt-2 sm:mt-0 sm:ml-2">Solo información valiosa. Cero spam.</span>
                    </div>
                </div>
            </section>

            <section id="registro" className="flex flex-col justify-center items-center px-6 py-16 md:px-20 lg:py-32 relative bg-zinc-900/50 border-t border-white/5 z-20">
                <div className="max-w-3xl w-full flex flex-col items-center text-center gap-8">

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">
                        La información es poder.<br className="md:hidden" /> Asegura tu asiento.
                    </h2>

                    <p className="text-base md:text-lg text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
                        Cada semana enviamos nuestra grilla curada con los detalles que la comunidad necesita saber. Torneos, horarios y novedades del circuito directamente en tu bandeja de entrada.
                    </p>

                    <form className="w-full max-w-md mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all backdrop-blur-sm disabled:opacity-50"
                            required
                        />

                        <div className="flex items-start gap-3 mt-1 px-1">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                required
                                className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 transition-all cursor-pointer"
                            />
                            <label htmlFor="acceptTerms" className="text-left text-xs md:text-sm text-zinc-500 font-light leading-snug cursor-pointer hover:text-zinc-400 transition-colors">
                                Acepto los Términos y Condiciones y la <Link to="/politicas-de-privacidad" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 decoration-indigo-400/30">Política de Privacidad</Link>.
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className={`w-full px-5 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${status === 'success'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-500 shadow-indigo-500/25 disabled:opacity-70'
                                }`}
                        >
                            {status === 'idle' && 'Unirme a la Lista'}
                            {status === 'loading' && 'Enviando...'}
                            {status === 'success' && '¡Bienvenido a la Comunidad!'}
                        </button>
                    </form>

                    <p className="text-xs text-zinc-500 font-light mt-2 text-center max-w-sm">
                        Al unirte aceptas recibir nuestra información periódica. Puedes darte de baja cuando quieras.
                    </p>
                </div>
            </section>
            <section className="flex flex-col justify-center items-center px-6 py-16 md:px-20 lg:py-24 relative bg-zinc-950 border-t border-white/5 z-20">
                <div className="max-w-3xl w-full flex flex-col items-center text-center gap-6">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                        ¿Prefieres enterarte por WhatsApp?
                    </h3>
                    <p className="text-zinc-400 font-light max-w-lg mx-auto">
                        Si quieres recibir alertas rápidas y las últimas novedades directo en tu celular, escríbenos. Te mantendremos informado sobre las próximas fechas y competiciones al instante.
                    </p>
                    <a
                        href="https://wa.me/SU_NUMERO_AQUI"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sendContactEvent({})}
                        className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-full font-bold text-base md:text-lg hover:bg-[#20bd5a] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                    >
                        {/* Simple WhatsApp SVG Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Escríbenos para Más Info
                    </a>
                </div>
            </section>

        </div>
    );
}
