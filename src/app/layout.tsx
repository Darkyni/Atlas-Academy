import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATLAS Academy — RPG Edition v1.1.0",
  description: "Uma academia pessoal gamificada: seis territórios do conhecimento, trilhas, missões, laboratório e progressão por aprendizagem.",
  icons: { icon: "/atlas-mark.svg", shortcut: "/atlas-mark.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
