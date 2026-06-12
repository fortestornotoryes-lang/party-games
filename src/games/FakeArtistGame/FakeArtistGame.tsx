import confetti from 'canvas-confetti';
import {Brush, Palette, Undo2} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {FakeArtistDistribution} from './components/FakeArtistDistribution';
import {FakeArtistVoting} from './components/FakeArtistVoting';
import {initFakeArtist} from './model/initFakeArtist';
import {FakeArtistPhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {GAMES_REGISTRY} from '@/entities/game/registry';
import {GameKey} from '@/entities/game/types';
import type {Player} from '@/entities/player/types';
import {GameCard} from '@/shared/components/GameCard';
import {PrimaryButton} from '@/shared/components/PrimaryButton';
import {usePersistedState} from '@/shared/hooks/usePersistedState';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import {feedbackService, VIBRATE} from '@/shared/services/feedbackService';
import {storageService} from '@/shared/services/storageService';

interface Props {
    playerNames: string[];
    onBack: () => void;
}

export const FakeArtistGame: React.FC<Props> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const K = GameKey.FakeArtist;
    const [players, setPlayers] = usePersistedState<Player[]>(K, 'players', []);
    const [phase, setPhase] = usePersistedState<FakeArtistPhase>(
        K,
        'phase',
        FakeArtistPhase.Distributing
    );
    const [gameState, setGameState] = usePersistedState(K, 'gameState', {
        word: '',
        category: '',
        rounds: 2,
        timerSeconds: 100,
        canvasImage: '',
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawAllRef = useRef<() => void>(() => undefined);
    const [turnIndex, setTurnIndex] = usePersistedState(K, 'turnIndex', 0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = usePersistedState(K, 'hasDrawn', false);
    const [strokes, setStrokes] = usePersistedState<any[]>(K, 'strokes', []);
    const [currentStroke, setCurrentStroke] = useState<any>(null);
    const [isTransitioning, setIsTransitioning] = usePersistedState(K, 'isTransitioning', true);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Роли уже восстановлены из сессии — не раздаём заново.
        if (players.length > 0) return;
        const {players: p} = initFakeArtist(playerNames);
        setPlayers(p);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            return () => {
                clearInterval(timer);
            };
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
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 4;
            // Пересоздание битмапа стирает рисунок — восстанавливаем штрихи
            drawAllRef.current();
        };

        const ro = new ResizeObserver(initCanvas);
        ro.observe(canvas);
        initCanvas();
        return () => {
            ro.disconnect();
        };
    }, [phase]);

    const drawAll = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Координаты штрихов хранятся в CSS-пикселях (getPos). Масштаб битмап/CSS
        // считаем в момент отрисовки — как в DrawingCanvas, иначе при расхождении
        // размеров линия уезжает от пальца.
        ctx.setTransform(canvas.width / rect.width, 0, 0, canvas.height / rect.height, 0, 0);
        strokes.forEach((s) => {
            ctx.beginPath();
            ctx.strokeStyle = s.color;
            ctx.moveTo(s.points[0].x, s.points[0].y);
            s.points.forEach((p: any) => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        });
        if (currentStroke) {
            ctx.beginPath();
            ctx.strokeStyle = playerColor;
            ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
            currentStroke.forEach((p: any) => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        }
    }, [strokes, currentStroke, playerColor]);

    useEffect(() => {
        drawAllRef.current = drawAll;
    }, [drawAll]);

    useEffect(() => {
        if (phase === FakeArtistPhase.Playing) drawAll();
    }, [drawAll, phase]);

    const getPos = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return {x: 0, y: 0};
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {x: clientX - rect.left, y: clientY - rect.top};
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
                    origin: {y: 0.6},
                    colors: ['#10b981', '#ffffff'],
                });
            }
            setGameState((prev) => ({...prev, canvasImage: canvasRef.current?.toDataURL() ?? ''}));
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
        <div className="relative flex min-h-screen flex-col overflow-hidden select-none">
            <AnimatePresence mode="wait">
                {phase === FakeArtistPhase.Distributing ? (
                    <motion.div
                        key="distributing"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="flex flex-1 flex-col"
                    >
                        <FakeArtistDistribution
                            players={players}
                            onFinish={(word, category, rounds, timerSeconds) => {
                                setGameState((prev) => ({...prev, word, category, rounds, timerSeconds}));
                                setPhase(FakeArtistPhase.Playing);
                            }}
                        />
                    </motion.div>
                ) : phase === FakeArtistPhase.Playing ? (
                    <motion.div
                        key="playing"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="flex flex-1 flex-col"
                    >
                        <GameHeader
                            title={GAMES_REGISTRY.fake_artist.title}
                            subtitle={t(`${NS.FAKE_ARTIST}.turnSubtitle`, {
                                current: turnIndex + 1,
                                total: players.length * gameState.rounds,
                            })}
                            icon={Palette}
                            theme="green"
                            onBack={onBack}
                        />

                        <div className="flex flex-1 flex-col items-center space-y-6 p-6">
                            <div className="flex w-full items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-tag font-black tracking-widest text-white/80 uppercase">
                                        {t(`${NS.FAKE_ARTIST}.drawingLabel`)}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{backgroundColor: playerColor}}
                                        />
                                        <h3 className="text-2xl leading-none font-black text-white uppercase italic">
                                            {players[turnIndex % players.length].name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    {gameState.timerSeconds > 0 && (
                                        <p
                                            className={`mb-1 text-xl font-black italic ${timeLeft <= 5 ? 'text-premium-red animate-pulse' : 'text-white/80'}`}
                                        >
                                            {t(`${NS.FAKE_ARTIST}.timerSeconds`, {n: timeLeft})}
                                        </p>
                                    )}
                                    <p className="text-tag font-black tracking-widest text-white/80 uppercase">
                                        {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                                    </p>
                                    <h3 className="text-premium-green text-xl leading-none font-black uppercase italic">
                                        {gameState.category}
                                    </h3>
                                </div>
                            </div>

                            <GameCard className="border-premium-green/20 relative w-full flex-1 overflow-hidden !p-0">
                                <div
                                    ref={containerRef}
                                    className="h-full w-full"
                                    style={{touchAction: 'none'}}
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
                                            setStrokes([...strokes, {points: currentStroke, color: playerColor}]);
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
                                            setStrokes([...strokes, {points: currentStroke, color: playerColor}]);
                                            setIsDrawing(false);
                                            setCurrentStroke(null);
                                            setHasDrawn(true);
                                        }
                                    }}
                                >
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 h-full w-full bg-white transition-opacity"
                                    />
                                    {!hasDrawn && !isDrawing && (
                                        <div
                                            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-60">
                                            <Brush className="h-16 w-16 text-black"/>
                                            <span className="font-black tracking-tighter text-black uppercase italic">
                        {t(`${NS.FAKE_ARTIST}.drawOneLine`)}
                      </span>
                                        </div>
                                    )}
                                </div>
                            </GameCard>

                            <div className="flex w-full items-center justify-center gap-4">
                                <button
                                    disabled={!hasDrawn}
                                    onClick={() => {
                                        setStrokes(strokes.slice(0, -1));
                                        setHasDrawn(false);
                                    }}
                                    className="rounded-premium-lg flex w-20 items-center justify-center border border-white/10 bg-white/5 py-6 text-white transition-all active:scale-90 disabled:opacity-0"
                                >
                                    <Undo2 className="h-6 w-6"/>
                                </button>
                                <PrimaryButton
                                    disabled={!hasDrawn}
                                    onClick={confirm}
                                    className=" font-semibold !text-black"
                                    variant='emerald'
                                >
                                    {t(`${NS.FAKE_ARTIST}.confirm`)}
                                </PrimaryButton>
                            </div>
                        </div>

                        {/* Transition overlay — rendered on top, canvas stays mounted underneath */}
                        <AnimatePresence>
                            {isTransitioning && (
                                <motion.div
                                    key="transition"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    className="absolute inset-0 z-10 flex flex-col space-y-8 bg-black p-6 pt-40 items-center justify-end"
                                >
                                    <GameCard
                                        className="border-premium-green/20 bg-premium-green/5 flex aspect-square w-full max-w-xs flex-col items-center justify-center space-y-4 flex-1">
                                        <Palette className="text-premium-green h-16 w-16 animate-pulse"/>
                                        <div className="space-y-4 text-center">
                                            <p className="text-tag font-black tracking-[0.3em] text-white/80 uppercase">
                                                {t(`${NS.FAKE_ARTIST}.nextPlayer`)}
                                            </p>
                                            <h3 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                                                {players[turnIndex % players.length].name}
                                            </h3>
                                        </div>
                                        <p className="text-premium-green px-8 text-center text-xs">
                                            {t(`${NS.FAKE_ARTIST}.passPhoneInstruction`)}
                                        </p>
                                    </GameCard>

                                    <PrimaryButton
                                        onClick={() => {
                                            setIsTransitioning(false);
                                        }}
                                        variant='emerald'
                                    >
                                        {t(`${NS.FAKE_ARTIST}.readyToDraw`)}
                                    </PrimaryButton>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        key="voting"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="flex flex-1 flex-col"
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
