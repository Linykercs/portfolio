# Portfólio do Linyker, design

Data: 27/07/2026
Estado: aprovado, pronto para virar plano de implementação

## Objetivo

Conseguir vaga de **desenvolvedor full-stack**.

O leitor é recrutador técnico e tech lead. Os dois varrem a página em segundos procurando evidência concreta, não promessa. Cada afirmação precisa vir com prova ao lado: repositório, demo no ar, ou número.

Meta de sucesso: em trinta segundos de página, o leitor consegue responder o que o Linyker sabe fazer, o que ele já colocou no ar, e onde ver o código.

## Referência visual

O site do Lando Norris (`landonorris.com`, feito pela agência Off+Brand). O que foi extraído dele, e o que foi deliberadamente descartado:

**Aproveitado**
- Alto contraste com um único neon como destaque
- Tipografia enorme em caixa alta funcionando como elemento gráfico, não como logo tímido
- Divisão editorial em dois eixos (lá é `On Track` e `Off Track`)
- Muito espaço negativo

**Descartado**
- WebGL e animações em Rive. Custam caro em tempo e em performance no celular, e não é o que consegue a vaga.

## Estrutura

Duas rotas apenas.

### `/` , página única

1. **Topo**: nome ocupando a tela, a lente com a foto, uma linha do que ele faz, e dois links diretos: GitHub e LinkedIn
2. **Em produção**: sistemas que outras pessoas dependem
   - B2List: pipeline no Databricks, integrações, resolução de incidente. Sem código e sem print, respeitando a confidencialidade do cliente
   - Fluxo de Caixa: app self-hosted no Mac mini, bot do Telegram, túnel
3. **De ponta a ponta**: projetos levados do zero ao deploy
   - prospecta
   - Clínica Sorriso Ideal
   - LD Pecuária
4. **Stack**: ferramentas, sem barra de porcentagem inventada
5. **Contato**
6. **Rodapé**

A divisão em dois eixos conta uma história sozinha: "eu sustento sistema em produção e também construo do zero", que é exatamente o que uma vaga full-stack procura.

### `/prospecta` , estudo de caso

O único projeto com página profunda. Cobre:
- O bug de deduplicação que descartava leads em silêncio, e como ele apareceu
- Rate limit do Overpass e a estratégia de retry com backoff
- 146 testes com mock, incluindo a trava que falha se alguém adicionar campo caro ao FieldMask
- A decisão de custo na Google Places API

É conversa de engenheiro, não de portfólio. É onde o candidato se separa dos outros.

## Identidade visual

### Cores

| Papel | Valor |
| --- | --- |
| Fundo | `#07090B` |
| Superfície (cards) | `#0E1114` |
| Linha e borda | `#1C2126` |
| Neon (destaque único) | `#B8FF3C` |
| Quente | `#FF7A2F`, **apenas dentro da foto**, nunca na interface |
| Texto | `#E2E7EA` |
| Texto fraco | `#8A9298` |

Regra: gastar ousadia em um lugar só. O papaia não é uma segunda cor de interface, ele existe só como polo quente da imagem, para a transição também trocar a temperatura da cor.

### Tipografia

- **Anton** nos títulos, caixa alta, entrelinha apertada
- **Geist** no texto corrido
- **Geist Mono** nos rótulos e dados

Carregadas com `next/font`, sem requisição externa.

## A lente

O efeito escolhido entre sete testados. Comparação publicada em artifact durante o brainstorming.

### Comportamento

- **Computador**: círculo de luz segue o ponteiro, revelando a versão robô só onde ele passa
- **Celular**: a lente passeia sozinha em uma volta lenta e contínua. Sem isso, quem está no telefone nunca descobre que o efeito existe, porque celular não tem cursor
- **`prefers-reduced-motion`**: a lente para e fica fixa

### Técnica

Duas imagens empilhadas. A de robô recortada com `clip-path: circle()`, posição suavizada por quadro com interpolação. `clip-path` roda na GPU, mais leve que canvas e não engasga em celular fraco.

