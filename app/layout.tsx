import type { Metadata } from "next";
/**
 * TROCAR AS FONTES AQUI.
 * O `next/font` exige import estático, então a troca acontece nestas linhas.
 * Mantenha os nomes das variáveis (`--fonte-titulo`, `--fonte-corpo` e
 * `--fonte-mono`) e atualize `tema.fontes` em `config/conteudo.ts`, que serve
 * de referência.
 */
import { Anton, Geist, Geist_Mono } from "next/font/google";

import { conteudo } from "@/config/conteudo";
import { variaveisDeTema } from "@/lib/tema";

import "./globals.css";

// Anton tem um peso só, por isso o `weight` é obrigatório.
const fonteTitulo = Anton({
  variable: "--fonte-titulo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const fonteCorpo = Geist({
  variable: "--fonte-corpo",
  subsets: ["latin"],
  display: "swap",
});

const fonteMono = Geist_Mono({
  variable: "--fonte-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: conteudo.marca.nome,
  description: conteudo.marca.descricao,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      // As cores do config viram variáveis CSS aqui, e o Tailwind as consome.
      style={variaveisDeTema()}
      className={`${fonteTitulo.variable} ${fonteCorpo.variable} ${fonteMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
