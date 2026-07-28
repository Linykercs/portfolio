import { CartaoProjeto, type Projeto } from "@/components/CartaoProjeto";

/**
 * Uma seção da home: título, uma linha de resumo, e os cartões.
 *
 * O título vai num `h2` e o nome de cada projeto num `h3`, para a página ter
 * uma hierarquia navegável por leitor de tela, e não só uma sequência de texto
 * grande.
 */
export type FaixaProps = {
  id: string;
  titulo: string;
  resumo: string;
  itens: readonly Projeto[];
};

export function Faixa({ id, titulo, resumo, itens }: FaixaProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="mt-28 sm:mt-40">
      <h2 id={`${id}-titulo`} className="text-4xl sm:text-6xl">
        {titulo}
      </h2>
      <p className="mt-4 max-w-xl leading-relaxed text-fraco">{resumo}</p>

      <div className="mt-12">
        {itens.map((item) => (
          <CartaoProjeto key={item.nome} projeto={item} />
        ))}
      </div>
    </section>
  );
}
