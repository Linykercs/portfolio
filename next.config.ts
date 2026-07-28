import type { NextConfig } from "next";

/**
 * ============================================================================
 * PUBLICAÇÃO
 * ============================================================================
 *
 * O site é estático e mora numa SUBPASTA: `linykercs.github.io/portfolio`.
 *
 * Por que subpasta, e não a raiz: o repositório de usuário
 * `linykercs.github.io` já está ocupado pelo site da Clínica Flávia Franco,
 * publicado e no ar. Usar a raiz derrubaria aquele site.
 *
 * Consequência: tudo que é caminho absoluto precisa do prefixo `/portfolio`,
 * senão vira 404. É o que `basePath` e `assetPrefix` resolvem para as rotas,
 * o CSS e o JavaScript.
 *
 * A ARMADILHA DAS IMAGENS
 *
 * `images.unoptimized` NÃO aplica o `basePath` ao `src` quando a imagem é
 * referenciada por caminho em texto, tipo `src="/imagens/foo.jpg"`. Foi
 * exatamente assim que todas as imagens quebraram no projeto da clínica.
 *
 * A defesa aqui é não usar caminho em texto: as imagens entram por importação
 * estática (`import foto from "@/public/imagens/linyker.jpg"`), e aí quem monta
 * a URL é o bundler, que já conhece o `assetPrefix`. Quem confirma isso a cada
 * build é `scripts/conferir-prefixo.mjs`, que varre o HTML gerado.
 *
 * SAÍDA, se um dia quiser a URL limpa: domínio próprio apontado para o Pages
 * dispensa o `basePath` e não encosta no site da clínica.
 * ============================================================================
 */

const BASE = "/portfolio";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE,
  assetPrefix: BASE,
  images: {
    // Não existe servidor para otimizar imagem sob demanda num site estático.
    unoptimized: true,
  },
};

export default nextConfig;
