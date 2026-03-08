import axios from 'axios';

// La URL del backend proxy que creamos, asegurándonos de que esté apuntando al puerto 3001.
// Nota: en producción esto debe apuntar a la URL real de tu backend (por ej. Vercel o tu servidor cloud).
const API_URL = 'http://localhost:3001/api/meta-conversions';

/**
 * Una función premium para enviar cualquier evento de forma segura hacia nuestro Proxy.
 * Luego, el proxy se encarga de cifrar la información y mandarla a Facebook.
 * 
 * @param {string} eventName - Nombre estándar de Meta (ej. "Contact")
 * @param {object} userData - Datos que completó el usuario: { email, phone, firstName, lastName }
 * @param {object} customData - (Opcional) Datos comerciales como valor o moneda.
 */
const sendEventToCAPI = async (eventName, userData = {}, customData = {}) => {
    try {
        // Generamos un ID único para este evento (útil para que Meta deduplique Frontend y Backend)
        const eventId = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // 🔥 Disparo Dual: 1. Disparamos el evento en el FRONTEND (Pixel)
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', eventName, customData, { eventID: eventId });
        }

        // 🔥 Disparo Dual: 2. Preparamos el envío al BACKEND (CAPI)
        const payload = {
            eventName,
            eventId, // Pasamos el ID para la deduplicación
            userData,
            customData,
            eventSourceUrl: typeof window !== "undefined" ? window.location.href : "https://tu-sitio.com",
        };

        const response = await axios.post(API_URL, payload);
        return response.data;
    } catch (error) {
        console.error(`Error de red al intentar enviar ${eventName} a CAPI:`, error);
        return null;
    }
};

/**
 * Evento "Contactar" (Equivalente en Meta: "Contact")
 * Ejecuta esta función cuando el usuario llame, envíe un SMS, email o WhatsApp.
 * @param {object} userData - Ejemplo: { email: 'cliente@correo.com', phone: '54911...' }
 */
export const sendContactEvent = async (userData) => {
    console.log("🟢 Iniciando envío de evento: Contactar...");
    return await sendEventToCAPI("Contact", userData);
};

/**
 * Evento "Suscribirte" (Equivalente en Meta: "Subscribe")
 * Ejecuta esta función cuando inicia una suscripción a un servicio.
 * @param {object} userData - Ejemplo: { email: 'cliente@correo.com', phone: '54911...' }
 * @param {object} customData - (Opcional) Ej. para pasar cuánto vale la suscripción: { value: "30.00", currency: "USD" }
 */
export const sendSubscribeEvent = async (userData, customData = {}) => {
    console.log("🌟 Iniciando envío de evento: Suscribirte...");
    return await sendEventToCAPI("Subscribe", userData, customData);
};
