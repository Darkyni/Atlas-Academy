import type { Metadata } from "next";
import "./globals.css";
import "./rpg-world.css";

export const metadata: Metadata = {
  title: "ATLAS Academy — RPG Learning World",
  description: "Uma academia pessoal em formato RPG: territórios do conhecimento, missões, domínio, revisão ativa e desafios aplicados.",
  icons: { icon: "/atlas-mark.svg", shortcut: "/atlas-mark.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
