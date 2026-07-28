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
     * Alvo declarado: vaga de desenvolvedor full-stack júnior.
     * Decidido em 28/07/2026, junto com o Linyker.
     */
    titulo: "Desenvolvedor full-stack",
    /** A linha embaixo do nome. PENDENTE: o Linyker ainda vai revisar. */
    descricao:
      "Sustento uma plataforma B2B usada em campo na América Latina e construo do zero até o deploy.",
  },

  /* ======================================================================== */
  /* CONTATO                                                                  */
  /* ======================================================================== */
  contato: {
    email: "linyker02@gmail.com",
    linkedin: "https://www.linkedin.com/in/linyker-mendes-coelho-20068a34b/",
    github: "https://github.com/Linykercs",
    cidade: "Uberlândia, MG",
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
