import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, MessageSquare, ArrowRight, RotateCcw, Home, HelpCircle, X, CheckCircle2, Eraser, Download } from 'lucide-react';
import { TELESTRATIONS_INSTRUCTIONS, STARTING_WORDS } from '../constants/telestrationsContent';

interface TelestrationsGameProps {
  playerNames: string[];
  onBack: () => void;
}

type Step = {
  type: 'draw' | 'guess';
  content: string; // dataUrl for draw, text for guess
  author: string;
};

export const TelestrationsGame: React.FC<TelestrationsGameProps> = ({ playerNames, onBack }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentRound, setCurrentRound] = useState(0); // 0 to playerNames.length - 1
  const [phase, setPhase] = useState<'start' | 'action' | 'transition' | 'gallery'>('start');
  const [initialWord, setInitialWord] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(4);

  // Guess input
  const [guess, setGuess] = useState('');

  const currentPlayer = playerNames[currentRound];
  const isDrawingRound = currentRound % 2 === 0;

  useEffect(() => {
    if (phase === 'start' && currentRound === 0) {
      const word = STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
      setCurrentWord(word);
      setInitialWord(word);
    }
  }, [phase, currentRound]);

  const startAction = () => {
    setPhase('action');
    setGuess('');
    // Clear canvas will happen via effect or when mounting action
  };

  const handleFinishAction = () => {
    let content = '';
    if (isDrawingRound) {
      content = canvasRef.current?.toDataURL() || '';
    } else {
      content = guess;
      setCurrentWord(guess);
    }

    const newStep: Step = {
      type: isDrawingRound ? 'draw' : 'guess',
      content,
      author: currentPlayer
    };

    const newSteps = [...steps, newStep];
    setSteps(newSteps);

    if (currentRound === playerNames.length - 1) {
      setPhase('gallery');
    } else {
      setCurrentRound(prev => prev + 1);
      setPhase('transition');
    }
  };

  // Canvas Logic
  useEffect(() => {
    if (phase === 'action' && isDrawingRound && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const updateCanvasSize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Use integral dimensions for the buffer
        const newWidth = Math.round(rect.width * dpr);
        const newHeight = Math.round(rect.height * dpr);

        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          // Store content before resize
          let tempContent;
          if (canvas.width > 0 && canvas.height > 0) {
            try {
              tempContent = ctx.getImageData(0, 0, canvas.width, canvas.height);
            } catch (e) {}
          }

          canvas.width = newWidth;
          canvas.height = newHeight;
          
          if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Fill background
            ctx.fillStyle = '#120a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (tempContent) {
              try { ctx.putImageData(tempContent, 0, 0); } catch(e) {}
            }
          }
        }
      };

      const ro = new ResizeObserver(() => {
        updateCanvasSize();
      });

      const parent = canvas.parentElement;
      if (parent) {
        ro.observe(parent);
      }
      updateCanvasSize();

      return () => ro.disconnect();
    }
  }, [phase, isDrawingRound]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Calculate based on buffer resolution vs display size
    const dpr = window.devicePixelRatio || 1;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e, canvas);
    const dpr = window.devicePixelRatio || 1;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#120a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0502] text-[#e5e7eb] font-sans overflow-hidden select-none">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-[#0a0502]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Pencil className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">Tele<span className="text-orange-500">strations</span></h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Испорченный телефон // Раунд {currentRound + 1}</p>
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

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="h-full flex flex-col items-center justify-center p-8 space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                  <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Первый игрок</span>
                </div>
                <h3 className="text-4xl font-black italic">{currentPlayer}</h3>
                <p className="text-gray-500">Запомни слово и нарисуй его так, чтобы другие поняли</p>
              </div>

              <div className="w-full max-w-sm p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-2 group">
                <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-none">Твое секретное слово</p>
                <h4 className="text-3xl font-black text-orange-400 group-hover:scale-105 transition-transform">{currentWord}</h4>
              </div>

              <button
                onClick={startAction}
                className="w-full max-w-sm py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl"
              >
                <span>Я готов рисовать</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {phase === 'transition' && (
            <motion.div 
              key="transition"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="h-full flex flex-col items-center justify-center p-8 space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                  <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Следующий игрок</span>
                </div>
                <h3 className="text-4xl font-black italic">{currentPlayer}</h3>
                <p className="text-gray-500">
                  {isDrawingRound 
                    ? "Увидь слово и нарисуй его" 
                    : "Посмотри на рисунок и угадай, что это"}
                </p>
              </div>

              <div className="w-24 h-24 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />

              <button
                onClick={startAction}
                className="w-full max-w-sm py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl"
              >
                <span>Принять телефон</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {phase === 'action' && (
            <motion.div 
              key="action"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col"
            >
              {isDrawingRound ? (
                <div className="flex-1 flex flex-col p-4 space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <div className="space-y-0.5">
                       <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Рисуешь</p>
                       <p className="text-xl font-black text-orange-400">{currentWord}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                       <button onClick={clearCanvas} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-all">
                         <Eraser className="w-5 h-5" />
                       </button>
                       <button onClick={handleFinishAction} className="p-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all">
                         <CheckCircle2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>

                  <div className="flex-1 relative bg-[#120a0a] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
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
                    
                    {/* Brush controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/10 flex flex-col items-center space-y-4 shadow-2xl">
                       <div className="flex items-center space-x-2 px-2">
                         {['#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#000000'].map(color => (
                           <button
                            key={color}
                            onClick={() => setBrushColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${brushColor === color ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                           />
                         ))}
                         <div className="w-px h-6 bg-white/10 mx-2" />
                         <input 
                          type="color" 
                          value={brushColor} 
                          onChange={(e) => setBrushColor(e.target.value)}
                          className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer p-0 overflow-hidden"
                         />
                       </div>

                       <div className="flex items-center space-x-4 px-2 w-full">
                         <div className="flex items-center space-x-3 flex-1 justify-center">
                           {[2, 4, 8, 16, 24].map(size => (
                             <button
                              key={size}
                              onClick={() => setBrushSize(size)}
                              className="group relative flex items-center justify-center p-1"
                             >
                               <div 
                                className={`rounded-full transition-all ${brushSize === size ? 'bg-orange-500 scale-110 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/20 hover:bg-white/40'}`}
                                style={{ width: Math.max(4, size/2), height: Math.max(4, size/2) }}
                               />
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-6 space-y-8 items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Угадай рисунок</p>
                    <h3 className="text-2xl font-black italic">Что здесь изображено?</h3>
                  </div>

                  <div className="w-full max-w-sm aspect-square bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl p-4">
                    <img src={steps[steps.length - 1].content} alt="Drawing" className="w-full h-full object-contain" />
                  </div>

                  <div className="w-full max-w-sm space-y-4">
                    <input 
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="Напиши ответ..."
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-bold placeholder:text-gray-700 focus:border-orange-500 focus:bg-orange-500/5 transition-all outline-none"
                    />
                    <button
                      disabled={!guess.trim()}
                      onClick={handleFinishAction}
                      className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 disabled:opacity-20 transition-all shadow-2xl"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Готово</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {phase === 'gallery' && (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col p-6 space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Финал цепочки</h3>
                <p className="text-gray-500 text-sm">Смотрите, как менялось слово</p>
              </div>

              <div className="space-y-6 pb-20">
                 {/* Original Word */}
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500">START</div>
                    <div className="flex-1 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                      <p className="text-xs text-orange-500 uppercase font-black tracking-widest mb-1">Исходное слово</p>
                      <p className="text-2xl font-bold italic">{initialWord || "Загаданное слово"}</p>
                    </div>
                 </div>

                 {steps.map((step, idx) => (
                   <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col space-y-2"
                   >
                     <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black">{idx + 1}</div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-600">{step.author}</p>
                     </div>
                     
                     <div className="ml-16 bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden p-4">
                        {step.type === 'draw' ? (
                          <img src={step.content} alt="Step drawing" className="w-full bg-[#120a0a] rounded-xl" />
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-2xl font-black italic">"{step.content}"</p>
                          </div>
                        )}
                     </div>
                   </motion.div>
                 ))}
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0502] via-[#0a0502] to-transparent">
                <button
                  onClick={onBack}
                  className="w-full max-w-sm mx-auto py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl h-fit"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>В меню</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

       {/* Instructions Modal */}
       <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#120a0a] border border-orange-500/20 p-8 rounded-[2.5rem] max-w-lg w-full relative">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowInstructions(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-orange-500 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Инструкции</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                  {TELESTRATIONS_INSTRUCTIONS.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.content}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowInstructions(false)} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest">
                  Все понятно
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
