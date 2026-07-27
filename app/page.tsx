import { conteudo } from "@/config/conteudo";

/**
 * PÁGINA TEMPORÁRIA DE VERIFICAÇÃO, fase 1.
 *
 * Existe só para provar que o tema e a tipografia estão ligados de ponta a
 * ponta. Será substituída pelo conteúdo real na fase 4.
 *
 * O que ela verifica:
 *   - Anton nos títulos, Geist no corpo, Geist Mono nos rótulos
 *   - cada cor do config chegando ao Tailwind como classe utilitária
 *   - o valor em hex ao lado, para comparar com o que está pintado
 */

/** Amostras, com a classe do Tailwind ao lado da chave do config. */
const AMOSTRAS = [
  { chave: "fundo", classe: "bg-fundo" },
  { chave: "superficie", classe: "bg-superficie" },
  { chave: "linha", classe: "bg-linha" },
  { chave: "neon", classe: "bg-neon" },
  { chave: "quente", classe: "bg-quente" },
  { chave: "texto", classe: "bg-texto" },
  { chave: "fraco", classe: "bg-fraco" },
] as const;

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">
        Fase 1 · verificação de base
      </p>

      <h1 className="mt-6 text-6xl sm:text-8xl">{conteudo.marca.nome}</h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-fraco">
        Este parágrafo está em Geist e o título acima em Anton. Se as duas
        fontes parecerem iguais, o <code className="font-mono text-neon">next/font</code>{" "}
        não carregou e o navegador caiu na fonte do sistema.
      </p>

      <h2 className="mt-16 text-2xl">Cores vindas do config</h2>

      <ul className="mt-6 flex flex-col gap-px overflow-hidden rounded border border-linha">
        {AMOSTRAS.map((amostra) => (
          <li
            key={amostra.chave}
            className="flex items-center gap-5 bg-superficie px-5 py-4"
          >
            <span
              className={`${amostra.classe} size-10 shrink-0 rounded border border-linha`}
              aria-hidden="true"
            />
            <span className="font-mono text-sm text-texto">{amostra.chave}</span>
            <span className="font-mono text-sm text-fraco">{amostra.classe}</span>
            <span className="ml-auto font-mono text-sm tabular-nums text-fraco">
              {conteudo.tema.cores[amostra.chave]}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-fraco">
        O quadrado é pintado pela classe do Tailwind. O código ao lado vem
        direto do arquivo de configuração. Se os dois combinarem, a ligação
        entre config, variável CSS e Tailwind está funcionando.
      </p>
    </main>
  );
}
