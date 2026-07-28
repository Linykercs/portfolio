"use client";

/**
 * ============================================================================
 * A LENTE
 * ============================================================================
 *
 * Duas imagens empilhadas: a foto embaixo, a versão robô em cima recortada
 * num círculo. O círculo segue o ponteiro, então o robô só aparece onde ele
 * passa.
 *
 * É o ÚNICO componente cliente do site. Todo o resto é Server Component.
 *
 * COMO SE COMPORTA
 *
 *   computador  círculo segue o ponteiro; ao sair, o raio fecha em zero
 *   celular     não existe ponteiro para seguir, então a lente passeia
 *               sozinha, senão ninguém no telefone descobre que o efeito
 *               existe
 *   movimento   com `prefers-reduced-motion`, a lente para de vez e fica
 *   reduzido    num ponto fixo sobre o rosto
 *
 * TRÊS DECISÕES QUE VALEM O COMENTÁRIO
 *
 * 1. Nada disso passa por estado do React. A posição é escrita direto no
 *    `style` do elemento por um `ref`. Estado redesenharia o componente
 *    sessenta vezes por segundo para mudar uma string de CSS, o que é caro e
 *    não compra nada.
 *
 * 2. As medidas são percentuais, não pixels. O `clip-path` resolve `%`
 *    contra a caixa do elemento, então a lente acompanha qualquer tamanho de
 *    tela sozinha. Em pixels seria preciso medir a caixa e ouvir `resize`.
 *
 * 3. A suavização usa o tempo decorrido, não uma fração fixa por quadro.
 *    Fração fixa amarra a velocidade à taxa de atualização da tela, e o mesmo
 *    efeito ficaria com o dobro da velocidade num monitor de 120 Hz.
 * ============================================================================
 */

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

const AJUSTES = {
  /**
   * Raio da lente, em porcentagem da caixa de referência do `clip-path`.
   * Maior = revela mais de uma vez, e o efeito perde o ar de foco.
   */
  raio: 22,

  /**
   * Velocidade da perseguição, em "quanto do caminho que falta por segundo".
   * Maior = a lente cola no ponteiro. Menor = ela arrasta atrás, mais macia.
   */
  velocidade: 14,

  /**
   * Distância abaixo da qual a lente é considerada no lugar, em pontos
   * percentuais. Serve para o laço desligar sozinho em vez de ficar rodando
   * para sempre corrigindo casas decimais invisíveis.
   */
  parada: 0.05,

  /** Onde a lente descansa: sobre o rosto, em fração da caixa. */
  repouso: { x: 0.52, y: 0.35 },

  /**
   * O passeio automático do celular. Duas frequências diferentes fazem a
   * lente desenhar uma figura que demora a se repetir, em vez de girar em
   * círculo e denunciar que é um laço.
   *
   * As amplitudes são curtas de propósito: o passeio precisa ficar em cima do
   * rosto. Fora dele o robô tem pouca linha, e a lente passa a parecer um
   * buraco preto em vez de um efeito.
   */
  passeio: {
    /** Duração da volta completa, em milissegundos. */
    periodo: 15000,
    /** O quanto ela se afasta do repouso, em fração da caixa. */
    amplitudeX: 0.14,
    amplitudeY: 0.08,
  },
};

type Ponto = { x: number; y: number; raio: number };

export type LenteProps = {
  /** A foto. Importada estaticamente, para o Next resolver dimensão e URL. */
  foto: StaticImageData;
  /** A versão robô. Precisa ter exatamente o mesmo enquadramento da foto. */
  robo: StaticImageData;
  /** Texto alternativo da foto. O robô é decorativo e não recebe nenhum. */
  alt: string;
  className?: string;
};

