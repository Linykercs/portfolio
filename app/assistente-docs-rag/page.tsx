import type { Metadata } from "next";
import Link from "next/link";

import { Codigo } from "@/components/Codigo";

/**
 * ESTUDO DE CASO DO ASSISTENTE-DOCS-RAG.
 *
 * Mesma regra do estudo de caso do prospecta: número conferido ou nada.
 *
 *   12 perguntas ........ evals/perguntas.yaml (10 com resposta, 1 fora do
 *                         recorte, 1 ambígua)
 *   6/12 → 11/12 ........ comportamento antes e depois do ajuste no prompt,
 *                         runs 43313365653 e 43320325472
 *   5/12 e 8/12 ......... duas execuções idênticas antes da temperatura 0
 *   tabela de modelos ... runs de 18/11/2026: 44221757445 (qwen2.5:3b),
 *                         44218473254 (gpt-oss-20b), 44223197754
 *                         (qwen3.8-27b), 44222132909 (gpt-oss-120b), todas com
 *                         o gpt-oss-120b como juiz
 *   10/12 casos pulados . run 44217760514, Gemini recusando o campo seed
 *   tabela de contexto .. gpt-oss-20b com juiz gpt-oss-120b, top_k 6
 *                         (44235001930), 10 (44235997544) e 15 (44237238393):
 *                         context hit 5, 8, 8 e corretude 4, 8, 9 de 10
 *   híbrida e prompt .... 14 perguntas, top_k 10: vetorial 44346040496
 *                         (comportamento 12/14, contexto 9/11), híbrida
 *                         44348116327 (contexto 7/11), vetorial + prompt
 *                         44351053018 (comportamento 13/14, corretude 8/11)
 *   expansão ............ mesma branch: desligada 44359162190 (contexto 9/11,
 *                         corretude 6/11), 3 melhores 44361703035 (contexto
 *                         10/11, corretude 8/11); 8 e 6 com a mesma config
 *
 * Os trechos de código são cópia do repositório, só encurtados.
 */

export const metadata: Metadata = {
  title: "assistente-docs-rag, estudo de caso",
  description:
    "Um assistente com RAG para a documentação da API do Asaas, e como as evals " +
    "mostraram que o gargalo estava no contexto, não no modelo.",
};

const NUMEROS = [
  { valor: "12", rotulo: "perguntas com gabarito" },
  { valor: "4", rotulo: "modelos, corrigidos pelo mesmo juiz" },
  { valor: "4 → 8", rotulo: "de 10 corretas, só ajustando o contexto" },
];

const CONTEXTO = [
  { topK: "6", contexto: "5/10", corretude: "4/10" },
  { topK: "10", contexto: "8/10", corretude: "8/10" },
  { topK: "15", contexto: "8/10", corretude: "9/10" },
];

const MODELOS = [
  { modelo: "qwen2.5:3b (CPU)", comportamento: "9/11", citacao: "7/7", corretude: "2/9" },
  { modelo: "gpt-oss-20b", comportamento: "12/12", citacao: "10/10", corretude: "5/10" },
  { modelo: "qwen3.8-27b", comportamento: "12/12", citacao: "10/10", corretude: "5/10" },
  { modelo: "gpt-oss-120b", comportamento: "11/12", citacao: "11/11", corretude: "6/10" },
];

