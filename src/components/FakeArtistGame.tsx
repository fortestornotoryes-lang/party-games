import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Play, CheckCircle2, RotateCcw, Home, Brush, Info, HelpCircle, X, Undo2 } from 'lucide-react';
import { Player } from '../types';
import { FAKE_ARTIST_INSTRUCTIONS } from '../constants/fakeArtistContent';

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  playerId: string;
}

interface FakeArtistGameProps {
  players: Player[];
  word: string;
  category: string;
  onBack: () => void;
  onFinish: () => void;
}

const PLAYER_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4'  // cyan
];

export const FakeArtistGame: React.FC<FakeArtistGameProps> = ({ players, word, category, onBack, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[] | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const currentPlayer = players[turnIndex % players.length];
  const playerColor = PLAYER_COLORS[turnIndex % PLAYER_COLORS.length];

  // Adjust canvas size on resize and handle high-DPI
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
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      redraw();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We don't clear the transform here because it's handled by the scale(dpr) in resizeObserver
    // But we do need to clear the rect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;

    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    if (currentStroke && currentStroke.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = playerColor;
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    redraw();
  }, [strokes, currentStroke]);

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

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (hasDrawnThisTurn) return;
    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentStroke([pos]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || hasDrawnThisTurn) return;
    const pos = getPos(e);
    setCurrentStroke(prev => prev ? [...prev, pos] : [pos]);
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

  const nextTurn = () => {
    const nextIdx = turnIndex + 1;
    if (nextIdx === players.length * 2) {
      onFinish();
    } else {
      setTurnIndex(nextIdx);
      setHasDrawnThisTurn(false);
      if (nextIdx % players.length === 0) {
        setRound(2);
      }
    }
  };

  const undoLastStroke = () => {
    if (!hasDrawnThisTurn) return;
    setStrokes(prev => prev.slice(0, -1));
    setHasDrawnThisTurn(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden select-none">
      <div className="p-4 sm:p-6 bg-[#0a0502]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Palette className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic italic tracking-tighter">Fake <span className="text-emerald-500">Artist</span></h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Раунд {round} // {turnIndex + 1} ход</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
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
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <AnimatePresence>
            {!hasDrawnThisTurn && (
               <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center space-y-4"
               >
                 <Brush className="w-12 h-12 text-white/10 " />
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
            onClick={nextTurn}
            disabled={!hasDrawnThisTurn}
            className="flex-1 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-2xl disabled:opacity-30 disabled:grayscale transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Подтвердить</span>
          </button>
        </div>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#120a0a] border border-emerald-500/20 p-8 rounded-[2.5rem] max-w-lg w-full relative"
            >
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="p-3 bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Правила</h2>
                <div className="space-y-4">
                  {FAKE_ARTIST_INSTRUCTIONS.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.content}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest"
                >
                  Понятно
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

