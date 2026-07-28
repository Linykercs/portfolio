import { Contato } from "@/components/Contato";
import { Faixa } from "@/components/Faixa";
import { Stack } from "@/components/Stack";
import { Topo } from "@/components/Topo";
import { conteudo } from "@/config/conteudo";

/**
 * A HOME.
 *
 * Uma rota só, composta de seções. Todo o texto vem de `config/conteudo.ts`;
 * nenhum componente escreve conteúdo na mão. Trocar uma frase é editar um
 * arquivo de dados, não caçar JSX.
 *
 * Tudo aqui é Server Component. O único componente cliente do site é a lente,
 * lá dentro do topo.
 */
export default function Home() {
  const { emProducao, dePontaAPonta } = conteudo;

  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      <Topo />

      <Faixa
        id="em-producao"
        titulo={emProducao.titulo}
        resumo={emProducao.resumo}
        itens={emProducao.itens}
      />

      <Faixa
        id="de-ponta-a-ponta"
        titulo={dePontaAPonta.titulo}
        resumo={dePontaAPonta.resumo}
        itens={dePontaAPonta.itens}
      />

      <Stack />
      <Contato />
    </main>
  );
}
