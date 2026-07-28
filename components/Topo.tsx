import { Lente } from "@/components/Lente";
import { conteudo } from "@/config/conteudo";
import robo from "@/public/imagens/linyker-robo.png";
import foto from "@/public/imagens/linyker.jpg";

/**
 * ============================================================================
 * TOPO
 * ============================================================================
 *
 * Os primeiros trinta segundos da visita. Precisa responder quem é, o que faz
 * e onde ver o código, sem que o leitor role a página.
 *
 * O nome usa `clamp` em vez de degraus de breakpoint porque Anton em caixa
 * alta é largo, e "LINYKER" a 12% da largura da tela estoura em 360px se o
 * tamanho não puder encolher continuamente.
 *
 * A lente fica do lado do nome no computador e embaixo no celular. No celular
 * ela vem DEPOIS do texto na ordem do documento, então quem usa leitor de tela
 * ouve o nome e a função antes de chegar numa imagem decorada.
 * ============================================================================
 */

const ESTILO_LINK =
  "font-mono text-xs uppercase tracking-[0.2em] text-texto underline decoration-linha underline-offset-8 transition-colors hover:text-neon hover:decoration-neon focus-visible:text-neon focus-visible:decoration-neon";

export function Topo() {
  const { marca, contato } = conteudo;

  return (
    <header className="flex flex-col gap-14 pt-16 sm:pt-24 lg:flex-row lg:items-center lg:gap-16">
      <div className="lg:flex-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">
          {marca.titulo}
        </p>

        <h1 className="mt-5 text-[clamp(3.5rem,13vw,9rem)] leading-[0.85] text-balance">
          {marca.exibicao}
        </h1>

        <p className="mt-8 max-w-lg text-lg leading-relaxed text-fraco text-pretty">
          {marca.descricao}
        </p>

        <nav aria-label="Perfis" className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <a href={contato.github} target="_blank" rel="noreferrer" className={ESTILO_LINK}>
            GitHub ↗
          </a>
          <a href={contato.linkedin} target="_blank" rel="noreferrer" className={ESTILO_LINK}>
            LinkedIn ↗
          </a>
        </nav>
      </div>

      <Lente
        foto={foto}
        robo={robo}
        alt={`${marca.nome}, retrato`}
        className="w-full max-w-xs self-start rounded sm:max-w-sm lg:max-w-[22rem] lg:self-auto"
      />
    </header>
  );
}
