import type { Metadata } from "next";
import "./globals.css";
import "./rpg-world.css";

export const metadata: Metadata = {
  title: "ATLAS Academy — Knowledge & Operations",
  description: "Academia pessoal multidisciplinar com cursos progressivos, aprendizagem ativa, simulações, ferramentas de campo e engenharia aplicada.",
  icons: { icon: "/atlas-mark.svg", shortcut: "/atlas-mark.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><a className="skip-to-content" href="#main-content">Pular para o conteúdo</a>{children}</body>
    </html>
  );
}
