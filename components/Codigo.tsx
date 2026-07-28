/**
 * ============================================================================
 * BLOCO DE CÓDIGO
 * ============================================================================
 *
 * Trecho curto de código com uma legenda dizendo de onde ele veio.
 *
 * Sem biblioteca de destaque de sintaxe, de propósito: colorir palavra-chave
 * custaria uns cem kilobytes de JavaScript numa página que não tem nenhum, e
 * num tema escuro o que importa para a leitura é o contraste e a fonte
 * monoespaçada, não o arco-íris.
 *
 * O bloco rola sozinho na horizontal. Sem isso, uma linha longa empurraria a
 * página inteira e criaria rolagem lateral no celular.
 * ============================================================================
 */

export type CodigoProps = {
  /** De onde o trecho saiu, por exemplo `prospecta/buscar.py`. */
  origem: string;
  /** O código. Espaços à esquerda são preservados. */
  children: string;
};

export function Codigo({ origem, children }: CodigoProps) {
  return (
    <figure className="mt-6 overflow-hidden rounded border border-linha bg-superficie">
      <figcaption className="border-b border-linha px-4 py-2 font-mono text-xs text-fraco">
        {origem}
      </figcaption>
      <div className="overflow-x-auto">
        <pre className="px-4 py-4 font-mono text-[0.8125rem] leading-relaxed text-texto">
          <code>{children.trim()}</code>
        </pre>
      </div>
    </figure>
  );
}
