import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';

dotenv.config();

const app = express();

// Habilitar CORS para permitir que el frontend se comunique con este servidor local
app.use(cors());
// Middleware para procesar cuerpos JSON
app.use(express.json());

const PORT = process.env.PORT || 3001;
const META_API_TOKEN = process.env.META_API_TOKEN;
const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_API_VERSION = "v19.0"; // Versión de la API Graph de Meta

// Función para cifrar los datos del usuario (Obligatorio en CAPI) en SHA-256
const hashData = (data) => {
    if (!data) return null;
    // Convertimos a minúsculas y eliminamos espacios extra antes de cifrar
    const cleanData = String(data).trim().toLowerCase();
    return crypto.createHash('sha256').update(cleanData).digest('hex');
};

app.post('/api/meta-conversions', async (req, res) => {
    try {
        const { eventName, eventId, userData, customData, eventSourceUrl } = req.body;

        // Validación de seguridad para que funcione correctamente
        if (!META_API_TOKEN || !META_PIXEL_ID) {
            console.warn("Faltan credenciales de Meta en el archivo .env");
            return res.status(500).json({ error: "Configura META_API_TOKEN y META_PIXEL_ID en el archivo .env" });
        }

        // Estructuramos la carga útil (Payload) requerida por Meta
        const metaPayload = {
            data: [
                {
                    event_name: eventName, // "Contact" o "Subscribe"
                    event_time: Math.floor(Date.now() / 1000), // Fecha en formato UNIX
                    event_id: eventId, // ✨ Vital para la deduplicación con el Píxel (Frontend)
                    action_source: "website",
                    event_source_url: eventSourceUrl || "",
                    user_data: {
                        client_ip_address: req.ip, // Importantísimo para el algoritmo de Meta
                        client_user_agent: req.headers['user-agent'],
                    },
                    custom_data: customData || {},
                }
            ]
        };

        // Si el usuario nos envía Email, lo ciframos y lo agregamos
        if (userData?.email) {
            metaPayload.data[0].user_data.em = [hashData(userData.email)];
        }
        // Si el usuario nos envía Teléfono, lo ciframos y lo agregamos
        if (userData?.phone) {
            // Nota: El teléfono debe tener el código de país para mayor precisión (ej. 54911xxxxxx)
            const cleanPhone = String(userData.phone).replace(/[^0-9]/g, '');
            metaPayload.data[0].user_data.ph = [hashData(cleanPhone)];
        }

        // Otras variables disponibles requeridas según Meta para lograr calidad "Excelente":
        if (userData?.firstName) metaPayload.data[0].user_data.fn = [hashData(userData.firstName)];
        if (userData?.lastName) metaPayload.data[0].user_data.ln = [hashData(userData.lastName)];
        if (userData?.city) metaPayload.data[0].user_data.ct = [hashData(userData.city)];
        if (userData?.country) metaPayload.data[0].user_data.country = [hashData(userData.country)];

        const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_API_TOKEN}`;

        // Enviamos el evento de forma segura al servidor de Facebook
        const response = await axios.post(url, metaPayload);

        console.log(`✅ Evento "${eventName}" enviado con éxito a Meta CAPI`);
        return res.status(200).json({ success: true, meta_response: response.data });

    } catch (error) {
        console.error("❌ Error en Meta CAPI:", error.response?.data || error.message);
        return res.status(500).json({ error: "Hubo un fallo al enviar el evento a Meta." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 [BACKEND PREMIUM] Servidor de Conversiones de Meta en puerto ${PORT}`);
});
