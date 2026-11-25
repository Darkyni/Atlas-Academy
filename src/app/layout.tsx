import type { Metadata } from "next";
import "./globals.css";
import "./atlas-academic.css";

export const metadata: Metadata = {
  title: "ATLAS Academy — Academia Pessoal",
  description: "Academia pessoal multidisciplinar para estudo, pesquisa, pensamento crítico e aplicação prática.",
  icons: { icon: "/atlas-mark.svg", shortcut: "/atlas-mark.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><a className="skip-to-content" href="#main-content">Pular para o conteúdo</a>{children}</body>
    </html>
  );
}
