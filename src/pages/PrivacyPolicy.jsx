import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
                {/* Navigation */}
                <Link to="/" className="inline-flex items-center gap-2 mb-12 text-sm font-medium text-zinc-400 hover:text-white transition-colors group">
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al Inicio
                </Link>

                {/* Header */}
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Políticas de Privacidad <br className="hidden md:block" />
                        <span className="text-indigo-400">y Cookies</span>
                    </h1>
                    <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
                        En cumplimiento con los estándares de Meta y la API de Conversiones, detallamos el tratamiento de datos y los parámetros de eventos que recolectamos para mejorar tu experiencia.
                    </p>
                </header>

                {/* Content Section */}
                <div className="space-y-12">
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6">Parámetros de Detalles del Evento</h2>
                        <p className="mb-6 leading-relaxed">
                            Seleccionamos los parámetros de detalles de evento necesarios para enviar con los eventos de <strong>"Contactar"</strong>. La eficacia de nuestra comunicación y el rendimiento de la plataforma dependen de la precisión de estos datos.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'Fecha y hora del evento', status: 'Obligatorio API' },
                                { label: 'Nombre del evento', status: 'Obligatorio API' },
                                { label: 'URL de origen del evento', status: 'Obligatorio API' },
                                { label: 'Origen de la acción', status: 'Obligatorio API' },
                                { label: 'Identificador de evento', status: 'Referencia Única' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                    <span className="font-medium text-zinc-200">{item.label}</span>
                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 whitespace-nowrap">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6">Instrucciones para la Instalación de la API de Conversiones</h2>
                        <p className="leading-relaxed">
                            Hemos configurado nuestra infraestructura para asegurar que los parámetros seleccionados creen un flujo de datos correcto hacia Meta. Esto permite que el sistema de conversiones aprecie la calidad de los datos enviados y optimice los resultados de interacción.
                        </p>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6">Información del Cliente</h2>
                        <p className="mb-6 leading-relaxed">
                            Recopilamos información específica de los clientes enviada desde nuestro servidor. Estos datos se utilizan para encontrar coincidencias con los identificadores de cuentas de Facebook, permitiendo atribuir el rendimiento y mostrar información relevante a las personas con más posibilidades de interés.
                        </p>

                        <div className="space-y-4">
                            <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                <h3 className="text-white font-medium mb-2">Datos Técnicos (No cifrados con hash)</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-400">
                                    <li className="flex items-center gap-2">• Dirección IP de cliente</li>
                                    <li className="flex items-center gap-2">• Agente de usuario cliente (Obligatorio API)</li>
                                    <li className="flex items-center gap-2">• Cookie de identificador (fbc)</li>
                                    <li className="flex items-center gap-2">• Cookie del navegador (fbp)</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                <h3 className="text-white font-medium mb-2">Datos de Identificación Personal</h3>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-1 text-sm text-zinc-400">
                                    <li>• Nombre</li>
                                    <li>• Apellidos</li>
                                    <li>• E-mail</li>
                                    <li>• Teléfono</li>
                                    <li>• Ciudad</li>
                                    <li>• País</li>
                                    <li>• Estado/Provincia</li>
                                    <li>• Código Postal</li>
                                    <li>• Fecha de Nacimiento</li>
                                    <li>• Sexo</li>
                                    <li>• ID Externo</li>
                                    <li>• ID Suscripción</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-6">Opciones de Tratamiento de Datos</h2>
                        <p className="leading-relaxed">
                            Respetamos las regulaciones locales sobre el procesamiento de datos. Los usuarios pueden gestionar sus preferencias y optar por desactivar ciertos seguimientos de acuerdo con las normativas vigentes en su País o Estado de residencia.
                        </p>
                    </section>
                </div>

                {/* Footer info */}
                <footer className="mt-20 pt-12 border-t border-white/5 text-center text-sm text-zinc-500">
                    <p>© {new Date().getFullYear()} Circuito Exclusivo. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
