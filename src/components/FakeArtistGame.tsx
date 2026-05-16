import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, CheckCircle2, Home, Brush, HelpCircle, X, Undo2, Timer } from 'lucide-react';
import { Player } from '../types';
import { FAKE_ARTIST_INSTRUCTIONS } from '../constants/fakeArtistContent';
import { InstructionsModal } from './InstructionsModal';

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  playerId: string;
}

interface FakeArtistGameProps {
  players: Player[];
  word: string;
  category: string;
  rounds: number;
  timerSeconds: number;
  onBack: () => void;
  onFinish: (imageUrl: string) => void;
}

const PLAYER_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4'
];

export const FakeArtistGame: React.FC<FakeArtistGameProps> = ({ players, word, category, rounds, timerSeconds, onBack, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const redrawRef = useRef<() => void>(() => {});
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[] | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [timeExpired, setTimeExpired] = useState(false);

  const totalTurns = players.length * rounds;
  const currentPlayer = players[turnIndex % players.length];
  const playerColor = PLAYER_COLORS[turnIndex % players.length];

  const advanceTurn = useCallback(() => {
    const nextIdx = turnIndex + 1;
    if (nextIdx >= totalTurns) {
      let imageUrl = '';
      const canvas = canvasRef.current;
      if (canvas) {
        const temp = document.createElement('canvas');
        temp.width = canvas.width;
        temp.height = canvas.height;
        const ctx = temp.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, temp.width, temp.height);
          ctx.drawImage(canvas, 0, 0);
          imageUrl = temp.toDataURL('image/png');
        }
      }
      onFinish(imageUrl);
    } else {
      setTurnIndex(nextIdx);
      setHasDrawnThisTurn(false);
      setTimeExpired(false);
      if (nextIdx % players.length === 0) {
        setRound(prev => prev + 1);
      }
    }
  }, [turnIndex, totalTurns, players.length, onFinish]);

  // Reset timer on each new turn
  useEffect(() => {
    if (timerSeconds > 0) {
      setTimeLeft(timerSeconds);
      setTimeExpired(false);
    }
  }, [turnIndex, timerSeconds]);

  // Countdown
  useEffect(() => {
    if (timerSeconds === 0) return;
    if (timeLeft <= 0) {
      setTimeExpired(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerSeconds]);

  // Auto-advance when timer expires
  useEffect(() => {
    if (timeExpired) {
      const id = setTimeout(() => advanceTurn(), 800);
      return () => clearTimeout(id);
    }
  }, [timeExpired, advanceTurn]);

  // Canvas resize
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      redrawRef.current();
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      ctx.stroke();
    });
    if (currentStroke && currentStroke.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = playerColor;
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      ctx.stroke();
    }
  };

  redrawRef.current = redraw;
  useEffect(() => { redraw(); }, [strokes, currentStroke]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return { x: 0, y: 0 };
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (hasDrawnThisTurn || timeExpired) return;
    setIsDrawing(true);
    setCurrentStroke([getPos(e)]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || hasDrawnThisTurn || timeExpired) return;
    setCurrentStroke(prev => prev ? [...prev, getPos(e)] : [getPos(e)]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke && currentStroke.length > 1) {
      setStrokes(prev => [...prev, { points: currentStroke, color: playerColor, playerId: currentPlayer.id }]);
      setHasDrawnThisTurn(true);
    }
    setCurrentStroke(null);
  };

  const undoLastStroke = () => {
    if (!hasDrawnThisTurn) return;
    setStrokes(prev => prev.slice(0, -1));
    setHasDrawnThisTurn(false);
  };

  const timerPct = timerSeconds > 0 ? timeLeft / timerSeconds : 1;
  const timerColor = timerPct > 0.5 ? '#10b981' : timerPct > 0.25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden select-none">
      <div className="p-4 sm:p-6 bg-[#0a0502]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Palette className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter">Fake <span className="text-emerald-500">Artist</span></h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Раунд {round}/{rounds} // ход {(turnIndex % players.length) + 1}/{players.length}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {timerSeconds > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <Timer className="w-3.5 h-3.5" style={{ color: timerColor }} />
              <span className="text-sm font-black tabular-nums" style={{ color: timerColor }}>{timeLeft}</span>
            </div>
          )}
          <button onClick={() => setShowInstructions(true)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button onClick={onBack} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 transition-all">
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col items-center">
        <div className="w-full max-w-lg mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: playerColor }} />
            <div>
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Сейчас рисует</p>
              <h3 className="text-lg font-bold leading-none">{currentPlayer.name}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Тема</p>
            <h3 className="text-sm font-bold text-emerald-500">{category}</h3>
          </div>
        </div>

        {/* Timer bar */}
        {timerSeconds > 0 && (
          <div className="w-full max-w-lg mb-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: timerColor }}
              animate={{ width: `${timerPct * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full max-w-lg flex-1 bg-white/[0.03] border-4 border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-inner cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-white" />
          <AnimatePresence>
            {timeExpired && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
              >
                <Timer className="w-12 h-12 text-red-500 mb-2" />
                <p className="text-2xl font-black uppercase tracking-tighter text-red-500">Время вышло!</p>
              </motion.div>
            )}
            {!hasDrawnThisTurn && !timeExpired && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center space-y-4"
              >
                <Brush className="w-12 h-12 text-white/10" />
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Нарисуй одну линию</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full max-w-lg mt-6 flex gap-3">
          <button
            onClick={undoLastStroke}
            disabled={!hasDrawnThisTurn}
            className="p-5 bg-white/5 text-gray-400 border border-white/10 rounded-[2rem] font-black uppercase transition-all disabled:opacity-0"
          >
            <Undo2 className="w-6 h-6" />
          </button>

          <button
            onClick={advanceTurn}
            disabled={!hasDrawnThisTurn && !timeExpired}
            className="flex-1 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-2xl disabled:opacity-30 disabled:grayscale transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Подтвердить</span>
          </button>
        </div>
      </div>

      <InstructionsModal
        open={showInstructions}
        instructions={FAKE_ARTIST_INSTRUCTIONS}
        onClose={() => setShowInstructions(false)}
        title="Правила"
        theme="emerald"
      />
    </div>
  );
};