### Geração da versão robô

A versão robô é **gerada em código a partir da própria foto**, com detecção de borda e tinta neon.

Execução: um script Node rodado **uma vez**, na mão, cujo resultado é commitado como arquivo de imagem. Não roda no build. Motivo: o resultado é determinístico, não precisa ser recalculado a cada publicação, e assim o build continua rápido e sem dependência de biblioteca de imagem.

Motivo: o enquadramento fica idêntico por construção. Se as duas imagens tiverem qualquer diferença de ângulo ou de altura de cabeça, a transição vira um salto e nenhum efeito disfarça. Gerando a partir da mesma imagem, o problema deixa de existir.

Se depois surgir um robô melhor feito em ferramenta de imagem, basta trocar o arquivo.

### Foto escolhida

`WhatsApp Image 2026-07-27 at 15.16.12.jpeg`, a da Ópera Garnier.

Escolhida por ser a única em modo retrato, com fundo desfocado. Fundo borrado quase não gera borda, então a detecção vai traçar apenas a pessoa. Nas outras três candidatas o fundo estava em foco e cheio de gente, faixa de pedestre e veículos, o que acenderia o cenário inteiro com a mesma intensidade do rosto.

Tratamento necessário: recorte em retrato 4:5 fechando em cabeça e ombros, subindo o rosto para o terço superior.

## Stack e arquitetura

- Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- Export estático, sem servidor
- Conteúdo centralizado em `config/conteudo.ts`, mesmo padrão do projeto da clínica

A escolha de repetir a base da clínica é deliberada: o setup já provou que builda e publica sozinho, e o arquivo de conteúdo mostra, para quem abrir o repositório, que o autor separa dado de apresentação sem ninguém mandar.

Um único componente cliente, a lente. Todo o resto é Server Component.

## Publicação

Repositório **`linykercs.github.io`**.

Sendo repositório de usuário, serve na raiz, sem `basePath`, e a URL fica limpa para currículo e LinkedIn. Isso também evita o problema encontrado no projeto da clínica, em que `images.unoptimized` não aplica o `basePath` ao `src` das imagens.

Publicação por GitHub Actions, mesmo workflow do projeto da clínica, com as actions já nas versões atuais.

## Testes

Type-check, lint e build no CI.

Sem bateria de testes na página. Teste unitário em página estática é teatro, e recrutador técnico percebe. A história de teste de verdade está no repositório do prospecta, e o estudo de caso aponta para lá.

## Fora de escopo

- Blog
- Internacionalização
- Modo claro. A direção é assumidamente escura
- Formulário de contato com backend. Link de e-mail e LinkedIn resolvem
- Animação de scroll em cada seção. O efeito principal é a lente, e espalhar movimento pela página tira força dela
- Estudo de caso dos outros três projetos

## A confirmar com o Linyker antes de escrever o conteúdo

Estes itens vêm de contexto acumulado e precisam ser conferidos, porque descrição errada de projeto em portfólio é pior que projeto ausente:

1. Stack real do Fluxo de Caixa e do LD Pecuária
2. Quais repositórios estão públicos e podem ser linkados
3. URL do LinkedIn e e-mail de contato
4. Como descrever a B2List sem violar confidencialidade de cliente
5. Se o LD Pecuária tem demo acessível
6. Título profissional que ele quer no topo da página

## Riscos

| Risco | Mitigação |
| --- | --- |
| A detecção de borda pode gerar um robô feio | Ajustar limiar e espessura. Se não convencer, trocar por imagem gerada externamente, mantendo o mesmo enquadramento |
| A lente pode passar despercebida no celular | Volta automática lenta, já prevista |
| A estética escura pode afastar recrutador conservador | Contraste e hierarquia bem executados. O conteúdo continua legível e escaneável |
| Descrição imprecisa de projeto | Lista "a confirmar" acima, resolvida antes de escrever o conteúdo |
