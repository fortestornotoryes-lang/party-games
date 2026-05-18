import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, CheckCircle, XCircle, RotateCcw, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../../services/storageService';
import { feedbackService } from '../../services/feedbackService';
import { contentService } from '../../services/contentService';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton } from '../../components/UI';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { useGameSettings } from '../../contexts/GameSettingsContext';

interface JustOneGameProps { playerNames: string[]; onBack: () => void; }

export const JustOneGame: React.FC<JustOneGameProps> = ({ playerNames, onBack }) => {
  const { difficulty } = useGameSettings();
  const [guesserIdx, setGuesserIdx] = useState(0);
  const [word, setWord] = useState('');
  const [hints, setHints] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<'pass' | 'hinting' | 'guessing' | 'result'>('pass');
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [visibleHints, setVisibleHints] = useState<string[]>([]);
  const [localHints, setLocalHints] = useState<Record<string, string>>({});

  useEffect(() => { generateNewWord(); }, [guesserIdx]);

  const generateNewWord = () => {
    const newWord = contentService.getJustOneWord(difficulty);
    setWord(newWord);
    setHints({});
    setLocalHints({});
    setGuess('');
    setPhase('pass');
  };

  const submitHint = (player: string, hint: string) => {
    if (!hint.trim()) return;
    setHints(prev => ({ ...prev, [player]: hint.trim().toLowerCase() }));
  };

  const startGuessing = () => {
    const counts: Record<string, number> = {};
    const vals = Object.values(hints) as string[];
    vals.forEach(h => { counts[h] = (counts[h] || 0) + 1; });
    setVisibleHints(vals.filter(h => counts[h] === 1));
    setPhase('guessing');
  };

  const handleGuess = () => {
    const correct = guess.trim().toLowerCase() === word.toLowerCase();
    setIsCorrect(correct);
    const settings = storageService.getSettings();
    if (correct) {
      feedbackService.playSound('success');
      feedbackService.vibrate([50, 30, 50]);
      if (settings.visualEffects) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFCC1F', '#ffffff'] });
      }
    } else {
      feedbackService.playSound('error');
      feedbackService.vibrate(100);
    }
    setPhase('result');
  };

  const guesser = playerNames[guesserIdx];
  const hinters = playerNames.filter((_, i) => i !== guesserIdx);
  const allHinted = Object.keys(hints).length === hinters.length;

  return (
    <div className="flex flex-col h-screen">
      <GameHeader
        title={GAMES_REGISTRY.just_one.title}
        subtitle="Пойми намёк"
        icon={Lightbulb}
        themeColor="border-premium-yellow/50 text-premium-yellow"
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ── PASS ── */}
          {phase === 'pass' && (
            <motion.div
              key="pass"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="min-h-full flex flex-col items-center justify-center gap-8 p-6 text-center"
            >
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/25">Новый раунд</p>
                <h3 className="text-base font-black uppercase tracking-[0.3em] text-white/50">Отгадывает:</h3>
                <h2 className="text-[52px] font-black italic uppercase text-premium-yellow tracking-tighter leading-none"
                  style={{ textShadow: '0 0 40px rgba(255,204,31,0.3)' }}>
                  {guesser}
                </h2>
              </div>

              <div className="w-full max-w-sm p-6 bg-premium-yellow/[0.05] border border-premium-yellow/15 rounded-[28px] text-sm text-white/40 leading-relaxed">
                {guesser}, передай телефон остальным. Только они увидят загаданное слово!
              </div>

              <PrimaryButton onClick={() => setPhase('hinting')}>МЫ ВЗЯЛИ ТЕЛЕФОН</PrimaryButton>
            </motion.div>
          )}

          {/* ── HINTING ── */}
          {phase === 'hinting' && (
            <motion.div
              key="hinting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 space-y-6"
            >
              <div className="text-center space-y-2 pt-2">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-premium-yellow/40">Загаданное слово</p>
                <h2 className="text-[52px] font-black italic uppercase text-white tracking-tighter leading-none">
                  {word}
                </h2>
              </div>

              <div className="p-4 rounded-[18px] bg-premium-yellow/[0.05] border border-premium-yellow/15 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Отгадывает</p>
                <h3 className="text-xl font-black italic uppercase text-premium-yellow">{guesser}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/35">Подсказки</span>
                  <span className="text-[9px] font-black px-3 py-1 bg-white/[0.04] rounded-full text-white/30 border border-white/[0.05]">
                    {Object.keys(hints).length}/{hinters.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {hinters.map(player => (
                    <div key={player} className="bg-white/[0.03] border border-white/[0.07] rounded-[16px] p-3 flex items-center gap-3">
                      <span className="text-sm font-black italic text-white/70 shrink-0 min-w-[72px]">{player}</span>
                      {hints[player] ? (
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-black italic uppercase tracking-tight text-premium-yellow/70">{hints[player]}</span>
                          <CheckCircle className="w-4 h-4 text-premium-green shrink-0" />
                        </div>
                      ) : (
                        <div className="flex flex-1 items-center gap-2">
                          <input
                            type="text"
                            value={localHints[player] || ''}
                            onChange={e => setLocalHints(prev => ({ ...prev, [player]: e.target.value }))}
                            placeholder="Подсказка..."
                            className="flex-1 h-9 bg-white/[0.04] border border-white/[0.08] rounded-[10px] px-3 text-sm focus:border-premium-yellow/40 outline-none transition-colors"
                            onKeyDown={e => { if (e.key === 'Enter') submitHint(player, localHints[player] || ''); }}
                          />
                          <button
                            onClick={() => submitHint(player, localHints[player] || '')}
                            className="w-9 h-9 shrink-0 bg-premium-yellow text-black rounded-[10px] flex items-center justify-center active:scale-95 transition-transform"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {allHinted && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <PrimaryButton onClick={startGuessing}>
                    ГОТОВО! ПОКАЗАТЬ {guesser.toUpperCase()}
                  </PrimaryButton>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── GUESSING ── */}
          {phase === 'guessing' && (
            <motion.div
              key="guessing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 space-y-8"
            >
              <div className="text-center space-y-1 pt-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-premium-yellow">{guesser}</h3>
                <p className="text-sm text-white/40 font-medium">Угадай слово по подсказкам команды</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {visibleHints.map((hint, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 320, damping: 22 }}
                    className="px-5 py-3 bg-premium-yellow/[0.07] border border-premium-yellow/20 rounded-[18px]"
                  >
                    <span className="text-xl font-black italic uppercase tracking-tight text-premium-yellow">{hint}</span>
                  </motion.div>
                ))}
                {visibleHints.length === 0 && (
                  <p className="text-white/25 text-sm italic">Все подсказки совпали — ни одной не осталось!</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={guess}
                  onChange={e => setGuess(e.target.value)}
                  placeholder="Твоя догадка..."
                  onKeyDown={e => { if (e.key === 'Enter' && guess.trim()) handleGuess(); }}
                  className="w-full py-5 bg-white/[0.04] border border-white/[0.08] rounded-[20px] text-center text-3xl font-black italic uppercase outline-none focus:border-premium-yellow/40 transition-all placeholder:text-white/15"
                />
                <PrimaryButton onClick={handleGuess} disabled={!guess.trim()}>
                  ОТВЕТИТЬ
                </PrimaryButton>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="min-h-full flex flex-col p-6 items-center justify-center text-center gap-8"
            >
              <div className="space-y-4">
                {isCorrect ? (
                  <>
                    <div className="relative">
                      <div className="absolute -inset-12 blur-[50px] rounded-full bg-premium-green/15" />
                      <CheckCircle className="w-20 h-20 text-premium-green mx-auto relative" />
                    </div>
                    <h2 className="text-[64px] font-black italic uppercase tracking-tighter text-premium-green leading-none">
                      ПРАВИЛЬНО!
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <div className="absolute -inset-12 blur-[50px] rounded-full bg-premium-red/15" />
                      <XCircle className="w-20 h-20 text-premium-red mx-auto relative" />
                    </div>
                    <h2 className="text-[64px] font-black italic uppercase tracking-tighter text-premium-red leading-none">
                      ОШИБКА
                    </h2>
                  </>
                )}

                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/25">Загаданное слово</p>
                  <div className="text-4xl font-black italic uppercase tracking-tighter text-white">{word}</div>
                  {!isCorrect && (
                    <p className="text-sm text-white/35 font-medium mt-1">Ответ: <span className="italic">{guess}</span></p>
                  )}
                </div>
              </div>

              <PrimaryButton onClick={() => setGuesserIdx(i => (i + 1) % playerNames.length)} icon={RotateCcw}>
                СЛЕДУЮЩИЙ РАУНД
              </PrimaryButton>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
