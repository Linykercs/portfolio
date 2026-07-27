import type { CSSProperties } from "react";

import { conteudo } from "@/config/conteudo";

/**
 * Transforma as cores de `config/conteudo.ts` em variáveis CSS.
 *
 * O resultado é aplicado na tag `<html>` pelo layout, e o Tailwind consome
 * essas variáveis pelo bloco `@theme inline` em `app/globals.css`. Assim as
 * cores ficam em um lugar só, o arquivo de conteúdo.
 */
export function variaveisDeTema(): CSSProperties {
  const entradas = Object.entries(conteudo.tema.cores).map(([nome, valor]) => [
    `--cor-${nome}`,
    valor,
  ]);

  return Object.fromEntries(entradas) as CSSProperties;
}
