import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListChecks, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameHeader } from '../../components/GameHeader';
import { PassPhoneCard } from '../../components/PassPhoneCard';
import { PrimaryButton } from '../../components/UI';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { feedbackService } from '../../services/feedbackService';
import { storageService } from '../../services/storageService';
import { TabooCard, getNextTabooCard } from '../../constants/tabooReverseContent';
import { TabooReversePhase } from './types';

interface TabooReverseGameProps {
  playerNames: string[];
  onBack: () => void;
}

interface TeamState {
  name: string;
  players: string[];
  score: number;
  explainerIdx: number;
}

export const TabooReverseGame: React.FC<TabooReverseGameProps> = ({ playerNames, onBack }) => {
  const { difficulty, rounds: settingsRounds, timerSeconds } = useGameSettings();
  const totalRounds = Math.max(settingsRounds * 2, 2); // × 2 so each team plays ≥ settingsRounds
  const cardTimer   = Math.max(timerSeconds, 20);

  // ── Teams ──────────────────────────────────────────────────────────────────
  const half = Math.ceil(playerNames.length / 2);
  const [teamA] = useState<TeamState>(() => ({
    name: 'Команда А',
    players: playerNames.slice(0, half),
    score: 0,
    explainerIdx: 0,
  }));
  const [teamB] = useState<TeamState>(() => ({
    name: 'Команда Б',
    players: playerNames.slice(half),
    score: 0,
    explainerIdx: 0,
  }));

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [explainerIdxA, setExplainerIdxA] = useState(0);
  const [explainerIdxB, setExplainerIdxB] = useState(0);
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');

  // ── Round & card ───────────────────────────────────────────────────────────
  const [roundNum, setRoundNum]     = useState(1);
  const [usedCardIds, setUsedCardIds] = useState<ReadonlySet<number>>(new Set());
  const [card, setCard]             = useState<TabooCard>(() => getNextTabooCard(difficulty, new Set()));

  // ── Phase ─────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<TabooReversePhase>(TabooReversePhase.Pass);

  // ── Playing state ──────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft]     = useState(cardTimer);
  const [timedOut, setTimedOut]     = useState(false);

  // ── Verdict state ─────────────────────────────────────────────────────────
  const [usedWordIdxs, setUsedWordIdxs] = useState<Set<number>>(new Set());

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== TabooReversePhase.Playing) return;
    if (timeLeft <= 0) {
      feedbackService.vibrate([80, 40, 80]);
      setTimedOut(true);
      setPhase(TabooReversePhase.Verdict);
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const team = currentTeam === 'A' ? teamA : teamB;
  const explainerIdx = currentTeam === 'A' ? explainerIdxA : explainerIdxB;
  const currentExplainer = team.players[explainerIdx % team.players.length];
  const currentScore = currentTeam === 'A' ? scoreA : scoreB;
  const otherScore   = currentTeam === 'A' ? scoreB : scoreA;
  const timerPct = (timeLeft / cardTimer) * 100;
  const timerColor =
    timerPct > 50 ? '#22c55e' :
    timerPct > 25 ? '#eab308' : '#ef4444';

  // ── Handlers ──────────────────────────────────────────────────────────────
  const startPlaying = useCallback(() => {
    setTimeLeft(cardTimer);
    setTimedOut(false);
    setUsedWordIdxs(new Set());
    setPhase(TabooReversePhase.Playing);
  }, [cardTimer]);

  const handleEarlySolve = useCallback(() => {
    setPhase(TabooReversePhase.Verdict);
  }, []);

  const toggleWord = useCallback((i: number) => {
    setUsedWordIdxs(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }, []);

  const handleVerdict = useCallback((points: number) => {
    // Update score & advance explainer index
    if (currentTeam === 'A') {
      setScoreA(s => s + points);
      setExplainerIdxA(i => i + 1);
    } else {
      setScoreB(s => s + points);
      setExplainerIdxB(i => i + 1);
    }

    // Celebrate on positive score
    if (points > 0) {
      const settings = storageService.getSettings();
      feedbackService.playSound('success');
      if (settings.visualEffects) {
        confetti({
          particleCount: points === 2 ? 150 : 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: currentTeam === 'A' ? ['#f97316', '#ffffff'] : ['#38bdf8', '#ffffff'],
        });
      }
    } else if (points < 0) {
      feedbackService.playSound('error');
      feedbackService.vibrate(100);
    }

    const newUsed = new Set([...usedCardIds, card.id]);
    setUsedCardIds(newUsed);

    if (roundNum >= totalRounds) {
      setPhase(TabooReversePhase.GameOver);
    } else {
      const nextCard = getNextTabooCard(difficulty, newUsed);
      setCard(nextCard);
      setRoundNum(r => r + 1);
      setCurrentTeam(t => t === 'A' ? 'B' : 'A');
      setPhase(TabooReversePhase.Pass);
    }
  }, [card.id, currentTeam, difficulty, roundNum, totalRounds, usedCardIds]);

  const handleRematch = useCallback(() => {
    setScoreA(0);
    setScoreB(0);
    setExplainerIdxA(0);
    setExplainerIdxB(0);
    setCurrentTeam('A');
    setRoundNum(1);
    const fresh = getNextTabooCard(difficulty, new Set());
    setCard(fresh);
    setUsedCardIds(new Set());
    setPhase(TabooReversePhase.Pass);
  }, [difficulty]);

  // ── Final scores (stable after GameOver) ──────────────────────────────────
  const [finalScoreA, setFinalScoreA] = useState(0);
  const [finalScoreB, setFinalScoreB] = useState(0);
  useEffect(() => {
    if (phase === TabooReversePhase.GameOver) {
      setFinalScoreA(scoreA);
      setFinalScoreB(scoreB);
      const settings = storageService.getSettings();
      if (settings.visualEffects) {
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.5 } });
      }
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen safe-top safe-bottom">
      <GameHeader
        title={GAMES_REGISTRY.taboo_reverse.title}
        subtitle={`Раунд ${roundNum}/${totalRounds} · ${team.name}`}
        icon={ListChecks}
        theme="orange"
        onBack={onBack}
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ── PASS ─────────────────────────────────────────────────────── */}
          {phase === TabooReversePhase.Pass && (
            <motion.div
              key="pass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-full flex flex-col items-center justify-center p-6 gap-8"
            >
              {/* Scoreboard */}
              <div className="flex gap-4 w-full max-w-sm">
                {([['A', teamA.name, scoreA], ['B', teamB.name, scoreB]] as const).map(([key, name, score]) => (
                  <div
                    key={key}
                    className={`flex-1 p-4 rounded-2xl border text-center transition-all ${
                      currentTeam === key
                        ? 'border-premium-orange/50 bg-premium-orange/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                      currentTeam === key ? 'text-premium-orange' : 'text-white/30'
                    }`}>{name}</p>
                    <p className="text-3xl font-black italic">{score}</p>
                  </div>
                ))}
              </div>

              <PassPhoneCard
                playerName={currentExplainer}
                badge={team.name}
                badgeColor="orange"
                instruction="Только ты должен видеть загаданное слово"
                icon={ListChecks}
                accentColor="orange"
                onClick={startPlaying}
              />
            </motion.div>
          )}

          {/* ── PLAYING ──────────────────────────────────────────────────── */}
          {phase === TabooReversePhase.Playing && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col min-h-full"
            >
              {/* Timer bar */}
              <div className="h-1.5 w-full bg-white/10">
                <div
                  className="h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
                />
              </div>

              <div className="flex-1 flex flex-col p-6 gap-6 max-w-lg mx-auto w-full">
                {/* Timer number */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{currentExplainer} объясняет</span>
                  <span
                    className="text-2xl font-black italic tabular-nums"
                    style={{ color: timerColor }}
                  >
                    {timeLeft}с
                  </span>
                </div>

                {/* Secret word */}
                <div className="p-8 rounded-[2rem] border-2 border-premium-orange/30 bg-premium-orange/5 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-orange/50 mb-3">
                    Загаданное слово
                  </p>
                  <h2
                    className="font-black italic uppercase tracking-tighter leading-none text-white"
                    style={{ fontSize: card.word.length > 8 ? '2.8rem' : '3.5rem' }}
                  >
                    {card.word}
                  </h2>
                </div>

                {/* Required words */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 text-center">
                    Обязательные слова — используй все!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {card.required.map((w, i) => (
                      <div
                        key={i}
                        className="px-4 py-2.5 rounded-2xl border border-premium-orange/30 bg-premium-orange/10 font-black italic uppercase text-sm text-premium-orange"
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <PrimaryButton onClick={handleEarlySolve} className="bg-premium-orange !text-white shadow-premium-orange/30">
                    КОМАНДА УГАДАЛА!
                  </PrimaryButton>
                  <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/20 mt-3">
                    Само слово называть нельзя
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── VERDICT ──────────────────────────────────────────────────── */}
          {phase === TabooReversePhase.Verdict && (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col p-6 gap-6 max-w-lg mx-auto w-full"
            >
              {/* Word reveal */}
              <div className="text-center space-y-2 pt-2">
                {timedOut && (
                  <p className="text-[9px] font-black uppercase tracking-widest text-premium-red/70">Время вышло!</p>
                )}
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Загаданное слово</p>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">{card.word}</h2>
              </div>

              {/* Mark used words */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 text-center">
                  Отметьте использованные слова
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {card.required.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => toggleWord(i)}
                      className={`px-4 py-2.5 rounded-2xl border font-black italic uppercase text-sm transition-all active:scale-95 ${
                        usedWordIdxs.has(i)
                          ? 'bg-premium-green/20 border-premium-green/50 text-premium-green line-through opacity-70'
                          : 'bg-white/5 border-white/15 text-white/50'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/20 mt-3">
                  Использовано: {usedWordIdxs.size}/{card.required.length}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Scoring buttons */}
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 text-center">Начислить очки</p>

                <button
                  onClick={() => handleVerdict(2)}
                  className="w-full p-4 bg-premium-green/10 border-2 border-premium-green/40 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="text-left">
                    <p className="font-black italic text-premium-green text-base leading-tight">Угадали + все {card.required.length} слова</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Идеальное исполнение</p>
                  </div>
                  <span className="text-3xl font-black italic text-premium-green ml-4">+2</span>
                </button>

                <button
                  onClick={() => handleVerdict(1)}
                  className="w-full p-4 bg-premium-yellow/10 border-2 border-premium-yellow/30 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="text-left">
                    <p className="font-black italic text-premium-yellow text-base leading-tight">Угадали, но не все слова</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Использовано {usedWordIdxs.size} из {card.required.length}</p>
                  </div>
                  <span className="text-3xl font-black italic text-premium-yellow ml-4">+1</span>
                </button>

                <button
                  onClick={() => handleVerdict(0)}
                  className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="text-left">
                    <p className="font-black italic text-white/50 text-base leading-tight">Не угадали</p>
                  </div>
                  <span className="text-3xl font-black italic text-white/30 ml-4">0</span>
                </button>

                <button
                  onClick={() => handleVerdict(-1)}
                  className="w-full p-4 bg-premium-red/10 border-2 border-premium-red/30 rounded-2xl flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="text-left">
                    <p className="font-black italic text-premium-red text-base leading-tight">Объясняющий назвал слово</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Штраф команде</p>
                  </div>
                  <span className="text-3xl font-black italic text-premium-red ml-4">−1</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── GAME OVER ────────────────────────────────────────────────── */}
          {phase === TabooReversePhase.GameOver && (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center p-6 gap-8 max-w-sm mx-auto w-full"
            >
              <div className="text-center space-y-2 pt-4">
                <Trophy className="w-16 h-16 text-premium-yellow mx-auto mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30">Игра завершена</p>
                {finalScoreA !== finalScoreB ? (
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-premium-yellow">
                    {finalScoreA > finalScoreB ? teamA.name : teamB.name} победила!
                  </h2>
                ) : (
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/70">Ничья!</h2>
                )}
              </div>

              {/* Score cards */}
              <div className="w-full space-y-3">
                {([
                  [teamA, finalScoreA, 'A'] as const,
                  [teamB, finalScoreB, 'B'] as const,
                ]).map(([t, sc, key]) => {
                  const isWinner = finalScoreA !== finalScoreB &&
                    ((key === 'A' && finalScoreA > finalScoreB) ||
                     (key === 'B' && finalScoreB > finalScoreA));
                  return (
                    <div
                      key={key}
                      className={`p-5 rounded-2xl border-2 flex items-center justify-between ${
                        isWinner
                          ? 'border-premium-yellow/60 bg-premium-yellow/10 shadow-[0_0_30px_rgba(234,179,8,0.15)]'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isWinner ? 'text-premium-yellow' : 'text-white/30'}`}>
                          {isWinner ? '🏆 ' : ''}{t.name}
                        </p>
                        <p className="text-sm text-white/40 font-medium">{t.players.join(', ')}</p>
                      </div>
                      <span className={`text-5xl font-black italic ${isWinner ? 'text-premium-yellow' : 'text-white/50'}`}>
                        {sc}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full space-y-3">
                <PrimaryButton onClick={handleRematch} icon={RotateCcw} variant="outline">
                  СЫГРАТЬ СНОВА
                </PrimaryButton>
                <PrimaryButton onClick={onBack} variant="outline">
                  В МЕНЮ
                </PrimaryButton>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
