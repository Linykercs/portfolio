/**
 * ============================================================================
 * CONTEÚDO E TEMA DO PORTFÓLIO
 * ============================================================================
 *
 * Tudo que é texto ou cor mora aqui. Nenhum componente escreve cor na mão.
 *
 * As cores viram variáveis CSS em `app/layout.tsx` e são consumidas pelo
 * Tailwind através do bloco `@theme inline` em `app/globals.css`. Trocar um
 * valor aqui repinta o site inteiro.
 * ============================================================================
 */

export const conteudo = {
  /* ======================================================================== */
  /* MARCA                                                                    */
  /* ======================================================================== */
  marca: {
    nome: "Linyker Mendes Coelho",
    /**
     * O que ocupa a tela no topo. O nome inteiro em Anton caixa alta não cabe
     * em largura de celular sem virar quatro linhas, então o display usa a
     * forma curta e o nome completo fica nos metadados e no rodapé.
     */
    exibicao: "Linyker",
    /**
     * Alvo declarado: vaga de desenvolvedor full-stack júnior (28/07/2026).
     * Em 18/11/2026 ganhou a parte de IA, para alinhar com o GitHub e o
     * LinkedIn, que já falam em aplicações com IA, sem tirar o full-stack.
     */
    titulo: "Desenvolvedor full-stack e de IA aplicada",
    /** A linha embaixo do nome. PENDENTE: o Linyker ainda vai revisar. */
    descricao:
      "Sustento uma plataforma B2B usada em campo na América Latina e construo do zero até o deploy.",
  },

  /* ======================================================================== */
  /* CONTATO                                                                  */
  /* ======================================================================== */
  contato: {
    email: "linyker02@gmail.com",
    linkedin: "https://www.linkedin.com/in/linyker-mendes-coelho/",
    github: "https://github.com/Linykercs",
    cidade: "Uberlândia, MG",
  },

  /* ======================================================================== */
  /* EM PRODUÇÃO                                                              */
  /* ======================================================================== */
  /**
   * Sistemas dos quais outras pessoas dependem. É a metade da página que
   * responde "ele aguenta produção?", que é a pergunta que separa quem já
   * quebrou algo no ar de quem só entregou trabalho de faculdade.
   */
  emProducao: {
    titulo: "Em produção",
    resumo:
      "Sistemas que outras pessoas usam todo dia, e que quebram de verdade quando eu erro.",
    itens: [
      {
        nome: "B2List",
        papel: "Suporte, desenvolvimento e QA · desde ago/2025",
        problema:
          "Plataforma B2B de força de vendas usada em campo na América Latina, com mais de 50 clientes ativos, entre eles Minerva Foods, P&G Latam e Hypera.",
        decisao:
          "Construí sozinho um pipeline em Python que integra PostgreSQL e Firebase, aplica as regras de negócio e publica dashboards HTML de monitoramento em execução agendada. No suporte, diagnostico e valido chamadas de API no Postman, em português, inglês e espanhol.",
        ferramentas: ["Python", "PostgreSQL", "Firebase", "MongoDB", "Postman"],
        /**
         * Sem link e sem print, e é de propósito: é código de cliente. Os nomes
         * das empresas aparecem porque o Linyker autorizou em 28/07/2026, e
         * porque já constam do currículo dele.
         */
        nota: "Código fechado, por ser de cliente.",
        links: [],
      },
      {
        /**
         * Versão pública liberada pelo Linyker em 18/11/2026, sem dados
         * pessoais. O demo usa dados fictícios gerados com a regra real de SLA.
         */
        nome: "Painel de incidentes",
        papel: "Feito no suporte da B2List · em uso desde jul/2026",
        problema:
          "O contrato cobra prazo de resolução por severidade, e a prova de cumprimento era montada à mão em planilha, toda semana, juntando duas listas do ClickUp.",
        decisao:
          "Um job no GitHub Actions lê as duas listas, calcula o prazo em horas úteis e grava no Firestore; o painel mostra o SLA por severidade e avisa no Google Chat quando um prazo está perto de estourar. Atende vários clientes, cada um no seu endereço, com o acesso decidido pelas regras do Firestore. Custo zero.",
        numeros: [
          { valor: "102", rotulo: "testes" },
          { valor: "R$ 0", rotulo: "de infraestrutura" },
        ],
        ferramentas: ["JavaScript", "Node.js", "Firebase", "Firestore", "GitHub Actions", "API do ClickUp"],
        links: [
          { rotulo: "demo", href: "https://linykercs.github.io/painel-incidentes/" },
          { rotulo: "código", href: "https://github.com/Linykercs/painel-incidentes" },
        ],
      },
      {
        nome: "Fluxo de Caixa",
        papel: "Projeto pessoal, no ar desde 2026",
        problema:
          "Controle financeiro que eu uso de verdade, com dados reais. Um erro aqui não gera bug, gera prejuízo.",
        decisao:
          "Self-hosted, sem plataforma paga. Fastify e Prisma no servidor, React e Vite numa PWA, bot do Telegram para lançar de qualquer lugar. Tem CI, backup diário e um healthcheck que avisa no Telegram quando o app cai e reconfigura o webhook sozinho quando a URL do túnel muda.",
        ferramentas: ["TypeScript", "Fastify", "Prisma", "SQLite", "React", "Vite", "PWA"],
        links: [
          { rotulo: "código", href: "https://github.com/Linykercs/fluxo-caixa" },
        ],
      },
    ],
  },

  /* ======================================================================== */
  /* COM IA                                                                   */
  /* ======================================================================== */
  /**
   * Projetos em que o LLM é parte do sistema, não um enfeite. A pergunta que
   * esta faixa responde é "ele sabe se o modelo está acertando?", por isso
   * cada cartão diz como a saída do modelo é conferida.
   *
   * Números do assistente-docs-rag: rodadas de evals de 18/11/2026 no GitHub
   * Actions, todas com o gpt-oss-120b como juiz. Estão linkadas no README.
   */
  comIa: {
    titulo: "Com IA",
    resumo: "LLM dentro do sistema, com a saída do modelo medida ou validada antes de valer.",
    itens: [
      {
        nome: "assistente-docs-rag",
        papel: "Projeto pessoal · nov/2026",
        problema:
          "Responder dúvidas sobre a API do Asaas sem inventar. Em documentação de pagamento, resposta errada custa caro.",
        decisao:
          "RAG com embeddings locais e pgvector. O modelo só usa os trechos recuperados, cita a fonte de cada afirmação e responde \"não sei\" quando a documentação não cobre. Uma suíte de evals no GitHub Actions mede retrieval, comportamento, citação e corretude, e foi ela que mostrou que o gargalo estava no contexto: com o trecho certo chegando ao modelo, a corretude dobrou sem trocar de modelo.",
        numeros: [
          { valor: "12", rotulo: "perguntas com gabarito" },
          { valor: "4", rotulo: "modelos, mesmo juiz" },
          { valor: "4 → 8", rotulo: "de 10 corretas, só ajustando o contexto" },
        ],
        ferramentas: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Docker", "GitHub Actions"],
        links: [
          { rotulo: "estudo de caso", href: "/assistente-docs-rag", interno: true },
          { rotulo: "código", href: "https://github.com/Linykercs/assistente-docs-rag" },
        ],
      },
      {
        nome: "Alfred",
        papel: "Em dupla, com Felipe Gandour",
        problema:
          "Registrar gasto em planilha é chato o bastante para ninguém fazer. Mandar \"gastei 50 no almoço\" no WhatsApp, todo mundo faz.",
        decisao:
          "Dois modelos em vez de um: um pequeno classifica a intenção de toda mensagem, e só a extração de valor, categoria e data paga pelo modelo maior. A saída vem em JSON e é conferida antes de gravar; se vier inválida, a mensagem é descartada com log em vez de sujar a planilha.",
        ferramentas: ["Node.js", "Groq", "Baileys", "Google Sheets", "React"],
        links: [{ rotulo: "código", href: "https://github.com/Linykercs/alfred-bot" }],
      },
    ],
  },

  /* ======================================================================== */
  /* DE PONTA A PONTA                                                         */
  /* ======================================================================== */
  /**
   * Projetos levados do nada até o deploy. A outra metade da história: além de
   * sustentar sistema, ele constrói do zero. É o que uma vaga full-stack
   * procura.
   *
   * Só o Plim tem código aberto. Os outros dois estão fechados por decisão do
   * Linyker, e a página diz isso em vez de deixar o leitor procurar um link
   * que não existe. Some o link, fica o motivo.
   */
  dePontaAPonta: {
    titulo: "De ponta a ponta",
    resumo: "Do arquivo vazio até estar rodando na mão de alguém.",
    itens: [
      {
        nome: "Plim",
        papel: "Desenvolvedor único",
        problema:
          "Criança de 5 a 11 anos em reabilitação pélvica abandona o tratamento porque exercício diário é chato e o progresso é invisível.",
        decisao:
          "App terapêutico feito com pós-graduandas em Estomaterapia do Hospital Israelita Albert Einstein. 22 telas, dois perfis separados para criança e responsável, minigames no lugar da planilha de exercício, e relatório em PDF para levar ao médico. Arquitetura offline-first, porque consultório e casa nem sempre têm rede.",
        ferramentas: ["TypeScript", "React Native", "Expo", "Zustand"],
        links: [{ rotulo: "código", href: "https://github.com/Linykercs/Plim" }],
      },
      {
        nome: "prospecta",
        papel: "Projeto pessoal",
        problema:
          "Achar negócios locais que ainda não têm site, para oferecer a eles a criação de um.",
        decisao:
          "A Google Places API resolveria, mas pede cartão de crédito mesmo na cota gratuita. Ficou OpenStreetMap, custo zero de verdade. São 146 testes, nenhum deles toca a rede, e um teste existe só para garantir isso.",
        numeros: [
          { valor: "146", rotulo: "testes" },
          { valor: "796", rotulo: "leads na última varredura" },
          { valor: "R$ 0", rotulo: "de custo" },
        ],
        ferramentas: ["Python", "OpenStreetMap", "pytest"],
        nota: "Código fechado por ora.",
        links: [{ rotulo: "estudo de caso", href: "/prospecta", interno: true }],
      },
      {
        nome: "LD Pecuária",
        papel: "Desenvolvedor único, para um cliente real",
        problema:
          "Gestão de rebanho e custo de formulação tocada numa planilha de Excel, com os números certos misturados aos errados.",
        decisao:
          "App de gestão levado da planilha ao ar, self-hosted, com login por Google e importação dos dados reais que já existiam na planilha.",
        ferramentas: ["Next.js", "Prisma", "PostgreSQL", "Auth.js", "Recharts"],
        nota: "Código e acesso fechados, por ser de cliente.",
        links: [],
      },
    ],
  },

  /* ======================================================================== */
  /* STACK                                                                    */
  /* ======================================================================== */
  /**
   * Sem barra de porcentagem. Ninguém consegue medir "78% de Python", e o
   * leitor técnico sabe disso: a barra inventada tira credibilidade do resto
   * da página em vez de somar.
   *
   * Só entra aqui o que aparece em algum projeto citado acima. É a mesma regra
   * do resto do site, afirmação com prova ao lado.
   */
  stack: {
    titulo: "Stack",
    grupos: [
      {
        rotulo: "Linguagens",
        itens: ["TypeScript", "JavaScript", "Python", "Java", "SQL"],
      },
      {
        rotulo: "Front",
        itens: ["React", "Next.js", "React Native", "Expo", "Tailwind", "Vite"],
      },
      {
        rotulo: "Back e dados",
        itens: [
          "Node.js",
          "Fastify",
          "Spring Boot",
          "FastAPI",
          "Prisma",
          "PostgreSQL",
          "pgvector",
          "MongoDB",
          "SQLite",
          "Firebase",
        ],
      },
      {
        rotulo: "Ferramentas",
        itens: ["Git", "Docker", "GitHub Actions", "pytest", "Postman", "APIs de LLM"],
      },
    ],
  },

  /* ======================================================================== */
  /* TEMA                                                                     */
  /* ======================================================================== */
  /**
   * Classes geradas: bg-fundo, bg-superficie, border-linha, text-neon,
   * text-quente, text-texto, text-fraco, e as variantes bg-/text-/border- de
   * cada uma.
   */
  tema: {
    cores: {
      /** Fundo da página. */
      fundo: "#07090B",
      /** Fundo de cartão, um degrau acima do fundo. */
      superficie: "#0E1114",
      /** Bordas e divisórias. */
      linha: "#1C2126",
      /** Destaque único. Toda ênfase da interface passa por aqui. */
      neon: "#B8FF3C",
      /**
       * Polo quente. Existe apenas dentro da imagem, para a transição
       * também trocar a temperatura da cor. Nunca usar na interface.
       */
      quente: "#FF7A2F",
      /** Texto principal. */
      texto: "#E2E7EA",
      /** Texto secundário. */
      fraco: "#8A9298",
    },
    /**
     * As fontes são carregadas com `next/font` em `app/layout.tsx`, que exige
     * import estático. Os nomes abaixo servem de referência do que está em uso.
     */
    fontes: {
      titulo: "Anton",
      corpo: "Geist",
      mono: "Geist Mono",
    },
  },
} as const;

export type Conteudo = typeof conteudo;
