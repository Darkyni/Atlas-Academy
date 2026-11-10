import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATLAS Academy — v1.0.0",
  description: "Uma academia pessoal organizada por disciplinas, com aulas, materiais, videoaulas, laboratório e jogos educativos.",
  icons: { icon: "/atlas-mark.svg", shortcut: "/atlas-mark.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