export function Lente({ foto, robo, alt, className }: LenteProps) {
  const camadaRobo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const camada = camadaRobo.current;
    if (!camada) return;

    const pintar = ({ x, y, raio }: Ponto) => {
      camada.style.clipPath = `circle(${raio}% at ${x * 100}% ${y * 100}%)`;
    };

    // Quem prefere menos movimento recebe a lente parada. Sem laço, sem
    // ouvinte de evento, sem nada rodando.
    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (movimentoReduzido.matches) {
      pintar({ ...AJUSTES.repouso, raio: AJUSTES.raio });
      return;
    }

    // Ponteiro grosseiro é dedo. Não há cursor para seguir, então a lente
    // passeia sozinha e os eventos de ponteiro são ignorados por completo,
    // o que também garante que ela não atrapalhe a rolagem.
    const semCursor = window.matchMedia("(pointer: coarse)").matches;

    const atual: Ponto = { ...AJUSTES.repouso, raio: semCursor ? AJUSTES.raio : 0 };
    const alvo: Ponto = { ...atual };

    let laco: number | null = null;
    let instanteAnterior: number | null = null;

    const quadro = (agora: number) => {
      const decorrido = instanteAnterior === null ? 0 : (agora - instanteAnterior) / 1000;
      instanteAnterior = agora;

      if (semCursor) {
        const { periodo, amplitudeX, amplitudeY } = AJUSTES.passeio;
        const volta = (agora / periodo) * Math.PI * 2;
        alvo.x = AJUSTES.repouso.x + Math.sin(volta) * amplitudeX;
        // Frequência dobrada no eixo vertical: é o que transforma o círculo
        // numa figura de oito deitada, que passeia pelo rosto inteiro.
        alvo.y = AJUSTES.repouso.y + Math.sin(volta * 2) * amplitudeY;
      }

      // Suavização exponencial. `fracao` é o quanto do caminho que falta se
      // percorre neste quadro, calculado a partir do tempo que ele durou.
      const fracao = 1 - Math.exp(-AJUSTES.velocidade * decorrido);
      atual.x += (alvo.x - atual.x) * fracao;
      atual.y += (alvo.y - atual.y) * fracao;
      atual.raio += (alvo.raio - atual.raio) * fracao;

      pintar(atual);

      // O passeio nunca termina. A perseguição termina quando alcança o alvo,
      // e aí o laço desliga em vez de queimar quadro à toa.
      const distancia =
        Math.abs(alvo.x - atual.x) * 100 +
        Math.abs(alvo.y - atual.y) * 100 +
        Math.abs(alvo.raio - atual.raio);

      if (semCursor || distancia > AJUSTES.parada) {
        laco = requestAnimationFrame(quadro);
      } else {
        pintar(alvo);
        laco = null;
        instanteAnterior = null;
      }
    };

    const acordar = () => {
      if (laco === null) {
        instanteAnterior = null;
        laco = requestAnimationFrame(quadro);
      }
    };

    pintar(atual);

    if (semCursor) {
      acordar();
      return () => {
        if (laco !== null) cancelAnimationFrame(laco);
      };
    }

    const aoMover = (evento: PointerEvent) => {
      const caixa = camada.getBoundingClientRect();
      alvo.x = (evento.clientX - caixa.left) / caixa.width;
      alvo.y = (evento.clientY - caixa.top) / caixa.height;
      alvo.raio = AJUSTES.raio;
      acordar();
    };

    const aoSair = () => {
      alvo.raio = 0;
      acordar();
    };

    const area = camada.parentElement ?? camada;
    area.addEventListener("pointermove", aoMover);
    area.addEventListener("pointerleave", aoSair);

    return () => {
      area.removeEventListener("pointermove", aoMover);
      area.removeEventListener("pointerleave", aoSair);
      if (laco !== null) cancelAnimationFrame(laco);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={foto}
        alt={alt}
        priority
        draggable={false}
        className="h-full w-full object-cover select-none"
      />

      {/*
        A camada do robô nasce com o círculo fechado, para não haver um lampejo
        da imagem inteira entre a pintura do servidor e o efeito assumir.
        `will-change` avisa o navegador para manter isto em camada própria,
        senão cada quadro vira repintura da imagem toda.
      */}
      <div
        ref={camadaRobo}
        aria-hidden="true"
        className="absolute inset-0"
        style={{ clipPath: "circle(0% at 52% 35%)", willChange: "clip-path" }}
      >
        <Image
          src={robo}
          alt=""
          priority
          draggable={false}
          className="h-full w-full object-cover select-none"
        />
      </div>
    </div>
  );
}