export default function AssistenteDocsRag() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.2em] text-fraco transition-colors hover:text-neon focus-visible:text-neon"
      >
        ← voltar
      </Link>

      <h1 className="mt-10 break-words text-5xl sm:text-7xl">assistente-docs-rag</h1>

      <p className="mt-6 text-lg leading-relaxed text-texto">
        Você pergunta em português, por exemplo &quot;como crio uma cobrança via
        Pix?&quot;, e recebe uma resposta baseada{" "}
        <strong className="font-normal text-neon">só</strong> na documentação
        pública do Asaas, com o link de cada página usada. O recorte atual cobre
        autenticação, cobranças por Pix e boleto, e webhooks.
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
      <h2 className="mt-20 text-2xl sm:text-3xl">O modelo não escolhe as fontes</h2>

      <p className="mt-6 leading-relaxed text-texto">
        A documentação vira trechos cortados pelos títulos de cada página, os
        trechos viram vetores com um modelo de embeddings que roda na própria
        máquina, e tudo vai para o PostgreSQL com pgvector. Na pergunta, os dez
        trechos mais próximos viram o contexto, e o LLM responde só com base
        neles. Eram seis; mais abaixo está por que mudou.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        Em documentação de pagamento, um link inventado faz alguém integrar
        errado. Por isso a resposta vem em formato estruturado, com o status e
        os ids dos trechos citados em campos próprios, e a API monta a lista de
        fontes a partir desses ids. Um id que não estava no contexto é
        descartado, então o modelo não tem como devolver uma URL que não foi
        recuperada.
      </p>

      <Codigo origem="src/assistente_docs/rag/prompt.py">{`
class AnswerDraft(BaseModel):
    status: AnswerStatus  # answered, no_answer ou needs_clarification
    answer: str           # texto em português, com citações [n]
    cited_ids: list[int]  # ids dos trechos citados
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        &quot;Não sei&quot; é uma resposta válida. Perguntar como emitir nota
        fiscal pela API devolve{" "}
        <code className="font-mono text-neon">no_answer</code>, porque esse
        assunto não está na base. Perguntar &quot;meu pagamento não apareceu, o
        que faço?&quot; devolve um pedido de contexto (Pix ou boleto? sandbox ou
        produção?) em vez de um chute.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">
        Doze perguntas com gabarito, rodando no CI
      </h2>

      <p className="mt-6 leading-relaxed text-texto">
        Cada pergunta da suíte tem a resposta esperada, a página onde ela está e
        se a documentação responde ou não. O workflow sobe um Postgres, ingere a
        documentação, faz as perguntas e mede quatro coisas: se a página certa
        foi recuperada, se o assistente fez o que devia (responder, recusar ou
        pedir contexto), se citou fonte e, com um LLM como juiz, se a resposta
        está correta.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A primeira rodada achou um problema de prompt. O assistente pedia
        esclarecimento em 6 das 10 perguntas que a documentação respondia, porque
        os exemplos da regra (forma de pagamento, ambiente, webhook) cabiam em
        quase qualquer pergunta sobre pagamentos. Com responder virando o caso
        padrão, o comportamento foi de{" "}
        <strong className="font-normal text-neon">6/12 para 11/12</strong>, sem
        perder a recusa nem o pedido de contexto.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        Antes de comparar, rodei a mesma versão duas vezes e o comportamento deu
        5/12 numa e 8/12 na outra. Com essa variação, qualquer melhoria de três
        pontos podia ser sorte. A suíte passou a rodar com temperatura 0 e seed
        fixa, e só depois disso as comparações começaram a valer.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">Quatro modelos, um juiz</h2>

      <p className="mt-6 leading-relaxed text-texto">
        Na primeira rodada, o mesmo modelo de 3B gerava as respostas e dava a
        nota. Para comparar modelos, o juiz precisava ser fixo, então ele ganhou
        configuração própria e passou a rodar em outro provedor. Todos os
        modelos abaixo foram corrigidos pelo gpt-oss-120b, com as mesmas 12
        perguntas e temperatura 0.
      </p>

      <div className="mt-8 overflow-x-auto rounded border border-linha">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-superficie font-mono text-xs uppercase tracking-[0.1em] text-fraco">
            <tr>
              <th scope="col" className="px-4 py-3 font-normal">Modelo</th>
              <th scope="col" className="px-4 py-3 font-normal">Comportamento</th>
              <th scope="col" className="px-4 py-3 font-normal">Citação</th>
              <th scope="col" className="px-4 py-3 font-normal">Corretude</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {MODELOS.map((linha) => (
              <tr key={linha.modelo} className="border-t border-linha">
                <th scope="row" className="px-4 py-3 font-normal text-texto">
                  {linha.modelo}
                </th>
                <td className="px-4 py-3 text-fraco">{linha.comportamento}</td>
                <td className="px-4 py-3 text-fraco">{linha.citacao}</td>
                <td className="px-4 py-3 text-neon">{linha.corretude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-fraco">
        O gpt-oss-120b foi juiz da própria rodada, o que pode favorecê-lo. Na
        rodada do 3B um caso estourou o tempo e ficou de fora.
      </p>

      <p className="mt-6 leading-relaxed text-texto">
        De 3B para 20B a corretude mais que dobra. De 20B para 120B, o ganho é
        de uma pergunta. E quatro perguntas falham{" "}
        <strong className="font-normal text-neon">em todos os modelos</strong>,
        mesmo com a página certa recuperada. O juiz aponta omissões: na
        autenticação, faltam os headers{" "}
        <code className="font-mono text-neon">User-Agent</code> e{" "}
        <code className="font-mono text-neon">Content-Type</code>; no Pix, falta
        a chamada que busca o QR Code.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A explicação mais provável está na própria métrica de retrieval. Ela
        confere a página, e uma página tem vários trechos.
      </p>

      <Codigo origem="src/assistente_docs/evals/scoring.py">{`
if case.fonte.strip():
    expected_url = normalize_url(case.fonte)
    retrieval_hit = any(
        normalize_url(url) == expected_url for url in retrieved_urls
    )
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        A página entra no contexto, mas o trecho com o detalhe pode ficar fora
        dos seis mais próximos. Nesse caso, um modelo maior não tem como
        responder o que não recebeu.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">Mais contexto, mesmo modelo</h2>

      <p className="mt-6 leading-relaxed text-texto">
        Para testar isso, cada pergunta ganhou uma lista de termos que precisam
        chegar ao modelo para a resposta ser possível, como{" "}
        <code className="font-mono text-neon">User-Agent</code> e{" "}
        <code className="font-mono text-neon">pixQrCode</code>. Conferi cada
        termo no texto da página depois da limpeza, para a métrica não medir um
        erro meu. A métrica nova diz se todos estão nos trechos recuperados.
      </p>

      <Codigo origem="src/assistente_docs/evals/scoring.py">{`
def missing_from_context(terms, answer):
    context = "\\n".join(
        item.chunk.content for item in answer.retrieved
    ).casefold()
    return [t for t in terms if t.casefold() not in context]
`}</Codigo>

      <p className="mt-6 leading-relaxed text-texto">
        Com seis trechos, a página certa vinha nas dez perguntas, mas o trecho
        com a resposta{" "}
        <strong className="font-normal text-neon">só em cinco</strong>. As
        quatro perguntas que falhavam em todos os modelos estavam entre elas.
        Depois disso, mudei só a quantidade de trechos, com o mesmo modelo de 20B
        e o mesmo juiz.
      </p>

      <div className="mt-8 overflow-x-auto rounded border border-linha">
        <table className="w-full min-w-[24rem] text-left text-sm">
          <thead className="bg-superficie font-mono text-xs uppercase tracking-[0.1em] text-fraco">
            <tr>
              <th scope="col" className="px-4 py-3 font-normal">Trechos</th>
              <th scope="col" className="px-4 py-3 font-normal">Termos no contexto</th>
              <th scope="col" className="px-4 py-3 font-normal">Corretude</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {CONTEXTO.map((linha) => (
              <tr key={linha.topK} className="border-t border-linha">
                <th scope="row" className="px-4 py-3 font-normal text-texto">
                  {linha.topK}
                </th>
                <td className="px-4 py-3 text-fraco">{linha.contexto}</td>
                <td className="px-4 py-3 text-neon">{linha.corretude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 leading-relaxed text-texto">
        Com dez trechos, a corretude{" "}
        <strong className="font-normal text-neon">dobrou, de 4 para 8</strong>,
        sem trocar de modelo. Trocar o 20B pelo 120B tinha rendido uma pergunta.
        O padrão do projeto passou de 6 para 10. Com 15, o contexto recuperado é
        o mesmo, e a pergunta a mais veio de uma que continuou sem o trecho
        certo, então é variação do modelo.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        Teve custo. Com mais contexto, a pergunta ambígua (&quot;meu pagamento
        não apareceu&quot;) passou a ser respondida em vez de gerar um pedido de
        contexto, e a resposta sugeriu um endpoint fora dos trechos. Um ajuste
        no prompt proibiu sugestão fora dos trechos, mesmo com
        &quot;normalmente&quot;, e separou relato de problema específico de
        relato vago. O comportamento voltou a 13 de 14, sem perder corretude.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">O teste que piorou</h2>

      <p className="mt-6 leading-relaxed text-texto">
        Duas perguntas ainda não recebem o trecho certo, e a aposta óbvia era
        busca híbrida: somar busca por palavras, com o full-text do próprio
        Postgres, à vetorial. Medi, e o trecho certo passou a chegar em{" "}
        <strong className="font-normal text-neon">7 de 11</strong> perguntas,
        contra 9 só com a vetorial.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A pergunta &quot;quais eventos existem para cobranças?&quot; explica. Os
        termos que faltavam no contexto, como{" "}
        <code className="font-mono text-neon">PAYMENT_CREATED</code>, não estão
        na pergunta, então a busca por palavras não tem o que procurar, e
        palavras comuns como &quot;webhook&quot; puxam trechos genéricos. O
        código ficou, desligado. O problema dessas duas perguntas é o chunking,
        que quebra a lista de eventos em três seções.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">Buscar pequeno, responder grande</h2>

      <p className="mt-6 leading-relaxed text-texto">
        Trechos maiores não resolviam: o modelo de embeddings corta o texto em
        512 tokens, e a busca perderia precisão. A saída foi separar as duas
        coisas. A busca continua com trechos pequenos, e os três mais bem
        colocados levam junto os vizinhos na página e o resto da sua seção, até
        6.000 caracteres. Para isso, cada trecho passou a guardar a posição na
        página.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A lista de eventos passou a chegar inteira, e o contexto certo subiu de
        9 para{" "}
        <strong className="font-normal text-neon">10 de 11</strong> perguntas.
        A resposta da lista ainda erra, por outro motivo: com todos os eventos
        à mão, o modelo resume e deixa os de estorno de fora.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        Essa rodada também mostrou um limite da própria medição. A mesma
        configuração, rodada em dois dias, deu 8 e 6 de 11 corretas: mesmo com
        temperatura 0, o provedor não devolve sempre a mesma resposta. O
        contexto recuperado não varia, então os ganhos medidos nele valem. Para
        comparar corretude com 11 perguntas, uma rodada só não basta.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">O bug que a comparação achou</h2>

      <p className="mt-6 leading-relaxed text-texto">
        A primeira rodada com o Gemini como juiz pulou 10 dos 12 casos. O
        adaptador mandava o campo{" "}
        <code className="font-mono text-neon">seed</code> sempre que havia
        temperatura, o Ollama e o Groq aceitam, e o Gemini responde HTTP 400. O
        erro existia desde a mudança da temperatura 0, e nenhuma rodada com
        Gemini tinha passado depois dela.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A correção separou o seed da temperatura, e o juiz em outro provedor
        parou de herdar configurações do provedor das respostas. Ficou um teste
        para o caso exato: Ollama respondendo com seed, Gemini corrigindo sem.
      </p>

      {/* ==================================================================== */}
      <h2 className="mt-20 text-2xl sm:text-3xl">O que eu tiraria daqui</h2>

      <p className="mt-6 leading-relaxed text-texto">
        Sem a suíte, a conclusão óbvia seria trocar por um modelo maior. Com
        ela, o modelo maior rendeu uma pergunta, e mandar o trecho certo para o
        modelo que já estava ali rendeu quatro.
      </p>

      <p className="mt-4 leading-relaxed text-texto">
        A outra lição veio antes da primeira comparação: duas execuções iguais
        deram notas diferentes. Medir só passou a servir depois que o ruído saiu
        da conta.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          href="https://github.com/Linykercs/assistente-docs-rag"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs uppercase tracking-[0.15em] text-neon underline decoration-linha underline-offset-4 transition-colors hover:decoration-neon focus-visible:decoration-neon"
        >
          código e execuções ↗
        </a>
      </div>

      <Link
        href="/"
        className="mt-16 inline-block font-mono text-xs uppercase tracking-[0.2em] text-fraco transition-colors hover:text-neon focus-visible:text-neon"
      >
        ← voltar
      </Link>
    </main>
  );
}
