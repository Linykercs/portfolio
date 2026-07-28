/**
 * ============================================================================
 * VERSÃO ROBÔ DA FOTO
 * ============================================================================
 *
 * Lê `public/imagens/linyker.jpg` e grava `public/imagens/linyker-robo.png`:
 * o mesmo retrato reduzido a linhas de neon sobre fundo quase preto, que é o
 * que a lente revela por baixo da foto.
 *
 * Roda UMA vez, na mão. O resultado é commitado. Não entra no build.
 *
 *   npm run imagens:robo
 *
 * O `--disable-warning` no script do npm silencia um aviso do Node sobre o
 * `package.json` não declarar `type`. Ele aparece porque este arquivo importa
 * o config em TypeScript direto, sem etapa de build.
 *
 * Por que gerar em código, e não desenhar num editor: as duas imagens PRECISAM
 * ter o enquadramento idêntico. Qualquer diferença de ângulo ou de altura da
 * cabeça vira um salto visível quando a lente passa, e nenhum efeito disfarça
 * isso. Saindo da mesma imagem, o problema não existe por construção.
 *
 * COMO O DESENHO É FEITO
 *
 *   1. tons de cinza, com um borrão leve para a textura da pele e o ruído do
 *      JPEG não virarem linha
 *   2. Sobel, que mede o quanto o brilho muda em cada ponto. Onde muda rápido
 *      existe uma borda, e é isso que vira traço
 *   3. normalização por percentil, não pelo máximo teórico do operador. O
 *      máximo teórico aparece só num pixel perdido e achataria o resto da
 *      imagem, deixando todo limiar sem sentido prático
 *   4. limiar com rampa suave, que apaga o fundo desfocado e mantém o rosto,
 *      que é a única parte em foco da foto
 *   5. engorda dos traços, para a linha sobreviver quando a imagem é exibida
 *      menor que o tamanho original
 *   6. pintura: interpolação entre o fundo e o neon, os dois vindos do
 *      arquivo de conteúdo, para o robô mudar de cor junto com o site
 *
 * AJUSTE FINO: mexer em `PARAMETROS` abaixo e rodar de novo. Cada constante
 * diz o que faz e para que lado empurrar.
 * ============================================================================
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { conteudo } from "../config/conteudo.ts";

const ENTRADA = "public/imagens/linyker.jpg";
const SAIDA = "public/imagens/linyker-robo.png";

const PARAMETROS = {
  /**
   * Raio do borrão aplicado antes do Sobel.
   * Maior = menos ruído virando traço, e menos detalhe fino sobrevivendo.
   */
  borrao: 1.3,

  /**
   * Percentil do gradiente que vira o "branco" da escala, entre 0 e 1.
   * Menor = mais pixels saturam, desenho mais cheio.
   */
  percentil: 0.995,

  /**
   * Abaixo disso o traço some, entre 0 e 1. É o controle que separa o rosto
   * em foco do prédio desfocado atrás.
   * Maior = fundo mais limpo, e risco de perder o contorno do rosto junto.
   */
  limiar: 0.24,

  /**
   * Largura da rampa acima do limiar. Sem ela o traço fica serrilhado.
   * Maior = borda mais macia e mais fantasma no fundo.
   */
  rampa: 0.3,

  /**
   * Engorda do traço, em pixels. 0 desliga.
   * Maior = linha mais grossa e mais legível de longe, até virar borrão.
   */
  espessura: 1,

  /**
   * Clareamento final do traço, aplicado como potência.
   * Abaixo de 1 acende os traços fracos, acima de 1 deixa só os fortes.
   */
  gama: 0.68,
};

