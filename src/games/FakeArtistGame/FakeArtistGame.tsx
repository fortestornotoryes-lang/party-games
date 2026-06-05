import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Brush, Undo2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '../../types';
import { storageService } from '../../services/storageService';
import { feedbackService, VIBRATE } from '../../services/feedbackService';
import { GameHeader } from '@/components/GameHeader';
import { PrimaryButton } from '@/components/UI';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { FakeArtistDistribution } from './components/FakeArtistDistribution';
import { FakeArtistVoting } from './components/FakeArtistVoting';
import { initFakeArtist } from '../../utils/gameLogic';
import { FakeArtistPhase } from './types';
import { GameCard } from '@/components/GameCard.tsx';

interface Props {
  playerNames: string[];
  onBack: () => void;
}

export const FakeArtistGame: React.FC<Props> = ({ playerNames, onBack }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [phase, setPhase] = useState<FakeArtistPhase>(FakeArtistPhase.Distributing);
  const [gameState, setGameState] = useState({
    word: '',
    category: '',
    rounds: 2,
    timerSeconds: 100,
    canvasImage: '',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokes, setStrokes] = useState<any[]>([]);
  const [currentStroke, setCurrentStroke] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const { players: p } = initFakeArtist(playerNames);
    setPlayers(p);
  }, [playerNames]);

  const playerColor = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][
    turnIndex % (players.length || 1)
  ];

  useEffect(() => {
    if (gameState.timerSeconds > 0 && !isTransitioning && phase === FakeArtistPhase.Playing) {
      setTimeLeft(gameState.timerSeconds);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            confirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [turnIndex, isTransitioning, gameState.timerSeconds, phase]);

  useEffect(() => {
    if (phase !== FakeArtistPhase.Playing) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
    };

    const ro = new ResizeObserver(initCanvas);
    ro.observe(canvas);
    initCanvas();
    return () => ro.disconnect();
  }, [phase]);

  const drawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((s) => {
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.moveTo(s.points[0].x, s.points[0].y);
      s.points.forEach((p: any) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
    if (currentStroke) {
      ctx.beginPath();
      ctx.strokeStyle = playerColor;
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      currentStroke.forEach((p: any) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
  }, [strokes, currentStroke, playerColor]);

  useEffect(() => {
    if (phase === FakeArtistPhase.Playing) drawAll();
  }, [drawAll, phase]);

  const getPos = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const confirm = () => {
    const settings = storageService.getSettings();
    if (turnIndex === players.length * gameState.rounds - 1) {
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.correct);
      if (settings.visualEffects) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#ffffff'],
        });
      }
      setGameState((prev) => ({ ...prev, canvasImage: canvasRef.current!.toDataURL() }));
      setPhase(FakeArtistPhase.Voting);
    } else {
      feedbackService.playSound('click');
      setTurnIndex(turnIndex + 1);
      setHasDrawn(false);
      setIsTransitioning(true);
    }
  };

  if (players.length === 0) return null;

  return (
    <div className="flex flex-col min-h-screen overflow-hidden select-none relative">
      <AnimatePresence mode="wait">
        {phase === FakeArtistPhase.Distributing ? (
          <motion.div
            key="distributing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <FakeArtistDistribution
              players={players}
              onFinish={(word, category, rounds, timerSeconds) => {
                setGameState((prev) => ({ ...prev, word, category, rounds, timerSeconds }));
                setPhase(FakeArtistPhase.Playing);
              }}
            />
          </motion.div>
        ) : phase === FakeArtistPhase.Playing ? (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <GameHeader
              title={GAMES_REGISTRY.fake_artist.title}
              subtitle={`Ход ${turnIndex + 1} / ${players.length * gameState.rounds}`}
              icon={Palette}
              theme="green"
              onBack={onBack}
            />

            <div className="p-6 flex-1 flex flex-col items-center space-y-6">
              <div className="w-full flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-tag text-white/80 font-black uppercase tracking-widest">
                    Рисует
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: playerColor }}
                    />
                    <h3 className="text-2xl font-black italic uppercase text-white leading-none">
                      {players[turnIndex % players.length].name}
                    </h3>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  {gameState.timerSeconds > 0 && (
                    <p
                      className={`text-xl font-black italic mb-1 ${timeLeft <= 5 ? 'text-premium-red animate-pulse' : 'text-white/80'}`}
                    >
                      {timeLeft}с
                    </p>
                  )}
                  <p className="text-tag text-white/80 font-black uppercase tracking-widest">
                    Тема
                  </p>
                  <h3 className="text-xl font-black italic uppercase text-premium-green leading-none">
                    {gameState.category}
                  </h3>
                </div>
              </div>

              <GameCard className="w-full flex-1 !p-0 overflow-hidden relative border-premium-green/20">
                <div
                  ref={containerRef}
                  className="w-full h-full"
                  style={{ touchAction: 'none' }}
                  onMouseDown={(e) => {
                    if (!hasDrawn) {
                      setIsDrawing(true);
                      setCurrentStroke([getPos(e)]);
                    }
                  }}
                  onMouseMove={(e) => {
                    if (isDrawing) setCurrentStroke([...currentStroke, getPos(e)]);
                  }}
                  onMouseUp={() => {
                    if (isDrawing) {
                      setStrokes([...strokes, { points: currentStroke, color: playerColor }]);
                      setIsDrawing(false);
                      setCurrentStroke(null);
                      setHasDrawn(true);
                    }
                  }}
                  onTouchStart={(e) => {
                    if (!hasDrawn) {
                      setIsDrawing(true);
                      setCurrentStroke([getPos(e)]);
                    }
                  }}
                  onTouchMove={(e) => {
                    if (isDrawing) setCurrentStroke([...currentStroke, getPos(e)]);
                  }}
                  onTouchEnd={() => {
                    if (isDrawing) {
                      setStrokes([...strokes, { points: currentStroke, color: playerColor }]);
                      setIsDrawing(false);
                      setCurrentStroke(null);
                      setHasDrawn(true);
                    }
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full bg-white transition-opacity"
                  />
                  {!hasDrawn && !isDrawing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-60 space-y-4">
                      <Brush className="w-16 h-16 text-black" />
                      <span className="font-black italic text-black uppercase tracking-tighter">
                        Нарисуй одну линию
                      </span>
                    </div>
                  )}
                </div>
              </GameCard>

              <div className="w-full flex gap-4 justify-center items-center">
                <button
                  disabled={!hasDrawn}
                  onClick={() => {
                    setStrokes(strokes.slice(0, -1));
                    setHasDrawn(false);
                  }}
                  className="w-20 py-6 bg-white/5 border border-white/10 text-white rounded-premium-lg flex items-center justify-center disabled:opacity-0 active:scale-90 transition-all"
                >
                  <Undo2 className="w-6 h-6" />
                </button>
                <PrimaryButton
                  disabled={!hasDrawn}
                  onClick={confirm}
                  className="bg-premium-green !text-black flex-1 font-semibold"
                >
                  ПОДТВЕРДИТЬ
                </PrimaryButton>
              </div>
            </div>

            {/* Transition overlay — rendered on top, canvas stays mounted underneath */}
            <AnimatePresence>
              {isTransitioning && (
                <motion.div
                  key="transition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col bg-black pt-40 items-center justify-between p-6 space-y-8"
                >
                  <GameCard className="w-full max-w-xs aspect-square flex flex-col items-center justify-center space-y-4 border-premium-green/20 bg-premium-green/5">
                    <Palette className="w-16 h-16 text-premium-green animate-pulse" />
                    <div className="text-center space-y-4">
                      <p className="text-tag text-white/80 font-black uppercase tracking-[0.3em]">
                        Следующий игрок
                      </p>
                      <h3 className="text-5xl font-black italic uppercase text-white tracking-tighter">
                        {players[turnIndex % players.length].name}
                      </h3>
                    </div>
                    <p className="text-xs text-center text-premium-green px-8">
                      Передайте телефон этому игроку и нажмите кнопку ниже
                    </p>
                  </GameCard>

                  <PrimaryButton
                    onClick={() => setIsTransitioning(false)}
                    className="bg-white !text-black"
                  >
                    Я ГОТОВ РИСОВАТЬ
                  </PrimaryButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <FakeArtistVoting
              players={players}
              canvasImage={gameState.canvasImage}
              onReveal={onBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
