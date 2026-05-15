import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, MessageSquare, ArrowRight, RotateCcw, Home, HelpCircle, X, CheckCircle2, Eraser, Shuffle, Eye, Undo2 } from 'lucide-react';
import { TELESTRATIONS_INSTRUCTIONS, STARTING_WORDS } from '../constants/telestrationsContent';

interface TelestrationsGameProps {
  playerNames: string[];
  onBack: () => void;
}

type Step = {
  type: 'draw' | 'guess';
  content: string;
  author: string;
};

const BRUSH_COLORS = ['#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#000000'];
const BRUSH_SIZES = [1, 2, 4, 8, 14];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const randomWord = () => STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];

export const TelestrationsGame: React.FC<TelestrationsGameProps> = ({ playerNames, onBack }) => {
  // Перемешиваем порядок игроков с первого запуска
  const [shuffledPlayers, setShuffledPlayers] = useState(() => shuffle(playerNames));
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<'start' | 'action' | 'transition' | 'gallery'>('start');

  // Инициализируем слово сразу, без useEffect
  const [initialWord] = useState(randomWord);
  const [currentWord, setCurrentWord] = useState(initialWord);

  const [showInstructions, setShowInstructions] = useState(false);

  const [wordRevealed, setWordRevealed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawHistory = useRef<ImageData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const currentPlayer = shuffledPlayers[currentRound];
  const isDrawingRound = currentRound % 2 === 0;

  // Запуск новой игры: новое слово + перемешанный порядок
  const startNewGame = () => {
    const word = randomWord();
    setShuffledPlayers(shuffle(playerNames));
    setSteps([]);
    setCurrentRound(0);
    setCurrentWord(word);
    setPhase('start');
    setWordRevealed(false);
    setTimeLeft(0);
  };

  const startAction = () => {
    drawHistory.current = [];
    setPhase('action');
    setGuess('');
    setTimeLeft(isDrawingRound ? 60 : 30);
  };

  const handleFinishAction = () => {
    let content = '';
    if (isDrawingRound) {
      content = canvasRef.current?.toDataURL() || '';
    } else {
      content = guess;
      setCurrentWord(guess);
    }

    const newSteps: Step[] = [...steps, {
      type: isDrawingRound ? 'draw' : 'guess',
      content,
      author: currentPlayer,
    }];
    setSteps(newSteps);

    if (currentRound === shuffledPlayers.length - 1) {
      setPhase('gallery');
    } else {
      setCurrentRound(prev => prev + 1);
      setPhase('transition');
    }
  };

  // Canvas resize + init
  useEffect(() => {
    if (phase === 'action' && isDrawingRound && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const updateCanvasSize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const newW = Math.round(rect.width * dpr);
        const newH = Math.round(rect.height * dpr);
        if (canvas.width !== newW || canvas.height !== newH) {
          let saved: ImageData | undefined;
          if (canvas.width > 0 && canvas.height > 0) {
            try { saved = ctx.getImageData(0, 0, canvas.width, canvas.height); } catch {}
          }
          canvas.width = newW;
          canvas.height = newH;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.fillStyle = '#120a0a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (saved) { try { ctx.putImageData(saved, 0, 0); } catch {} }
        }
      };

      const ro = new ResizeObserver(updateCanvasSize);
      if (canvas.parentElement) ro.observe(canvas.parentElement);
      updateCanvasSize();
      return () => ro.disconnect();
    }
  }, [phase, isDrawingRound]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'action' || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  // Auto-submit on timeout
  useEffect(() => {
    if (phase === 'action' && timeLeft === 0) handleFinishAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Save snapshot before each stroke for undo
    if (canvas.width > 0 && canvas.height > 0) {
      try {
        drawHistory.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (drawHistory.current.length > 50) drawHistory.current.shift();
      } catch {}
    }
    setIsDrawing(true);
    const { x, y } = getCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize * (window.devicePixelRatio || 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    // Reset path so next stroke() only draws the new segment, not the entire stroke from the start
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => setIsDrawing(false);

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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(drawHistory.current.pop()!, 0, 0);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0502] text-[#e5e7eb] font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-[#0a0502]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Pencil className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase italic tracking-tighter leading-none">
              Tele<span className="text-orange-500">strations</span>
            </h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
              Раунд {currentRound + 1} из {shuffledPlayers.length}
              {phase === 'action' || phase === 'transition'
                ? ` · ${isDrawingRound ? 'рисует' : 'угадывает'}`
                : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowInstructions(true)} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button onClick={onBack} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content — phases are absolute inset-0 */}
      <div className="flex-1 relative min-h-0">
        <AnimatePresence mode="wait">

          {/* ── START ── */}
          {phase === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-6"
            >
              <div className="text-center space-y-3">
                <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                  <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Первый рисует</span>
                </div>
                <h3 className="text-4xl font-black italic">{currentPlayer}</h3>
                <p className="text-gray-500 text-sm">Запомни слово и нарисуй его так, чтобы другие поняли</p>
              </div>

              {/* Порядок игроков */}
              <div className="w-full max-w-sm p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-3 text-center">Порядок этой игры</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {shuffledPlayers.map((name, i) => (
                    <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      i % 2 === 0
                        ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                      <span className="opacity-50">{i + 1}.</span>
                      <span>{name}</span>
                      <span className="opacity-40">{i % 2 === 0 ? '✏️' : '💬'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!wordRevealed ? (
                <button
                  onClick={() => setWordRevealed(true)}
                  className="w-full max-w-sm p-8 bg-white/5 border-2 border-dashed border-orange-500/20 rounded-[2.5rem] text-center hover:bg-orange-500/5 hover:border-orange-500/40 transition-all group"
                >
                  <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-3">Убедись, что остальные не смотрят</p>
                  <div className="flex items-center justify-center gap-2 text-orange-500/50 group-hover:text-orange-500 transition-colors">
                    <Eye className="w-5 h-5" />
                    <span className="text-base font-black">Показать слово</span>
                  </div>
                </button>
              ) : (
                <div className="w-full max-w-sm p-8 bg-orange-500/10 border border-orange-500/30 rounded-[2.5rem] text-center">
                  <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">Твоё секретное слово</p>
                  <h4 className="text-3xl font-black text-orange-400">{currentWord}</h4>
                </div>
              )}

              <button
                onClick={startAction}
                disabled={!wordRevealed}
                className="w-full max-w-sm py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                <span>Я готов рисовать</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── TRANSITION ── */}
          {phase === 'transition' && (
            <motion.div
              key={`transition-${currentRound}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-6"
            >
              <div className="text-center space-y-3">
                <div className={`inline-block px-4 py-1 rounded-full border ${
                  isDrawingRound
                    ? 'bg-orange-500/10 border-orange-500/20'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isDrawingRound ? 'text-orange-500' : 'text-gray-400'}`}>
                    {isDrawingRound ? '✏️ Рисует' : '💬 Угадывает'}
                  </span>
                </div>
                <h3 className="text-4xl font-black italic">{currentPlayer}</h3>
                <p className="text-gray-500 text-sm">
                  {isDrawingRound
                    ? 'Посмотри на слово в следующем экране и нарисуй его'
                    : 'Посмотри на рисунок и напиши, что на нём изображено'}
                </p>
              </div>

              {/* Прогресс */}
              <div className="flex items-center gap-1.5">
                {shuffledPlayers.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < currentRound ? 'bg-orange-500/40 w-3' :
                      i === currentRound ? 'bg-orange-500 w-6' : 'bg-white/10 w-3'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={startAction}
                className="w-full max-w-sm py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
              >
                <span>Принять телефон</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── ACTION ── */}
          {phase === 'action' && (
            <motion.div
              key="action"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col"
            >
              {isDrawingRound ? (
                /* ── DRAWING: canvas fills all space ── */
                <div className="flex-1 flex flex-col min-h-0 p-3 gap-2">
                  {/* Top bar */}
                  <div className="flex-shrink-0 flex items-center justify-between px-1">
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">✏️ Рисуешь</p>
                      <p className="text-lg font-black text-orange-400 leading-tight">{currentWord}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black tabular-nums min-w-[2rem] text-right ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>{timeLeft}с</span>
                      <button onClick={undoDrawing} className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-500/20 text-gray-500 hover:text-orange-500 transition-all">
                        <Undo2 className="w-5 h-5" />
                      </button>
                      <button onClick={clearCanvas} className="p-2.5 bg-white/5 rounded-xl hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-all">
                        <Eraser className="w-5 h-5" />
                      </button>
                      <button onClick={handleFinishAction} className="p-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Chain progress */}
                  <div className="flex-shrink-0 flex justify-center gap-1.5 py-0.5">
                    {shuffledPlayers.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < currentRound ? 'w-3 bg-orange-500/30' : i === currentRound ? 'w-5 bg-orange-500' : 'w-3 bg-white/10'}`} />
                    ))}
                  </div>

                  {/* Canvas */}
                  <div className="flex-1 relative min-h-0 bg-[#120a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
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

                  {/* Brush controls — below canvas */}
                  <div className="flex-shrink-0 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2.5 flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-1.5">
                      {BRUSH_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setBrushColor(color)}
                          className={`w-7 h-7 rounded-full border-2 transition-all active:scale-90 ${brushColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="w-px h-5 bg-white/10 mx-0.5" />
                      <input
                        type="color"
                        value={brushColor}
                        onChange={e => setBrushColor(e.target.value)}
                        className="w-7 h-7 rounded-full cursor-pointer border-none bg-transparent p-0 overflow-hidden"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      {BRUSH_SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => setBrushSize(size)}
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
              ) : (
                /* ── GUESS MODE ── */
                <div className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-4">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">💬 Угадай рисунок</p>
                    <span className={`block text-2xl font-black tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>{timeLeft}с</span>
                    <h3 className="text-xl font-black italic">Что здесь изображено?</h3>
                  </div>

                  <div className="flex justify-center gap-1.5">
                    {shuffledPlayers.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < currentRound ? 'w-3 bg-orange-500/30' : i === currentRound ? 'w-5 bg-orange-500' : 'w-3 bg-white/10'}`} />
                    ))}
                  </div>

                  <div className="w-full max-w-sm bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl p-3">
                    <img
                      src={steps[steps.length - 1].content}
                      alt="Drawing"
                      className="w-full h-auto object-contain rounded-xl bg-[#120a0a]"
                    />
                  </div>

                  <div className="w-full max-w-sm space-y-3">
                    <input
                      type="text"
                      value={guess}
                      onChange={e => setGuess(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && guess.trim() && handleFinishAction()}
                      placeholder="Напиши ответ..."
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-xl font-bold placeholder:text-gray-700 focus:border-orange-500 focus:bg-orange-500/5 transition-all outline-none"
                    />
                    <button
                      disabled={!guess.trim()}
                      onClick={handleFinishAction}
                      className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 disabled:opacity-20 transition-all shadow-2xl"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Готово</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── GALLERY ── */}
          {phase === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="p-6 space-y-6 pb-40">
                <div className="text-center space-y-1">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Финал цепочки</h3>
                  <p className="text-gray-500 text-sm">Смотрите, как менялось слово</p>
                </div>

                {/* Original word */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex-shrink-0 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[9px] font-black text-orange-500">START</div>
                  <div className="flex-1 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                    <p className="text-xs text-orange-500 uppercase font-black tracking-widest mb-1">Исходное слово</p>
                    <p className="text-xl font-bold italic">{initialWord}</p>
                  </div>
                </div>

                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-black border ${
                        step.type === 'draw'
                          ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}>
                        {step.type === 'draw' ? '✏️' : '💬'}
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">{step.author}</p>
                    </div>
                    <div className="ml-14 bg-white/5 border border-white/5 rounded-[1.5rem] overflow-hidden p-3">
                      {step.type === 'draw' ? (
                        <img src={step.content} alt="Drawing" className="w-full bg-[#120a0a] rounded-xl" />
                      ) : (
                        <div className="p-3 text-center">
                          <p className="text-xl font-black italic">"{step.content}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer с двумя кнопками */}
              <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/95 to-transparent pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-3 max-w-sm mx-auto">
                  <button
                    onClick={startNewGame}
                    className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-transform"
                  >
                    <Shuffle className="w-5 h-5" />
                    <span>Новая игра</span>
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-xs">В меню</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="bg-[#120a0a] border border-orange-500/20 p-6 rounded-[2rem] max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Инструкции</h2>
                <button onClick={() => setShowInstructions(false)} className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {TELESTRATIONS_INSTRUCTIONS.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowInstructions(false)} className="w-full py-4 mt-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest">
                Все понятно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
