/**
 * ============================================================================
 * RECORTE DA FOTO DE PERFIL
 * ============================================================================
 *
 * Gera `public/imagens/linyker.jpg` a partir do original do WhatsApp.
 *
 * Roda UMA vez, na mão. O resultado é commitado. Não entra no build.
 *
 *   npm run imagens:recortar
 *   npm run imagens:recortar -- caminho/de/outro/original.jpg
 *
 * Por que existe, em vez de recortar num editor: o robô da lente é gerado a
 * partir DESTE arquivo, então o enquadramento precisa ser um número escrito
 * em algum lugar, e não uma escolha de mouse que ninguém consegue repetir.
 * ============================================================================
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

/** Original, se nenhum caminho for passado na linha de comando. */
const ORIGINAL_PADRAO =
  "C:/Users/Linyker/Downloads/WhatsApp Image 2026-07-27 at 15.16.14.jpeg";

const SAIDA = "public/imagens/linyker.jpg";

/**
 * Janela do recorte, em pixels do original (1280x960, paisagem).
 *
 * Proporção 4:5, exigida pela spec. O rosto está à direita do quadro original,
 * então a janela não é centrada na largura. A altura é o máximo que cabe sem
 * estourar a base, para não jogar fora resolução: o original é paisagem, e
 * depois do corte em retrato sobra pouco pixel.
 */
const JANELA = { left: 509, top: 255, width: 512, height: 640 };

const original = process.argv[2] ?? ORIGINAL_PADRAO;

await mkdir(path.dirname(SAIDA), { recursive: true });

const info = await sharp(original)
  .extract(JANELA)
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(SAIDA);

console.log(`${SAIDA}: ${info.width}x${info.height}, ${info.size} bytes`);
