import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, RotateCcw, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { feedbackService } from '../../services/feedbackService';
import { storageService } from '../../services/storageService';
import { WAVELENGTH_DATA_BY_DIFFICULTY } from '../../constants/wavelengthContent';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton, GameCard } from '../../components/UI';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';

interface WavelengthGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const WavelengthGame: React.FC<WavelengthGameProps> = ({ playerNames, onBack }) => {
  const { difficulty } = useGameSettings();
  const [phase, setPhase] = useState<'pass' | 'clue' | 'guessing' | 'reveal'>('pass');
  const [currentPair, setCurrentPair] = useState<string[]>(['', '']);
  const [targetValue, setTargetValue] = useState(50);
  const [guessValue, setGuessValue] = useState(50);
  const [psychicIdx, setPsychicIdx] = useState(0);

  useEffect(() => {
    startNewRound();
  }, [psychicIdx]);

  const startNewRound = () => {
    const custom = storageService.getCustomWords('wavelength');
    const used = storageService.getUsedWords('wavelength');
    const difficultyPairs = WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] ?? WAVELENGTH_DATA_BY_DIFFICULTY.medium;

    const all = [
      ...difficultyPairs,
      ...custom.map(w => w.split(' - ').length === 2 ? w.split(' - ') : [w, '...'])
    ];

    let available = all.filter(pair => !used.includes(pair.join(' - ')));

    if (available.length === 0) {
      storageService.resetUsedWords('wavelength');
      available = all;
    }

    const pair = available[Math.floor(Math.random() * available.length)];
    setCurrentPair(pair);
    storageService.markWordAsUsed('wavelength', pair.join(' - '));

