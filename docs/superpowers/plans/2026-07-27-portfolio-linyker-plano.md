# Portfólio do Linyker, plano de implementação

Data: 27/07/2026
Spec: `docs/superpowers/specs/2026-07-27-portfolio-linyker-design.md`

## Ordem e dependências

As fases 1 a 3 não dependem de nenhuma informação que falta, então começam já. A fase 4 depende das respostas da lista "A confirmar" da spec, e por isso vem depois, mesmo sendo a mais visível.

```
1 base ──▶ 2 imagens ──▶ 3 lente ──▶ 5 estudo de caso ──▶ 6 CI ──▶ 7 verificação
                                  ╲
                                   ╲── 4 conteúdo (depende das respostas)
```

---

## Fase 1, base do projeto

**Objetivo:** projeto de pé, com tema e tipografia funcionando, sem conteúdo nenhum.

1. Scaffold com `create-next-app`, mesmas flags do projeto da clínica: TypeScript, Tailwind, App Router, sem `src/`, alias `@/*`
2. Ler `node_modules/next/dist/docs/` antes de escrever código, como no projeto da clínica. O `AGENTS.md` gerado avisa que a versão tem mudanças de comportamento
3. `config/conteudo.ts` com a estrutura tipada e as cores em hex da spec
4. `lib/tema.ts` convertendo as cores em variáveis CSS, aplicadas na tag `<html>`
5. `app/globals.css` com o bloco `@theme inline` ligando as variáveis ao Tailwind
6. `app/layout.tsx` com Anton, Geist e Geist Mono via `next/font`, e os metadados vindos do config

**Verificação:** `npm run build` passa. Uma página com um título e um parágrafo mostra Anton no título, Geist no corpo, fundo escuro e o neon correto. Trocar uma cor no config muda a página.

---

## Fase 2, imagens

**Objetivo:** os dois arquivos, foto e robô, com enquadramento idêntico.

1. Recortar `WhatsApp Image 2026-07-27 at 15.16.12.jpeg` em retrato 4:5, cabeça e ombros, rosto no terço superior. Salvar como `public/imagens/linyker.jpg`
2. Escrever `scripts/gerar-robo.mjs`: lê a foto recortada, aplica detecção de borda (Sobel), descarta bordas fracas por limiar, pinta as linhas no neon sobre fundo quase preto, e grava `public/imagens/linyker-robo.png`
3. Rodar o script uma vez e commitar o resultado. O script fica versionado para poder ser reajustado, mas não roda no build

**Verificação:** as duas imagens têm exatamente as mesmas dimensões. Sobrepostas, o contorno da cabeça coincide. O robô é legível como rosto humano, não como ruído.

**Ponto de decisão:** se o resultado do Sobel não convencer, ajustar limiar e espessura antes de desistir. Se ainda assim ficar ruim, gerar o robô em ferramenta de imagem externa, obrigatoriamente a partir da foto já recortada, para o enquadramento continuar idêntico.

---

## Fase 3, a lente

**Objetivo:** o efeito funcionando, isolado, antes de existir página em volta.

1. `components/Lente.tsx`, componente cliente. Duas imagens empilhadas, a de robô com `clip-path: circle(R at X Y)`
2. Posição do ponteiro suavizada por quadro com interpolação, via `requestAnimationFrame`. O laço só roda quando há movimento pendente, e para sozinho quando alcança o alvo
3. No `pointerleave`, o raio anima até zero
4. Detecção de ponteiro grosseiro com `matchMedia("(pointer: coarse)")`. Sendo grosseiro, a lente entra em volta automática lenta e contínua, ignorando eventos de ponteiro
5. Com `prefers-reduced-motion`, a lente fica parada em uma posição fixa

**Verificação:** no computador o círculo segue o mouse sem engasgo. Reduzindo a janela para largura de celular e recarregando, a lente passeia sozinha. Com movimento reduzido ligado no sistema, ela não se move. O `clip-path` aparece no painel de camadas como composição de GPU.

---

## Fase 4, conteúdo da página

**Depende de:** respostas da lista "A confirmar" da spec.

1. `components/Topo.tsx`: nome em Anton ocupando a tela, a lente, uma linha de posicionamento, links de GitHub e LinkedIn
2. `components/EmProducao.tsx`: B2List e Fluxo de Caixa
3. `components/DePontaAPonta.tsx`: prospecta, Clínica Sorriso Ideal, LD Pecuária. Cada card com problema em uma linha, a decisão técnica que importa, e links para repositório e demo
4. `components/Stack.tsx`: ferramentas em lista, sem barra de porcentagem inventada
5. `components/Contato.tsx` e `components/Rodape.tsx`
6. `app/page.tsx` compondo tudo

**Verificação:** nenhum texto genérico do tipo "apaixonado por tecnologia". Toda afirmação tem prova ao lado, seja link, número ou demo. Nada da B2List expõe cliente.

---

## Fase 5, estudo de caso do prospecta

1. `app/prospecta/page.tsx` cobrindo os quatro pontos da spec: o bug de deduplicação, o rate limit do Overpass, os 146 testes com mock, e a decisão de custo do FieldMask
2. Trechos de código curtos e comentados, não arquivos inteiros
3. Link de volta para a home e para o repositório

**Verificação:** um tech lead consegue ler em três minutos e sair sabendo uma decisão técnica que ele não sabia antes.

---

## Fase 6, publicação

1. `next.config.ts` com `output: "export"`, `basePath: "/portfolio"` e `assetPrefix: "/portfolio"`
1b. `lib/caminhos.ts` com `caminhoPublico()`, aplicado em **toda** tag de imagem. Sem isso as imagens dão 404, porque `images.unoptimized` não prefixa o `src` sozinho. Foi exatamente o bug do projeto da clínica
2. `.github/workflows/deploy.yml`, mesmo do projeto da clínica, com as actions nas versões atuais: checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5
3. `touch out/.nojekyll` no workflow, senão o Pages ignora a pasta `_next`
4. Criar o repositório remoto e habilitar o Pages com `build_type: workflow`

**Verificação:** os arquivos da pasta `out/` respondem 200 no domínio publicado. Conferir explicitamente as imagens, que foi onde o projeto da clínica quebrou. O teste é varrer o HTML gerado e confirmar que nenhum `src` ou `href` sai sem o prefixo `/portfolio`.

**Não encostar em** `linykercs.github.io`, que hospeda o site da Clínica Flávia Franco em produção.

---

## Fase 7, verificação final

1. Lighthouse no celular, mirando 90 ou mais em performance e 100 em acessibilidade
2. Teclado: percorrer a página inteira com Tab, com foco sempre visível
3. Testar em largura de 360 px, que é onde a tipografia grande costuma estourar
4. Confirmar que a lente não trava a rolagem no celular, por causa do `touch-action`
5. Verificar contraste do texto fraco sobre o fundo, que é o candidato mais provável a reprovar

---

## O que pode dar errado

| Situação | O que fazer |
| --- | --- |
| O robô sai como ruído ilegível | Ajustar limiar do Sobel. Persistindo, gerar externamente a partir da foto já recortada |
| Anton estoura em telas estreitas | `clamp()` na fonte e `text-wrap: balance`, testado em 360 px |
| A lente engasga em celular antigo | Reduzir o raio e a frequência do laço. Em último caso, ficar só com a volta automática |
| Falta resposta da lista "A confirmar" | Fases 1 a 3, 5 e 6 seguem sem isso. Só a fase 4 espera |
