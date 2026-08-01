import { Canvas, Fill, Path, useCanvasRef } from '@shopify/react-native-skia';
import { Brush, Palette, Undo2 } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FakeArtistDistribution } from './components/FakeArtistDistribution';
import { FakeArtistVoting } from './components/FakeArtistVoting';
import { initFakeArtist } from './model/initFakeArtist';
import { FakeArtistPhase } from './types';

import { GameKey } from '@/entities/game/types';
import type { Player } from '@/entities/player/types';
import { GameCard } from '@/shared/components/GameCard';
import { GameHeader } from '@/shared/components/GameHeader';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useCountdown } from '@/shared/hooks/useCountdown';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';

interface Props {
  playerNames: string[];
  onBack: () => void;
}

interface Point {
  x: number;
  y: number;
}

/** Один штрих: игрок рисует ровно одну линию за ход. */
interface Stroke {
  points: Point[];
  color: string;
}

const toSvgPath = (points: Point[]): string => {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(' ');
};

export const FakeArtistGame: React.FC<Props> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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

  const canvasRef = useCanvasRef();
  const [turnIndex, setTurnIndex] = usePersistedState(K, 'turnIndex', 0);
  const [hasDrawn, setHasDrawn] = usePersistedState(K, 'hasDrawn', false);
  const [strokes, setStrokes] = usePersistedState<Stroke[]>(K, 'strokes', []);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isTransitioning, setIsTransitioning] = usePersistedState(K, 'isTransitioning', true);

  useEffect(() => {
    // Роли уже восстановлены из сессии — не раздаём заново.
    if (players.length > 0) return;
    const { players: p } = initFakeArtist(playerNames);
    setPlayers(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerNames]);

  const playerColor = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][
    turnIndex % (players.length || 1)
  ];

  const confirm = () => {
    if (turnIndex === players.length * gameState.rounds - 1) {
      feedbackService.playSound('success');
      feedbackService.vibrate(VIBRATE.correct);
      feedbackService.celebrate('success', {
        particleCount: 100,
        colors: ['#10b981', '#ffffff'],
      });
      const image = canvasRef.current?.makeImageSnapshot();
      setGameState((prev) => ({
        ...prev,
        canvasImage: image ? `data:image/png;base64,${image.encodeToBase64()}` : '',
      }));
      setPhase(FakeArtistPhase.Voting);
    } else {
      feedbackService.playSound('click');
      setTurnIndex(turnIndex + 1);
      setHasDrawn(false);
      setIsTransitioning(true);
    }
  };

  const timerActive =
    gameState.timerSeconds > 0 && !isTransitioning && phase === FakeArtistPhase.Playing;
  const [timeLeft, setTimeLeft] = useCountdown(timerActive, gameState.timerSeconds, () => {
    confirm();
  });

  // Новый ход — перезапускаем отсчёт
  useEffect(() => {
    if (timerActive) setTimeLeft(gameState.timerSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnIndex, timerActive, gameState.timerSeconds]);

  const appendPoint = (x: number, y: number) => {
    if (hasDrawn) return;
    setCurrentPoints((prev) => [...prev, { x, y }]);
  };

  const endStroke = () => {
    setCurrentPoints((prev) => {
      if (prev.length > 1) {
        setStrokes((s) => [...s, { points: prev, color: playerColor }]);
        setHasDrawn(true);
      }
      return [];
    });
  };

  const pan = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(appendPoint)(e.x, e.y);
    })
    .onChange((e) => {
      runOnJS(appendPoint)(e.x, e.y);
    })
    .onEnd(() => {
      runOnJS(endStroke)();
    })
    .minDistance(0);

  if (players.length === 0) return null;

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <AnimatePresence exitBeforeEnter>
        {phase === FakeArtistPhase.Distributing ? (
          <MotiView
            key="distributing"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <FakeArtistDistribution
              players={players}
              onFinish={(word, category, rounds, timerSeconds) => {
                setGameState((prev) => ({ ...prev, word, category, rounds, timerSeconds }));
                setPhase(FakeArtistPhase.Playing);
              }}
            />
          </MotiView>
        ) : phase === FakeArtistPhase.Playing ? (
          <View className="flex-1">
            <GameHeader
              title={t('registry.games.fake_artist.title')}
              subtitle={t(`${NS.FAKE_ARTIST}.turnSubtitle`, {
                current: turnIndex + 1,
                total: players.length * gameState.rounds,
              })}
              icon={Palette}
              theme="green"
              onBack={onBack}
            />

            <View className="flex-1 items-center gap-6 p-6">
              <View className="w-full flex-row items-center justify-between">
                <View className="gap-1">
                  <Text
                    className="text-tag font-black uppercase text-white/80"
                    style={{ letterSpacing: 2 }}
                  >
                    {t(`${NS.FAKE_ARTIST}.drawingLabel`)}
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <View className="h-3 w-3 rounded-full" style={{ backgroundColor: playerColor }} />
                    <Text className="text-2xl font-black uppercase italic text-white">
                      {players[turnIndex % players.length].name}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  {gameState.timerSeconds > 0 && (
                    <Text
                      className={`mb-1 text-xl font-black italic ${
                        timeLeft <= 5 ? 'text-premium-red' : 'text-white/80'
                      }`}
                    >
                      {t(`${NS.FAKE_ARTIST}.timerSeconds`, { n: timeLeft })}
                    </Text>
                  )}
                  <Text
                    className="text-tag font-black uppercase text-white/80"
                    style={{ letterSpacing: 2 }}
                  >
                    {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                  </Text>
                  <Text className="text-premium-green text-xl font-black uppercase italic">
                    {gameState.category}
                  </Text>
                </View>
              </View>

              <GameCard className="border-premium-green/20 relative w-full flex-1 overflow-hidden !p-0">
                <GestureDetector gesture={pan}>
                  <Canvas ref={canvasRef} style={{ flex: 1 }}>
                    <Fill color="#ffffff" />
                    {strokes.map((s, i) => (
                      <Path
                        key={i}
                        path={toSvgPath(s.points)}
                        color={s.color}
                        style="stroke"
                        strokeWidth={4}
                        strokeCap="round"
                        strokeJoin="round"
                      />
                    ))}
                    {currentPoints.length > 1 && (
                      <Path
                        path={toSvgPath(currentPoints)}
                        color={playerColor}
                        style="stroke"
                        strokeWidth={4}
                        strokeCap="round"
                        strokeJoin="round"
                      />
                    )}
                  </Canvas>
                </GestureDetector>
                {!hasDrawn && currentPoints.length === 0 && (
                  <View
                    pointerEvents="none"
                    className="absolute inset-0 items-center justify-center gap-4"
                    style={{ opacity: 0.6 }}
                  >
                    <Brush size={64} color="#000" />
                    <Text
                      className="font-black uppercase italic text-black"
                      style={{ letterSpacing: -0.3 }}
                    >
                      {t(`${NS.FAKE_ARTIST}.drawOneLine`)}
                    </Text>
                  </View>
                )}
              </GameCard>

              <View className="w-full flex-row items-center justify-center gap-4">
                <Pressable
                  disabled={!hasDrawn}
                  onPress={() => {
                    setStrokes(strokes.slice(0, -1));
                    setHasDrawn(false);
                  }}
                  className="rounded-premium-lg w-20 items-center justify-center border border-white/10 bg-white/5 py-6"
                  style={{ opacity: hasDrawn ? 1 : 0 }}
                >
                  <Undo2 size={24} color="#fff" />
                </Pressable>
                <View className="flex-1">
                  <PrimaryButton disabled={!hasDrawn} onClick={confirm} variant="emerald">
                    {t(`${NS.FAKE_ARTIST}.confirm`)}
                  </PrimaryButton>
                </View>
              </View>
            </View>

            {/* Оверлей перехода — канвас остаётся смонтированным под ним */}
            <AnimatePresence>
              {!!isTransitioning && (
                <MotiView
                  key="transition"
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 items-center justify-end gap-8 bg-black p-6"
                  style={{ paddingTop: 160, paddingBottom: insets.bottom + 24 }}
                >
                  <GameCard className="border-premium-green/20 bg-premium-green/5 aspect-square w-full max-w-xs flex-1 items-center justify-center gap-4">
                    <Palette size={64} color="#10b981" />
                    <View className="items-center gap-4">
                      <Text
                        className="text-tag text-center font-black uppercase text-white/80"
                        style={{ letterSpacing: 3 }}
                      >
                        {t(`${NS.FAKE_ARTIST}.nextPlayer`)}
                      </Text>
                      <Text className="text-center text-5xl font-black uppercase italic text-white">
                        {players[turnIndex % players.length].name}
                      </Text>
                    </View>
                    <Text className="text-premium-green px-8 text-center text-xs">
                      {t(`${NS.FAKE_ARTIST}.passPhoneInstruction`)}
                    </Text>
                  </GameCard>

                  <PrimaryButton
                    onClick={() => {
                      setIsTransitioning(false);
                    }}
                    variant="emerald"
                  >
                    {t(`${NS.FAKE_ARTIST}.readyToDraw`)}
                  </PrimaryButton>
                </MotiView>
              )}
            </AnimatePresence>
          </View>
        ) : (
          <MotiView
            key="voting"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <FakeArtistVoting players={players} canvasImage={gameState.canvasImage} onReveal={onBack} />
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};