    setTargetValue(Math.floor(Math.random() * 90) + 5);
    setGuessValue(50);
    setPhase('pass');
  };

  const psychic = playerNames[psychicIdx];

  const calculateScore = () => {
    const diff = Math.abs(guessValue - targetValue);
    if (diff <= 2) return 4;
    if (diff <= 7) return 3;
    if (diff <= 12) return 2;
    return 0;
  };

  const score = calculateScore();

  useEffect(() => {
    if (phase === 'reveal') {
      const settings = storageService.getSettings();
      
      if (score >= 3) {
        feedbackService.playSound('success');
        feedbackService.vibrate([50, 30, 50]);
        
        if (settings.visualEffects) {
          const colors = score === 4 ? ['#a855f7', '#ffffff', '#eab308'] : ['#a855f7', '#ffffff'];
          confetti({
            particleCount: score === 4 ? 200 : 100,
            spread: 80,
            origin: { y: 0.6 },
            colors
          });
        }
      } else if (score === 0) {
        feedbackService.playSound('error');
        feedbackService.vibrate(100);
      } else {
        feedbackService.playSound('click');
      }
    }
  }, [phase, score]);

  return (
    <div className="flex flex-col h-screen bg-[#07050a]">
      <GameHeader 
        title={GAMES_REGISTRY.wavelength.title}
        subtitle="На одной волне" 
        icon={Radio} 
        themeColor="border-purple-500/50 text-purple-400"
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden relative flex flex-col p-6">
        <AnimatePresence mode="wait">
          {phase === 'pass' && (
            <motion.div key="pass" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center space-y-10 text-center">
               <div className="space-y-4">
                  <p className="text-[10px] text-white/80 font-black uppercase tracking-[0.3em]">Новый раунд</p>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white/60">Телепат:</h3>
                  <h2 className="text-6xl font-black italic uppercase text-purple-500 tracking-tighter leading-none">{psychic}</h2>
               </div>
               <div className="p-8 bg-purple-500/5 border-2 border-purple-500/10 rounded-[40px] text-sm text-gray-500 max-w-xs transition-all">
                  {psychic}, возьми телефон! Только ты должен видеть секретную цель. Убедись, что остальные не смотрят.
               </div>
               <PrimaryButton onClick={() => setPhase('clue')} className="bg-purple-500">Я ГОТОВ</PrimaryButton>
            </motion.div>
          )}

          {phase === 'clue' && (
            <motion.div key="clue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col space-y-12">
              <div className="text-center space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Текущий Телепат</div>
                <h3 className="text-4xl font-black italic text-purple-400 tracking-tighter uppercase">{psychic}</h3>
                <p className="text-sm text-gray-500 font-bold max-w-xs mx-auto">Только ты видишь целевую зону на шкале!</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <GameCard className="relative w-full h-48 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full px-12 pointer-events-none">
                        <div className="h-4 w-full bg-black/40 rounded-full relative overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '10%' }}
                                style={{ left: `${targetValue - 5}%` }}
                                className="absolute h-full bg-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center overflow-visible"
                            >
                                <div className="h-8 w-1 bg-white" />
                            </motion.div>
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-white/80">
                            <span>{currentPair[0]}</span>
                            <span>{currentPair[1]}</span>
                        </div>
                    </div>
                </GameCard>

                <div className="space-y-4 text-center">
                   <p className="text-gray-400">Придумай подсказку, чтобы игроки попали в эту зону</p>
                   <div className="text-2xl font-black italic uppercase tracking-tight flex items-center justify-center space-x-2">
                       <span className="text-gray-500">{currentPair[0]}</span>
                       <ChevronRight className="w-4 h-4 text-purple-500" />
                       <span className="text-white">{currentPair[1]}</span>
                   </div>
                </div>
              </div>

              <PrimaryButton onClick={() => setPhase('guessing')}>
                Я ДАЛ ПОДСКАЗКУ
              </PrimaryButton>
            </motion.div>
          )}

          {phase === 'guessing' && (
            <motion.div key="guessing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Настройте волну!</h3>
                <p className="text-gray-400 font-medium">Передвиньте рычаг в нужную позицию</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-16">
                 <div className="w-full space-y-8">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest px-4">
                        <span className="text-purple-400">{currentPair[0]}</span>
                        <span className="text-purple-400">{currentPair[1]}</span>
                    </div>

                    <div className="relative h-24 flex items-center">
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={guessValue}
                            onChange={(e) => setGuessValue(parseInt(e.target.value))}
                            className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-500"
                        />
                        <div 
                            style={{ left: `${guessValue}%` }}
                            className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-12 bg-white rounded-lg shadow-2xl transition-transform active:scale-110 pointer-events-none flex items-center justify-center"
                        >
                            <div className="h-8 w-0.5 bg-black/20" />
                        </div>
                    </div>
                 </div>

                 <GameCard className="bg-purple-500/5 border border-purple-500/20 w-full text-center py-8">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 mb-2">Значение</div>
                    <div className="text-6xl font-black italic tracking-tighter">{guessValue}</div>
                 </GameCard>
              </div>

              <PrimaryButton onClick={() => setPhase('reveal')}>
                ПОДТВЕРДИТЬ ВЫБОР
              </PrimaryButton>
            </motion.div>
          )}

          {phase === 'reveal' && (
            <motion.div key="reveal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col space-y-12">
               <div className="text-center">
                  <h2 className="text-6xl font-black italic uppercase italic tracking-tighter mb-2">РЕЗУЛЬТАТ</h2>
                  <div className="flex items-center justify-center space-x-2 text-xl font-bold uppercase tracking-widest text-gray-500">
                    <span>{currentPair[0]}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>{currentPair[1]}</span>
                  </div>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center space-y-16">
                  <div className="relative w-full px-12">
                    <div className="h-8 w-full bg-white/5 rounded-full relative overflow-hidden border border-white/10">
                        <div 
                            style={{ left: `${targetValue - 5}%` }}
                            className="absolute h-full w-[10%] bg-purple-500/40 rounded-sm"
                        />
                        <div 
                            style={{ left: `${targetValue}%` }}
                            className="absolute h-full w-1 bg-white/80"
                        />
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: '200%' }}
                            style={{ left: `${guessValue}%` }}
                            className="absolute top-[-50%] w-1 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10"
                        />
                    </div>
                  </div>

                  <div className="text-center space-y-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Твои очки</p>
                        <div className={`text-9xl font-black italic transition-colors ${score > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {score}
                        </div>
                    </div>
                    {score === 4 && <div className="text-yellow-500 font-black italic uppercase tracking-widest animate-bounce">ИДЕАЛЬНО!</div>}
                  </div>
               </div>

               <PrimaryButton onClick={() => setPsychicIdx((psychicIdx + 1) % playerNames.length)} icon={RotateCcw}>
                СЛЕДУЮЩИЙ РАУНД
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
