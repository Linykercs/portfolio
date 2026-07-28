import Link from "next/link";

/**
 * ============================================================================
 * CARTÃO DE PROJETO
 * ============================================================================
 *
 * Usado pelas duas faixas da home, "Em produção" e "De ponta a ponta".
 *
 * O plano previa um componente para cada faixa. Viraram um só porque as duas
 * têm exatamente a mesma forma, e dois arquivos idênticos com nomes diferentes
 * só criam o risco de corrigir um e esquecer o outro.
 *
 * A ordem dos campos é a ordem em que um tech lead lê: o que era o problema,
 * o que foi decidido, com o quê, e onde ver. Começar pela tecnologia seria
 * começar pela parte que menos importa.
 * ============================================================================
 */

export type LinkDeProjeto = {
  rotulo: string;
  href: string;
  /** Rota interna do site. Sendo interna, usa `next/link` e não abre aba. */
  interno?: boolean;
};

export type NumeroDeProjeto = { valor: string; rotulo: string };

export type Projeto = {
  nome: string;
  /** Qual era o seu papel e quando. */
  papel: string;
  /** O problema, em uma linha. Sem isso o projeto vira lista de tecnologia. */
  problema: string;
  /** A decisão técnica que importa, e por quê. */
  decisao: string;
  ferramentas: readonly string[];
  numeros?: readonly NumeroDeProjeto[];
  /** Por que não há link, quando não há. Melhor que silêncio. */
  nota?: string;
  links: readonly LinkDeProjeto[];
};

const ESTILO_LINK =
  "font-mono text-xs uppercase tracking-[0.15em] text-neon underline decoration-linha underline-offset-4 transition-colors hover:decoration-neon focus-visible:decoration-neon";

export function CartaoProjeto({ projeto }: { projeto: Projeto }) {
  return (
    <article className="border-t border-linha py-10 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="text-2xl sm:text-3xl">{projeto.nome}</h3>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-fraco">
          {projeto.papel}
        </p>
      </div>

      <p className="mt-5 max-w-2xl leading-relaxed text-texto">{projeto.problema}</p>
      <p className="mt-3 max-w-2xl leading-relaxed text-fraco">{projeto.decisao}</p>

      {projeto.numeros ? (
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
          {projeto.numeros.map((numero) => (
            <div key={numero.rotulo}>
              <dt className="font-mono text-2xl tabular-nums text-neon">
                {numero.valor}
              </dt>
              <dd className="mt-0.5 text-xs text-fraco">{numero.rotulo}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
        {projeto.ferramentas.map((ferramenta) => (
          <li
            key={ferramenta}
            className="rounded border border-linha px-2.5 py-1 font-mono text-xs text-fraco"
          >
            {ferramenta}
          </li>
        ))}
      </ul>

      {projeto.links.length > 0 || projeto.nota ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {projeto.links.map((link) =>
            link.interno ? (
              <Link key={link.href} href={link.href} className={ESTILO_LINK}>
                {link.rotulo} →
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={ESTILO_LINK}
              >
                {link.rotulo} ↗
              </a>
            )
          )}

          {projeto.nota ? (
            <p className="font-mono text-xs text-fraco">{projeto.nota}</p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
