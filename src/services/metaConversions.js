const API_URL = import.meta.env.VITE_META_CONVERSIONS_API_URL;

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
        const eventId = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', eventName, customData, { eventID: eventId });
        }

        if (!API_URL) {
            return null;
        }

        const payload = {
            eventName,
            eventId,
            userData,
            customData,
            eventSourceUrl: typeof window !== "undefined" ? window.location.href : "https://tu-sitio.com",
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            keepalive: true,
        });

        if (!response.ok) {
            throw new Error(`Meta CAPI respondio ${response.status}`);
        }

        return await response.json();
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
    return await sendEventToCAPI("Contact", userData);
};

/**
 * Evento "Suscribirte" (Equivalente en Meta: "Subscribe")
 * Ejecuta esta función cuando inicia una suscripción a un servicio.
 * @param {object} userData - Ejemplo: { email: 'cliente@correo.com', phone: '54911...' }
 * @param {object} customData - (Opcional) Ej. para pasar cuánto vale la suscripción: { value: "30.00", currency: "USD" }
 */
export const sendSubscribeEvent = async (userData, customData = {}) => {
    return await sendEventToCAPI("Subscribe", userData, customData);
};
