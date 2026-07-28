import type { Metadata } from "next";
import Link from "next/link";

import { Codigo } from "@/components/Codigo";

/**
 * ESTUDO DE CASO DO PROSPECTA.
 *
 * A única página profunda do site. A home diz o que existe; esta aqui é a
 * conversa técnica, e é onde o candidato se separa dos outros.
 *
 * Regra que vale para todo texto daqui: número conferido ou nada. Todos os
 * dados citados abaixo saíram de rodar o projeto de verdade, não de memória.
 *
 *   146 testes .... `python -m pytest --collect-only`
 *   796 leads ..... linhas de `leads_regiao.csv`, última varredura da região
 *   586 sem end. .. contagem no mesmo arquivo, 74% do total
 *   49 com tel. ... contagem no mesmo arquivo, 6% do total
 *
 * O repositório é fechado por ora, então a prova mora aqui dentro, nos
 * trechos de código, em vez de num link para o GitHub.
 */

export const metadata: Metadata = {
  title: "prospecta, estudo de caso",
  description:
    "Como um prospector de negócios locais sem site foi construído com custo zero, " +
    "usando OpenStreetMap, e o que quebrou no caminho.",
};

/** Os números do topo. Cada um tem a origem anotada no comentário do arquivo. */
const NUMEROS = [
  { valor: "146", rotulo: "testes, nenhum toca a rede" },
  { valor: "796", rotulo: "leads na última varredura" },
  { valor: "R$ 0", rotulo: "de custo, sem chave de API" },
];

