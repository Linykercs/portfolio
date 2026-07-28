import { Lente } from "@/components/Lente";
import { conteudo } from "@/config/conteudo";
import robo from "@/public/imagens/linyker-robo.png";
import foto from "@/public/imagens/linyker.jpg";

/**
 * PÁGINA TEMPORÁRIA DE VERIFICAÇÃO, fase 3.
 *
 * Existe só para exercitar a lente sozinha, antes de haver página em volta.
 * Será substituída pelo conteúdo real na fase 4.
 *
 * As imagens entram por importação estática, e não por caminho em texto. Assim
 * o Next resolve a URL e as dimensões, o que evita salto de layout e já deixa
 * o `basePath` resolvido para quando o site for para uma subpasta na fase 6.
 */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">
        Fase 3 · verificação da lente
      </p>

      <h1 className="mt-6 text-6xl sm:text-8xl">{conteudo.marca.exibicao}</h1>

      <Lente
        foto={foto}
        robo={robo}
        alt="Linyker, retrato em frente à Torre Eiffel"
        className="mt-12 w-full max-w-sm rounded"
      />

      <ul className="mt-12 max-w-md list-disc space-y-2 pl-5 text-sm text-fraco">
        <li>No computador, o círculo segue o ponteiro e fecha ao sair da foto.</li>
        <li>
          Num aparelho de toque, a lente passeia sozinha e não atrapalha a
          rolagem.
        </li>
        <li>Com movimento reduzido ligado no sistema, ela fica parada.</li>
      </ul>
    </main>
  );
}
