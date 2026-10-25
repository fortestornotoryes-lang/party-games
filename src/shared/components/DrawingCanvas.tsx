import { CheckCircle2, Eraser, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TimerValue } from '@/shared/components/TimerValue';
import {
  coalescedPoints,
  exportCanvasImage,
  useCanvasSurface,
} from '@/shared/hooks/useCanvasSurface';
import type { Timer } from '@/shared/hooks/useTimer';
import { useTranslation } from '@/shared/i18n';

const BRUSH_COLORS = [
  '#ffffff',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#000000',
];
const BRUSH_SIZES = [1, 2, 4, 8, 14];
const CANVAS_BG = '#120a0a';

interface Point {
  x: number;
  y: number;
}

/** Штрих в CSS-пикселях канваса: история рисунка — векторы, а не снимки битмапа */
interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

interface DrawingCanvasProps {
  word: string;
  /** Таймер хода: при обнулении рисунок отправляется автоматически */
  timer: Timer;
  playerCount: number;
  currentRound: number;
  onFinish: (dataUrl: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  word,
  timer,
  playerCount,
  currentRound,
  onFinish,
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Undo, ресайз и очистка перерисовывают штрихи заново. Раньше перед каждым штрихом
  // снимался getImageData всего битмапа (синхронное чтение с GPU, ~6 МБ при DPR 3,
  // до 50 штук в памяти) — отсюда задержка на старте линии и фризы от сборщика мусора.
  const strokesRef = useRef<Stroke[]>([]);
  // Текущий штрих живёт вне React-состояния: pointermove рисует сегмент напрямую в canvas
  const currentRef = useRef<Stroke | null>(null);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);

  const finish = () => {
    const canvas = canvasRef.current;
    onFinish(canvas ? exportCanvasImage(canvas) : '');
  };

  // Автоотправка, когда время дошло до нуля (подписка — без перерисовки холста каждую секунду)
  const finishRef = useRef(finish);
  useLayoutEffect(() => {
    finishRef.current = finish;
  });
  useEffect(() => {
    let prev = timer.getTimeLeft();
    return timer.subscribe((timeLeft) => {
      if (prev > 0 && timeLeft === 0) finishRef.current();
      prev = timeLeft;
    });
  }, [timer]);

  /** Масштаб «CSS-пиксель → пиксель битмапа» для ctx.setTransform */
  const applyCssTransform = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    ctx.setTransform(canvas.width / rect.width, 0, 0, canvas.height / rect.height, 0, 0);
  };

  const strokePath = (ctx: CanvasRenderingContext2D, { points, color, size }: Stroke) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.moveTo(points[0].x, points[0].y);
    for (const p of points) ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    applyCssTransform(ctx, canvas);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of strokesRef.current) strokePath(ctx, stroke);
  };

  const { getCssPos } = useCanvasSurface(canvasRef, {
    observeParent: true,
    // Смена размера битмапа стирает рисунок — восстанавливаем из векторов
    onResize: () => {
      redraw();
    },
  });

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Второй палец/кнопка не должны начинать новый штрих
    if (!e.isPrimary) return;
    // Захват указателя: штрих не обрывается, если палец/курсор ушёл за край canvas
    e.currentTarget.setPointerCapture(e.pointerId);
    currentRef.current = { points: [getCssPos(e)], color: brushColor, size: brushSize };
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = currentRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!stroke || !canvas || !ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    let last = stroke.points[stroke.points.length - 1];
    ctx.moveTo(last.x, last.y);
    for (const ev of coalescedPoints(e)) {
      last = getCssPos(ev);
      stroke.points.push(last);
      ctx.lineTo(last.x, last.y);
    }
    ctx.stroke();
  };

  const stopDrawing = () => {
    const stroke = currentRef.current;
    currentRef.current = null;
    // Тап без движения линии не рисует — в историю (и в undo) не попадает
    if (stroke && stroke.points.length > 1) strokesRef.current.push(stroke);
  };

  const clearCanvas = () => {
    strokesRef.current = [];
    redraw();
  };

  const undoDrawing = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    redraw();
  };

  const handleSubmit = () => {
    finish();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
      <div className="flex flex-shrink-0 items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="text-micro font-black tracking-widest text-white/30 uppercase">
            ✏️ {t('common.youDraw')}
          </p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-premium-orange text-lg leading-tight font-black wrap-anywhere"
          >
            {word}
          </motion.p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <TimerValue timer={timer}>
            {(timeLeft) => (
              <span
                className={`min-w-[2rem] text-right text-sm font-black tabular-nums ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white/35'}`}
              >
                {t('common.secondsShort', { n: timeLeft })}
              </span>
            )}
          </TimerValue>
          <button
            onClick={undoDrawing}
            className="rounded-premium-sm hover:bg-premium-orange/20 hover:text-premium-orange bg-white/5 p-2.5 text-white/35 transition-colors"
          >
            <Undo2 className="h-5 w-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="rounded-premium-sm hover:bg-premium-red/20 hover:text-premium-red bg-white/5 p-2.5 text-white/35 transition-colors"
          >
            <Eraser className="h-5 w-5" />
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-premium-sm bg-white p-2.5 text-black transition-colors hover:bg-zinc-200"
          >
            <CheckCircle2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-shrink-0 justify-center gap-1.5 py-0.5">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i < currentRound
                ? 'w-3 bg-orange-500/30'
                : i === currentRound
                  ? 'w-5 bg-orange-500'
                  : 'w-3 bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="rounded-premium-md relative min-h-0 flex-1 overflow-hidden border border-white/10 bg-[#120a0a] shadow-2xl">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          className="h-full w-full touch-none"
        />
      </div>

      <div className="rounded-premium-md flex flex-shrink-0 flex-col gap-2 border border-white/10 bg-black/70 px-3 py-2.5">
        <div className="flex items-center justify-center gap-1.5">
          {BRUSH_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                setBrushColor(color);
              }}
              className={`h-7 w-7 rounded-full border-2 transition-[transform,border-color] active:scale-90 ${brushColor === color ? 'scale-110 border-white' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="mx-0.5 h-5 w-px bg-white/10" />
          <input
            type="color"
            value={brushColor}
            onChange={(e) => {
              setBrushColor(e.target.value);
            }}
            className="h-7 w-7 cursor-pointer overflow-hidden rounded-full border-none bg-transparent p-0"
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => {
                setBrushSize(size);
              }}
              className="flex h-8 w-8 items-center justify-center"
            >
              <div
                className={`rounded-full transition-all ${brushSize === size ? 'bg-orange-500' : 'bg-white/25'}`}
                style={{ width: Math.max(2, size * 1.2), height: Math.max(2, size * 1.2) }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