/** `#B8FF3C` vira `[184, 255, 60]`. */
function hexParaRgb(hex) {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Sobel: para cada pixel, o quanto o brilho muda na horizontal e na vertical.
 * O tamanho dos dois juntos é a força da borda naquele ponto.
 *
 * A moldura de 1 pixel fica em zero, porque lá o operador não tem vizinho dos
 * dois lados. Isso também evita uma linha acesa na borda da imagem.
 */
function sobel(cinza, largura, altura) {
  const forca = new Float32Array(largura * altura);

  for (let y = 1; y < altura - 1; y += 1) {
    for (let x = 1; x < largura - 1; x += 1) {
      const i = y * largura + x;

      const cimaEsq = cinza[i - largura - 1];
      const cima = cinza[i - largura];
      const cimaDir = cinza[i - largura + 1];
      const esq = cinza[i - 1];
      const dir = cinza[i + 1];
      const baixoEsq = cinza[i + largura - 1];
      const baixo = cinza[i + largura];
      const baixoDir = cinza[i + largura + 1];

      const gx = cimaDir + 2 * dir + baixoDir - (cimaEsq + 2 * esq + baixoEsq);
      const gy = baixoEsq + 2 * baixo + baixoDir - (cimaEsq + 2 * cima + cimaDir);

      forca[i] = Math.hypot(gx, gy);
    }
  }

  return forca;
}

/**
 * Valor que deixa abaixo de si a fração `fracao` dos pixels.
 *
 * Usa histograma de 1024 caixas em vez de ordenar o vetor inteiro: o
 * resultado é o mesmo para o que precisamos aqui e não custa um `sort` de
 * meio milhão de itens.
 */
function percentil(valores, fracao) {
  let maximo = 0;
  for (const v of valores) if (v > maximo) maximo = v;
  if (maximo === 0) return 0;

  const CAIXAS = 1024;
  const histograma = new Int32Array(CAIXAS);
  for (const v of valores) {
    histograma[Math.min(CAIXAS - 1, Math.floor((v / maximo) * CAIXAS))] += 1;
  }

  const alvo = valores.length * fracao;
  let acumulado = 0;
  for (let caixa = 0; caixa < CAIXAS; caixa += 1) {
    acumulado += histograma[caixa];
    if (acumulado >= alvo) return ((caixa + 1) / CAIXAS) * maximo;
  }

  return maximo;
}

/**
 * Engorda o traço trocando cada pixel pelo vizinho mais aceso dentro do raio.
 *
 * Feito em duas passadas, uma na horizontal e outra na vertical, porque o
 * máximo de um quadrado é o máximo das linhas seguido do máximo das colunas.
 * Custa `2r` comparações por pixel em vez de `r²`.
 */
function engrossar(valores, largura, altura, raio) {
  if (raio <= 0) return valores;

  const horizontal = new Float32Array(valores.length);
  for (let y = 0; y < altura; y += 1) {
    for (let x = 0; x < largura; x += 1) {
      let maximo = 0;
      const de = Math.max(0, x - raio);
      const ate = Math.min(largura - 1, x + raio);
      for (let vizinho = de; vizinho <= ate; vizinho += 1) {
        const v = valores[y * largura + vizinho];
        if (v > maximo) maximo = v;
      }
      horizontal[y * largura + x] = maximo;
    }
  }

  const final = new Float32Array(valores.length);
  for (let y = 0; y < altura; y += 1) {
    const de = Math.max(0, y - raio);
    const ate = Math.min(altura - 1, y + raio);
    for (let x = 0; x < largura; x += 1) {
      let maximo = 0;
      for (let vizinho = de; vizinho <= ate; vizinho += 1) {
        const v = horizontal[vizinho * largura + x];
        if (v > maximo) maximo = v;
      }
      final[y * largura + x] = maximo;
    }
  }

  return final;
}

const { data, info } = await sharp(ENTRADA)
  .greyscale()
  .blur(PARAMETROS.borrao)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: largura, height: altura } = info;

const forca = sobel(data, largura, altura);
const escala = percentil(forca, PARAMETROS.percentil);

// Normaliza e aplica o limiar com rampa suave, tudo numa passada.
const traco = new Float32Array(forca.length);
const { limiar, rampa, gama } = PARAMETROS;
for (let i = 0; i < forca.length; i += 1) {
  const normalizado = Math.min(1, forca[i] / escala);
  const rampeado = (normalizado - limiar) / rampa;
  const recortado = Math.max(0, Math.min(1, rampeado));
  // Curva suave nas duas pontas, para o traço não terminar em degrau.
  traco[i] = recortado * recortado * (3 - 2 * recortado);
}

const grosso = engrossar(traco, largura, altura, PARAMETROS.espessura);

const [fundoR, fundoG, fundoB] = hexParaRgb(conteudo.tema.cores.fundo);
const [neonR, neonG, neonB] = hexParaRgb(conteudo.tema.cores.neon);

const pixels = Buffer.allocUnsafe(largura * altura * 3);
for (let i = 0; i < grosso.length; i += 1) {
  const t = Math.pow(grosso[i], gama);
  pixels[i * 3] = fundoR + (neonR - fundoR) * t;
  pixels[i * 3 + 1] = fundoG + (neonG - fundoG) * t;
  pixels[i * 3 + 2] = fundoB + (neonB - fundoB) * t;
}

await mkdir(path.dirname(SAIDA), { recursive: true });

const salvo = await sharp(pixels, { raw: { width: largura, height: altura, channels: 3 } })
  .png({ compressionLevel: 9 })
  .toFile(SAIDA);

console.log(`${SAIDA}: ${salvo.width}x${salvo.height}, ${salvo.size} bytes`);
