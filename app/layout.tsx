import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
const title = "Agenda semanal de torneos de poker | Fichas Weekly";
const description =
  "Recibi por mail la agenda semanal de torneos, fechas clave y novedades para seguir la movida con informacion clara y un canal directo por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Fichas Weekly",
  keywords: [
    "agenda semanal de torneos",
    "torneos de poker",
    "calendario de torneos",
    "comunidad de poker",
    "novedades de torneos",
  ],
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Fichas Weekly",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Fichas Weekly - Agenda semanal de torneos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-ink text-white antialiased">
        {children}
      </body>
    </html>
  );
}
