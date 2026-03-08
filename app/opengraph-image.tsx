import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top, rgba(143,117,255,0.45), transparent 35%), linear-gradient(135deg, #05050a 0%, #10111f 60%, #05050a 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "56px",
        }}
      >
          <div
            style={{
              display: "flex",
              width: "100%",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 36,
              padding: 44,
              background: "rgba(255,255,255,0.05)",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              borderRadius: 999,
              padding: "12px 22px",
              border: "1px solid rgba(143,117,255,0.35)",
              color: "#c6bbff",
              background: "rgba(143,117,255,0.12)",
              fontSize: 24,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Fichas Weekly
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.05,
                maxWidth: 820,
              }}
            >
              Enterate que se juega esta semana
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.72)",
                maxWidth: 860,
              }}
            >
              Agenda semanal de torneos, fechas clave y un canal directo por
              WhatsApp para pedir mas info.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              fontSize: 24,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            <div>Agenda ordenada</div>
            <div style={{ color: "#7cf7ff" }}>•</div>
            <div>Movida semanal</div>
            <div style={{ color: "#7cf7ff" }}>•</div>
            <div>WhatsApp directo</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
