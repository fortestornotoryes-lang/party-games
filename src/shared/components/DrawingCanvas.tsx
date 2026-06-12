import { CheckCircle2, Eraser, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

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

interface DrawingCanvasProps {
  word: string;
  timeLeft: number;
  playerCount: number;
  currentRound: number;
  onFinish: (dataUrl: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  word,
  timeLeft,
  playerCount,
  currentRound,
  onFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawHistory = useRef<ImageData[]>([]);
  const prevTimeLeftRef = useRef(timeLeft);
  const isCanvasReady = useRef(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);

  // Auto-submit when timer transitions from >0 to 0
  useEffect(() => {
    if (prevTimeLeftRef.current > 0 && timeLeft === 0) {
      onFinish(canvasRef.current?.toDataURL() ?? '');
    }
    prevTimeLeftRef.current = timeLeft;
  }, [timeLeft, onFinish]);

  // Canvas resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const newW = Math.round(rect.width * dpr);
      const newH = Math.round(rect.height * dpr);
      if (canvas.width !== newW || canvas.height !== newH) {
        let saved: ImageData | undefined;
        // Only save content if the canvas was already properly initialized —
        // the HTML default (300×150) is transparent and must not be restored.
        if (isCanvasReady.current && canvas.width > 0 && canvas.height > 0) {
          try {
            saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
          } catch {}
        }
        canvas.width = newW;
        canvas.height = newH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#120a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (saved) {
          try {
            ctx.putImageData(saved, 0, 0);
          } catch {}
        }
        isCanvasReady.current = true;
      }
    };

    const ro = new ResizeObserver(updateCanvasSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    updateCanvasSize();
    return () => {
      ro.disconnect();
    };
  }, []);

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    // For mouse events, native offsetX/Y is more robust against some layout styles
    if ('nativeEvent' in e && (e.nativeEvent as MouseEvent).offsetX !== undefined) {
      const mouseEvent = e.nativeEvent as MouseEvent;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: mouseEvent.offsetX * scaleX,
        y: mouseEvent.offsetY * scaleY,
      };
    }

    // Fallback for touch events
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid scrolling/gestures interfering
    if ('cancelable' in e && e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (canvas.width > 0 && canvas.height > 0) {
      try {
        drawHistory.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (drawHistory.current.length > 50) drawHistory.current.shift();
      } catch (err) {
        console.error('History push error:', err);
      }
    }

    setIsDrawing(true);
    const { x, y } = getCoords(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;

    // Using simple ratio for line width consistency
    const rect = canvas.getBoundingClientRect();
    const dprScale = canvas.width / rect.width;
    ctx.lineWidth = brushSize * dprScale;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    if ('cancelable' in e && e.cancelable) e.preventDefault();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    drawHistory.current = [];
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#120a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const undoDrawing = () => {
    if (drawHistory.current.length === 0 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const snapshot = drawHistory.current.pop();
    if (snapshot) ctx.putImageData(snapshot, 0, 0);
  };

  const handleSubmit = () => {
    onFinish(canvasRef.current?.toDataURL() ?? '');
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
      <div className="flex flex-shrink-0 items-center justify-between px-1">
        <div>
          <p className="text-micro font-black tracking-widest text-white/30 uppercase">
            ✏️ Рисуешь
          </p>
          <motion.p
            initial={{ opacity: 0, filter: 'blur(8px)', x: -10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
            className="text-premium-orange text-lg leading-tight font-black"
          >
            {word}
          </motion.p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`min-w-[2rem] text-right text-sm font-black tabular-nums ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white/35'}`}
          >
            {timeLeft}с
          </span>
          <button
            onClick={undoDrawing}
            className="rounded-premium-sm hover:bg-premium-orange/20 hover:text-premium-orange bg-white/5 p-2.5 text-white/35 transition-all"
          >
            <Undo2 className="h-5 w-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="rounded-premium-sm hover:bg-premium-red/20 hover:text-premium-red bg-white/5 p-2.5 text-white/35 transition-all"
          >
            <Eraser className="h-5 w-5" />
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-premium-sm bg-white p-2.5 text-black transition-all hover:bg-zinc-200"
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
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
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
              className={`h-7 w-7 rounded-full border-2 transition-all active:scale-90 ${brushColor === color ? 'scale-110 border-white' : 'border-transparent'}`}
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
