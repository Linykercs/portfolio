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
  "C:/Users/Linyker/Downloads/WhatsApp Image 2026-07-27 at 15.16.12.jpeg";

const SAIDA = "public/imagens/linyker.jpg";

/**
 * Janela do recorte, em pixels do original (959x1280).
 *
 * Proporção 4:5, exigida pela spec. O corte encosta na base do original de
 * propósito: é o mais alto que dá para subir a moldura ainda mostrando ombro,
 * e é o que joga os olhos para o terço superior. Sobrou uma faixa de céu à
 * direita que não entra, daí o recorte não estar centrado na largura.
 */
const JANELA = { left: 251, top: 520, width: 608, height: 760 };

const original = process.argv[2] ?? ORIGINAL_PADRAO;

await mkdir(path.dirname(SAIDA), { recursive: true });

const info = await sharp(original)
  .extract(JANELA)
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(SAIDA);

console.log(`${SAIDA}: ${info.width}x${info.height}, ${info.size} bytes`);
