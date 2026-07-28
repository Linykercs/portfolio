import { conteudo } from "@/config/conteudo";

/**
 * A stack, em lista agrupada.
 *
 * Sem barra de progresso e sem porcentagem: ninguém mede "78% de Python", e o
 * leitor técnico sabe disso. Um número inventado aqui põe em dúvida os números
 * verdadeiros do resto da página, que é o custo mais caro possível.
 */
export function Stack() {
  const { stack } = conteudo;

  return (
    <section id="stack" aria-labelledby="stack-titulo" className="mt-28 sm:mt-40">
      <h2 id="stack-titulo" className="text-4xl sm:text-6xl">
        {stack.titulo}
      </h2>

      <dl className="mt-12 flex flex-col gap-px overflow-hidden rounded border border-linha">
        {stack.grupos.map((grupo) => (
          <div
            key={grupo.rotulo}
            className="flex flex-col gap-3 bg-superficie px-5 py-5 sm:flex-row sm:gap-8"
          >
            <dt className="font-mono text-xs uppercase tracking-[0.15em] text-fraco sm:w-36 sm:shrink-0 sm:pt-1">
              {grupo.rotulo}
            </dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-2 text-texto">
              {grupo.itens.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
