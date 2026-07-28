# portfolio

Portfólio do Linyker Mendes Coelho.

**No ar:** https://linykercs.github.io/portfolio

Next.js 16 com App Router, TypeScript e Tailwind 4, exportado como site
estático e publicado no GitHub Pages por GitHub Actions.

## Como rodar

```bash
npm install
npm run dev
```

O site abre em http://localhost:3000/portfolio, e não na raiz, porque o
`basePath` vale também em desenvolvimento.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run conferir` | Confere o prefixo de caminho no HTML gerado |
| `npm run imagens:recortar` | Recorta a foto de perfil |
| `npm run imagens:robo` | Gera a versão neon da foto |

## Decisões que valem a leitura

**Todo o conteúdo vive em `config/conteudo.ts`.** Nenhum componente escreve
texto ou cor na mão. Trocar uma frase ou repintar o site inteiro é editar um
arquivo de dados.

**A lente é o único componente cliente.** Ela empilha duas imagens e recorta a
de cima num círculo que segue o ponteiro. A posição é escrita direto no `style`
por um `ref`, sem passar por estado do React, porque estado redesenharia o
componente sessenta vezes por segundo para mudar uma string de CSS. As medidas
são percentuais, então a lente acompanha qualquer tamanho de tela sem ouvinte
de `resize`. E a suavização usa o tempo decorrido, não uma fração fixa por
quadro, senão a velocidade ficaria amarrada à taxa de atualização do monitor.
Detalhes em `components/Lente.tsx`.

**A versão neon da foto é gerada em código**, por detecção de borda, a partir da
mesma imagem já recortada. Sair da mesma imagem garante que as duas tenham
enquadramento idêntico por construção: qualquer diferença de ângulo viraria um
salto visível quando a lente passasse. O script roda uma vez, na mão, e o
resultado é commitado, para o build não depender de biblioteca de imagem.

**`npm run conferir` existe por causa de um bug antigo.** O site mora numa
subpasta, então todo caminho absoluto precisa do prefixo `/portfolio`. Um
caminho sem o prefixo aponta para a raiz do domínio e vira 404, mas o build
passa, o deploy passa, e só quem visita descobre. O script varre o HTML gerado e
transforma esse erro silencioso em build vermelho. Roda no CI antes de publicar.

## Estudo de caso

A rota [`/prospecta`](https://linykercs.github.io/portfolio/prospecta) é a
página profunda do site: uma decisão de custo que desenhou um projeto inteiro,
um bug de deduplicação que descartava dados sem avisar, e um teste cujo único
trabalho é impedir que os outros testes usem a internet.
