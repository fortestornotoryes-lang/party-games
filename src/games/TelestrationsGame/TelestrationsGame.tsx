import React, { useState, useEffect } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, MessageSquare, ArrowRight, Home, HelpCircle, Shuffle, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../../services/storageService';
import { feedbackService } from '../../services/feedbackService';
import { WORDS_BY_DIFFICULTY, DIFFICULTY_CONFIG, Difficulty } from '../../constants/telestrationsContent';
import { GAME_INSTRUCTIONS } from '../../constants/instructions';
import { GameKey } from '../../types/games';
import { shuffle } from '../../utils/random';
import { InstructionsModal } from '../../components/InstructionsModal';
import { DrawingCanvas } from '../../components/DrawingCanvas';

interface TelestrationsGameProps {
  playerNames: string[];
  onBack: () => void;
  initialDifficulty?: Difficulty;
  initialRounds?: number;
}

type Step = {
  type: 'draw' | 'guess';
  content: string;
  author: string;
};


export const TelestrationsGame: React.FC<TelestrationsGameProps> = ({ playerNames, onBack, initialDifficulty, initialRounds }) => {
  const [shuffledPlayers, setShuffledPlayers] = useState(() => shuffle(playerNames));
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  const [initState] = useState(() => {
    if (!initialDifficulty) return null;
    const staticWords = WORDS_BY_DIFFICULTY[initialDifficulty];
    const custom = storageService.getCustomWords('telestrations');
    const used = storageService.getUsedWords('telestrations');
    const all = [...staticWords, ...custom];
    let available = all.filter(w => !used.includes(w));
    if (available.length === 0) {
      storageService.resetUsedWords('telestrations');
      available = [...staticWords, ...custom];
    }
    const word = available[Math.floor(Math.random() * available.length)];
    storageService.markWordAsUsed('telestrations', word);
    return { word, difficulty: initialDifficulty, rounds: initialRounds ?? 1 };
  });

  const [phase, setPhase] = useState<'setup' | 'start' | 'action' | 'transition' | 'gallery'>(initState ? 'start' : 'setup');
  const [difficulty, setDifficulty] = useState<Difficulty>(initState?.difficulty ?? 'medium');
  const [selectedRounds, setSelectedRounds] = useState(initState?.rounds ?? 1);
  const [initialWord, setInitialWord] = useState(initState?.word ?? '');
  const [currentWord, setCurrentWord] = useState(initState?.word ?? '');

  const [showInstructions, setShowInstructions] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useCountdown(phase === 'action');

  const currentPlayer = shuffledPlayers[currentRound];
  const isDrawingRound = currentRound % 2 === 0;

  const handleStartGame = () => {
    const staticWords = WORDS_BY_DIFFICULTY[difficulty];
    const custom = storageService.getCustomWords('telestrations');
    const used = storageService.getUsedWords('telestrations');

    const all = [...staticWords, ...custom];
    let available = all.filter(w => !used.includes(w));

    if (available.length === 0) {
      storageService.resetUsedWords('telestrations');
      available = all;
    }

    const word = available[Math.floor(Math.random() * available.length)];
    setInitialWord(word);
    setCurrentWord(word);
    storageService.markWordAsUsed('telestrations', word);

    setShuffledPlayers(shuffle(playerNames));
    setSteps([]);
    setCurrentRound(0);
    setWordRevealed(false);
    setTimeLeft(0);
    setPhase('start');
  };

  const startNewGame = () => {
    setSteps([]);
    setCurrentRound(0);
    setWordRevealed(false);
    setTimeLeft(0);
    setPhase('setup');
  };

  const startAction = () => {
    setPhase('action');
    setGuess('');
    const cfg = DIFFICULTY_CONFIG[difficulty];
    setTimeLeft(isDrawingRound ? cfg.drawTime : cfg.guessTime);
  };

  const finishAction = (content: string, type: 'draw' | 'guess') => {
    const settings = storageService.getSettings();
    if (type === 'guess') setCurrentWord(content);
    const newSteps: Step[] = [...steps, { type, content, author: currentPlayer }];
    setSteps(newSteps);
    if (currentRound === shuffledPlayers.length * selectedRounds - 1) {
      feedbackService.playSound('success');
      feedbackService.vibrate([50, 30, 50, 30, 50]);
      if (settings.visualEffects) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#ffffff']
        });
      }
      setPhase('gallery');
    } else {
      feedbackService.playSound('click');
      setCurrentRound(prev => prev + 1);
      setPhase('transition');
    }
  };

  // Auto-submit guess on timeout
  useEffect(() => {
    if (phase === 'action' && !isDrawingRound && timeLeft === 0) finishAction(guess, 'guess');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, isDrawingRound]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0502] text-[#e5e7eb] font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-[#0a0502]/90  border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Pencil className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase italic tracking-tighter leading-none">
              Tele<span className="text-orange-500">strations</span>
            </h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
              {phase === 'setup'
                ? `${playerNames.length} игроков`
                : `${currentRound + 1}/${shuffledPlayers.length * selectedRounds} · ${DIFFICULTY_CONFIG[difficulty].label}${phase === 'action' || phase === 'transition' ? ` · ${isDrawingRound ? 'рисует' : 'угадывает'}` : ''}`
              }
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

          {/* ── SETUP ── */}
          {phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-1">
                  <Pencil className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Настройки</h3>
                <p className="text-gray-500 text-sm">{playerNames.length} игроков</p>
              </div>

              {/* Rounds */}
              <div className="w-full max-w-sm">
                <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-3 text-center">Раунды цепочки</p>
                <div className="flex gap-3">
                  {[1, 2, 3].map(r => (
                    <motion.button
                      key={r}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRounds(r)}
                      className={`flex-1 py-4 rounded-2xl font-black text-lg border transition-all ${
                        selectedRounds === r
                          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                          : 'bg-white/5 border-white/10 text-gray-500'
                      }`}
                    >
                      {r}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="w-full max-w-sm space-y-3">
                <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-3 text-center">Сложность</p>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => {
                  const cfg = DIFFICULTY_CONFIG[diff];
                  const isSelected = difficulty === diff;
                  return (
                    <motion.button
                      key={diff}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setDifficulty(diff)}
                      className={`w-full p-4 rounded-[2rem] border text-left flex items-center gap-4 transition-all ${
                        isSelected
                          ? `${cfg.border} ${cfg.bg}`
                          : 'border-white/10 bg-white/5 opacity-50'
                      }`}
                    >
                      <span className="text-2xl leading-none">{cfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-black uppercase italic ${isSelected ? cfg.text : 'text-gray-400'}`}>{cfg.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 leading-tight">{cfg.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={`text-base font-black tabular-nums ${isSelected ? cfg.text : 'text-gray-600'}`}>{cfg.drawTime}с</p>
                        <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">рисунок</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleStartGame}
                className="w-full max-w-sm py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-2xl"
              >
                <span>Начать</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

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
                      <span className="opacity-60">{i % 2 === 0 ? '✏️' : '💬'}</span>
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
                <DrawingCanvas
                  word={currentWord}
                  timeLeft={timeLeft}
                  playerCount={shuffledPlayers.length}
                  currentRound={currentRound}
                  onFinish={(dataUrl) => finishAction(dataUrl, 'draw')}
                />
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
                      onKeyDown={e => e.key === 'Enter' && guess.trim() && finishAction(guess, 'guess')}
                      placeholder="Напиши ответ..."
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-xl font-bold placeholder:text-gray-700 focus:border-orange-500 focus:bg-orange-500/5 transition-all outline-none"
                    />
                    <button
                      disabled={!guess.trim()}
                      onClick={() => finishAction(guess, 'guess')}
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

      <InstructionsModal
        open={showInstructions}
        instructions={GAME_INSTRUCTIONS[GameKey.Telestrations]}
        onClose={() => setShowInstructions(false)}
        theme="orange"
      />
    </div>
  );
};
