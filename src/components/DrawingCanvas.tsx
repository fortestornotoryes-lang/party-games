import { CheckCircle2, Eraser, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';

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
      onFinish(canvasRef.current?.toDataURL() || '');
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
    return () => { ro.disconnect(); };
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
    const clientX = 'touches' in e ? e.touches[0].clientX : (e).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e).clientY;

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

  const stopDrawing = () => { setIsDrawing(false); };

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
    ctx.putImageData(drawHistory.current.pop(), 0, 0);
  };

  const handleSubmit = () => {
    onFinish(canvasRef.current?.toDataURL() || '');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 p-3 gap-2">
      <div className="flex-shrink-0 flex items-center justify-between px-1">
        <div>
          <p className="text-micro text-white/30 uppercase font-black tracking-widest">
            ✏️ Рисуешь
          </p>
          <motion.p
            initial={{ opacity: 0, filter: 'blur(8px)', x: -10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
            className="text-lg font-black text-premium-orange leading-tight"
          >
            {word}
          </motion.p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-black tabular-nums min-w-[2rem] text-right ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white/35'}`}
          >
            {timeLeft}с
          </span>
          <button
            onClick={undoDrawing}
            className="p-2.5 bg-white/5 rounded-premium-sm hover:bg-premium-orange/20 text-white/35 hover:text-premium-orange transition-all"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2.5 bg-white/5 rounded-premium-sm hover:bg-premium-red/20 text-white/35 hover:text-premium-red transition-all"
          >
            <Eraser className="w-5 h-5" />
          </button>
          <button
            onClick={handleSubmit}
            className="p-2.5 bg-white text-black rounded-premium-sm hover:bg-zinc-200 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 flex justify-center gap-1.5 py-0.5">
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

      <div className="flex-1 relative min-h-0 bg-[#120a0a] rounded-premium-md border border-white/10 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-full touch-none"
        />
      </div>

      <div className="flex-shrink-0 bg-black/70  border border-white/10 rounded-premium-md px-3 py-2.5 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-1.5">
          {BRUSH_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => { setBrushColor(color); }}
              className={`w-7 h-7 rounded-full border-2 transition-all active:scale-90 ${brushColor === color ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="w-px h-5 bg-white/10 mx-0.5" />
          <input
            type="color"
            value={brushColor}
            onChange={(e) => { setBrushColor(e.target.value); }}
            className="w-7 h-7 rounded-full cursor-pointer border-none bg-transparent p-0 overflow-hidden"
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => { setBrushSize(size); }}
              className="flex items-center justify-center w-8 h-8"
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