export default function Prospecta() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.2em] text-fraco transition-colors hover:text-neon focus-visible:text-neon"
      >
        ← voltar
      </Link>

      <h1 className="mt-10 text-5xl sm:text-7xl">prospecta</h1>

      <p className="mt-6 text-lg leading-relaxed text-texto">
        Uma ferramenta de linha de comando que acha negócios locais{" "}
        <strong className="font-normal text-neon">sem site</strong>, pontua cada
        um por prioridade e exporta um CSV com a mensagem de abordagem já
        escrita. Feita para prospectar clientes de criação de site em Patos de
        Minas e região.
      </p>

      <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded border border-linha sm:grid-cols-3">
        {NUMEROS.map((numero) => (
          <div key={numero.rotulo} className="bg-superficie px-5 py-4">
            <dt className="font-mono text-3xl tabular-nums text-neon">
              {numero.valor}
            </dt>
            <dd className="mt-1 text-sm text-fraco">{numero.rotulo}</dd>
          </div>
        ))}
      </dl>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">
        A decisão que definiu o projeto
      </h2>

      <p className="mt-6 leading-relaxed text-texto">
        O caminho óbvio era a Google Places API. Cobertura melhor, telefone
        quase sempre presente, documentação boa. Só que ela pede cartão de
        crédito mesmo para usar a cota gratuita, e o preço por consulta cresce
        conforme os campos pedidos.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A restrição do projeto era custo zero e nenhum cartão cadastrado. Isso
        eliminou a Places antes da primeira linha de código e deixou o
        OpenStreetMap: o Nominatim para achar a cidade, o Overpass para achar os
        negócios dentro dela. Sem chave, sem cadastro, sem fatura.
      </p>

      <Codigo origem="prospecta/buscar.py">{`
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# O Nominatim exige um User-Agent identificavel. Troque o contato pelo seu.
USER_AGENT = "prospecta/1.0 (prospeccao de leads locais; contato: ...)"
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        A conta dessa escolha veio depois, e é honesto mostrá-la: dos 796 leads
        da última varredura, apenas{" "}
        <strong className="font-normal text-neon">49 traziam telefone</strong>,
        6% do total. O OpenStreetMap é alimentado por voluntários, e telefone de
        comércio pequeno raramente é preenchido.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A resposta não foi trocar de fonte, foi mudar o que a ferramenta
        entrega. Cada lead sai do CSV com uma busca no Google e uma no Instagram
        já montadas para aquele nome e aquela cidade. Achar o telefone virou um
        clique em vez de uma pesquisa.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">
        A deduplicação que descartava lead calada
      </h2>

      <p className="mt-6 leading-relaxed text-texto">
        Um mesmo negócio aparece em mais de um nicho. Uma pizzaria casa com o
        filtro de <code className="font-mono text-neon">restaurante</code> e com
        o de <code className="font-mono text-neon">pizzaria</code>, e volta duas
        vezes com pontuações diferentes, porque cada consulta traz um conjunto
        diferente de campos preenchidos.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A primeira versão jogava tudo num dicionário por chave. Funcionava, e
        estava errada: quem chegava por último sobrescrevia quem já estava lá.
        Se o registro melhor vinha primeiro, ele sumia. Sem erro, sem aviso, sem
        nada no console. A contagem final fechava.
      </p>

      <Codigo origem="prospecta/buscar.py">{`
def remover_duplicados(leads: Sequence[Lead]) -> List[Lead]:
    """Remove leads repetidos, mantendo o de maior score."""
    melhores: Dict[Tuple[str, str], Lead] = {}
    for lead in leads:
        chave = _chave_duplicata(lead)
        atual = melhores.get(chave)
        if atual is None or lead.score > atual.score:
            melhores[chave] = lead
    return list(melhores.values())
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        A correção é a comparação de score, e o teste existe para que ninguém a
        remova por engano ao mexer em outra coisa. Ele monta o caso exato que
        quebrava: o mesmo negócio, escrito com caixa diferente, chegando por
        dois nichos, com o fraco na frente.
      </p>

      <Codigo origem="tests/test_buscar.py">{`
def test_remover_duplicados_mantem_o_maior_score():
    fraco = Lead(nome="Odonto Sorriso", categoria="clinica",
                 endereco="Rua A", score=60)
    forte = Lead(nome="odonto sorriso", categoria="dentist",
                 endereco="Rua A", score=95)
    resultado = remover_duplicados([fraco, forte])
    assert len(resultado) == 1
    assert resultado[0].score == 95
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        O que continua em aberto, e eu prefiro dizer a esconder: a chave é o par
        nome mais endereço, e{" "}
        <strong className="font-normal text-neon">
          586 dos 796 leads não têm endereço
        </strong>
        , 74% do total. Para três quartos dos dados, a chave é o nome sozinho.
        Duas lanchonetes com o mesmo nome em bairros diferentes ainda colidem, e
        uma delas é descartada.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        Resolver de verdade pede coordenada geográfica no critério, tratando
        como iguais só os que estiverem a poucos metros um do outro. Está
        mapeado, não está feito.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">
        Apanhando do Overpass sem derrubar a busca
      </h2>

      <p className="mt-6 leading-relaxed text-texto">
        O Overpass é gratuito e compartilhado por todo mundo. Ele responde 429
        quando você aperta, e 5xx quando está sobrecarregado. Varrer quinze
        nichos numa cidade é exatamente o tipo de uso que apanha.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A requisição tenta quatro vezes, com espera crescente entre elas, e
        trata 429 e 5xx como falha temporária em vez de deixar o{" "}
        <code className="font-mono text-neon">raise_for_status</code> matar a
        execução na hora.
      </p>

      <Codigo origem="prospecta/buscar.py">{`
for tentativa in range(1, tentativas + 1):
    try:
        resposta = sessao.request(metodo, url, headers=cabecalhos, **kwargs)
        if resposta.status_code == 429 or resposta.status_code >= 500:
            ultimo_erro = "servidor respondeu {}".format(resposta.status_code)
        else:
            resposta.raise_for_status()
            return resposta.json()
    except ValueError:
        ultimo_erro = "resposta nao veio em JSON valido"
    except requests.RequestException as erro:
        ultimo_erro = str(erro) or erro.__class__.__name__

    if tentativa < tentativas:
        time.sleep(pausa_base * tentativa)
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        As pausas são folgadas de propósito: cinco segundos de base, o que dá 5,
        10 e 15 segundos entre as tentativas, mais três segundos entre nichos.
        Uma varredura completa é lenta. É a escolha certa: o serviço é de graça
        e é de outra pessoa, e um bloqueio custa mais tempo do que a espera toda.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A parte que mais importa na prática não é o retry, é o que acontece
        quando ele desiste. Um nicho que falha não derruba os outros catorze.
        Ele é anotado, a busca segue, e no fim a ferramenta imprime o comando
        pronto para rodar de novo só o que faltou.
      </p>

      <Codigo origem="prospecta/buscar.py">{`
if falharam:
    avisar(
        "      {} nicho(s) sem resultado por falha no Overpass. "
        "Rode de novo so eles: --nichos {}".format(
            len(falharam), ",".join(falharam))
    )
`}</Codigo>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">
        O teste que proíbe os outros testes de usarem a internet
      </h2>

      <p className="mt-6 leading-relaxed text-texto">
        São 146 testes, todos com a sessão HTTP dublada. O risco de uma suíte
        assim não é ela falhar, é ela passar a tocar a rede sem ninguém
        perceber: um teste novo escrito com pressa, um dublê esquecido, e de
        repente a suíte fica lenta, falha sozinha quando a internet oscila, e
        consome cota de um serviço gratuito que não é meu.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        Por isso existe um teste cujo único trabalho é impedir isso. Ele
        substitui o método de requisição do{" "}
        <code className="font-mono text-neon">requests</code> por uma função que
        explode, e só então roda a busca inteira.
      </p>

      <Codigo origem="tests/test_buscar.py">{`
def test_buscar_leads_nao_usa_a_rede_de_verdade(monkeypatch):
    """Blindagem: qualquer chamada real ao requests quebra o teste."""

    def proibido(*_args, **_kwargs):
        raise AssertionError("o teste tentou acessar a rede")

    monkeypatch.setattr(requests.Session, "request", proibido)
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        Se alguém deixar escapar uma chamada de verdade no caminho testado, a
        suíte acusa com uma mensagem que diz exatamente o que aconteceu, em vez
        de um timeout misterioso meia hora depois.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">O que eu tiraria daqui</h2>

      <p className="mt-6 leading-relaxed text-texto">
        A restrição de custo zero não foi um obstáculo contornado, foi o que
        desenhou o projeto. Ela escolheu a fonte de dados, criou o problema do
        telefone faltando, e a solução do telefone virou uma funcionalidade que
        a versão com Google Places nunca teria: o CSV que já vem pronto para
        trabalhar, com link de WhatsApp e mensagem escrita.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        O bug de deduplicação ensinou a segunda: erro silencioso é pior que erro
        barulhento. Aquele não quebrava nada, não aparecia em log, e a contagem
        final fechava certinho. Só dava para achar comparando dois arquivos que
        deveriam ser iguais e não eram.
      </p>

      <Link
        href="/"
        className="mt-16 inline-block font-mono text-xs uppercase tracking-[0.2em] text-fraco transition-colors hover:text-neon focus-visible:text-neon"
      >
        ← voltar
      </Link>
    </main>
  );
}
