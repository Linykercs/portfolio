import { conteudo } from "@/config/conteudo";

/**
 * Contato e rodapé.
 *
 * Sem formulário, de propósito. Formulário num site estático exige serviço de
 * terceiro para receber o envio, e o recrutador que quer falar com você abre o
 * e-mail dele de qualquer jeito. Um `mailto` e o LinkedIn resolvem, sem
 * dependência, sem backend e sem campo para robô preencher.
 */
const ESTILO_LINK =
  "underline decoration-linha underline-offset-8 transition-colors hover:text-neon hover:decoration-neon focus-visible:text-neon focus-visible:decoration-neon";

export function Contato() {
  const { contato, marca } = conteudo;
  const ano = 2026;

  return (
    <>
      <section
        id="contato"
        aria-labelledby="contato-titulo"
        className="mt-28 sm:mt-40"
      >
        <h2 id="contato-titulo" className="text-4xl sm:text-6xl">
          Contato
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fraco">
          Procurando vaga de {marca.titulo.toLowerCase()}. Se fizer sentido
          conversar, me chama.
        </p>

        <ul className="mt-10 flex flex-col gap-4 text-lg text-texto">
          <li>
            <a href={`mailto:${contato.email}`} className={ESTILO_LINK}>
              {contato.email}
            </a>
          </li>
          <li>
            <a
              href={contato.linkedin}
              target="_blank"
              rel="noreferrer"
              className={ESTILO_LINK}
            >
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a
              href={contato.github}
              target="_blank"
              rel="noreferrer"
              className={ESTILO_LINK}
            >
              GitHub ↗
            </a>
          </li>
        </ul>
      </section>

      <footer className="mt-28 border-t border-linha pt-8 pb-16 font-mono text-xs text-fraco sm:mt-40">
        <p>
          {marca.nome} · {contato.cidade} · {ano}
        </p>
      </footer>
    </>
  );
}
