/**
 * ============================================================================
 * CONFERÊNCIA DO PREFIXO NO HTML GERADO
 * ============================================================================
 *
 * Varre a pasta `out/` e falha se algum `src` ou `href` absoluto sair sem o
 * `basePath`. Roda depois do build:
 *
 *   npm run conferir
 *
 * POR QUE ISSO EXISTE
 *
 * O site mora em `linykercs.github.io/portfolio`. Um caminho que comece em `/`
 * e não em `/portfolio` aponta para a raiz do domínio, que é o site da clínica.
 * O resultado é 404, e o pior tipo: o build passa, o deploy passa, e só o
 * navegador de quem visita descobre. Foi assim que as imagens do projeto da
 * clínica quebraram, e ninguém viu até abrir a página publicada.
 *
 * Um teste que roda no CI transforma esse erro silencioso em build vermelho.
 * ============================================================================
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const PASTA = "out";
const PREFIXO = "/portfolio";

/** Pega o valor de todo src e href do HTML, com a linha onde ele aparece. */
function extrairCaminhos(html) {
  const achados = [];
  const padrao = /\b(src|href)\s*=\s*"([^"]*)"/g;

  let encontro;
  while ((encontro = padrao.exec(html)) !== null) {
    const linha = html.slice(0, encontro.index).split("\n").length;
    achados.push({ atributo: encontro[1], valor: encontro[2], linha });
  }

  return achados;
}

/**
 * Só interessam os caminhos absolutos do próprio site.
 *
 * `https://...`, `mailto:`, `#ancora` e `caminho/relativo` estão todos certos
 * por construção: nenhum deles é resolvido contra a raiz do domínio.
 * `//host/x` é URL de outro host, não caminho local.
 */
function precisaDoPrefixo(valor) {
  return valor.startsWith("/") && !valor.startsWith("//");
}

async function listarHtml(pasta) {
  const entradas = await readdir(pasta, { withFileTypes: true });
  const arquivos = [];

  for (const entrada of entradas) {
    const completo = path.join(pasta, entrada.name);
    if (entrada.isDirectory()) arquivos.push(...(await listarHtml(completo)));
    else if (entrada.name.endsWith(".html")) arquivos.push(completo);
  }

  return arquivos;
}

const arquivos = await listarHtml(PASTA);

if (arquivos.length === 0) {
  console.error(`Nenhum HTML em ${PASTA}/. Rode "npm run build" antes.`);
  process.exit(1);
}

const problemas = [];
let conferidos = 0;

for (const arquivo of arquivos) {
  const html = await readFile(arquivo, "utf8");

  for (const { atributo, valor, linha } of extrairCaminhos(html)) {
    if (!precisaDoPrefixo(valor)) continue;
    conferidos += 1;
    if (valor === PREFIXO || valor.startsWith(`${PREFIXO}/`)) continue;
    problemas.push(`${arquivo}:${linha}  ${atributo}="${valor}"`);
  }
}

console.log(
  `${arquivos.length} arquivo(s) HTML, ${conferidos} caminho(s) absoluto(s) conferido(s).`
);

if (problemas.length > 0) {
  console.error(`\n${problemas.length} caminho(s) sem o prefixo "${PREFIXO}":\n`);
  for (const problema of problemas) console.error(`  ${problema}`);
  console.error("\nEsses viram 404 no site publicado.");
  process.exit(1);
}

console.log(`Todos com o prefixo "${PREFIXO}".`);
