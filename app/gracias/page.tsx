import type { Metadata } from "next";

import { GraciasClient } from "./GraciasClient";

export const metadata: Metadata = {
  title: "Gracias | Fichas Weekly",
  description:
    "Confirmacion de registro en Fichas Weekly y acceso directo a Fichas Online.",
  alternates: {
    canonical: "/gracias",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function GraciasPage() {
  return <GraciasClient />;
}
