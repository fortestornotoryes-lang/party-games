import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton } from '../../components/UI';
import { Grid, Eye, EyeOff, User, Users, AlertTriangle, Zap } from 'lucide-react';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { contentService } from '../../services/contentService';

interface CodenamesGameProps {
  playerNames: string[];
  onBack: () => void;
}

type Team = 'red' | 'blue';
type CardColor = Team | 'neutral' | 'assassin' | 'double_agent';

interface Card {
  id: number;
  word: string;
  color: CardColor;
  revealed: boolean;
}

type Phase = 'setup' | 'pass_captain' | 'captain' | 'pass_team' | 'team' | 'game_over';

export const CodenamesGame: React.FC<CodenamesGameProps> = ({ playerNames, onBack }) => {
  const { difficulty, mode: activeMode } = useGameSettings();
  const [phase, setPhase] = useState<Phase>('setup');
  const [cards, setCards] = useState<Card[]>([]);
  const [turn, setTurn] = useState<Team>('red');
  
  // Teams
  const [redCaptain, setRedCaptain] = useState<string>('');
  const [blueCaptain, setBlueCaptain] = useState<string>('');
  const [redTeam, setRedTeam] = useState<string[]>([]);
  const [blueTeam, setBlueTeam] = useState<string[]>([]);

  // Turn state
  const [clueWord, setClueWord] = useState('');
  const [clueCount, setClueCount] = useState<number>(0);
  const [guessesLeft, setGuessesLeft] = useState<number>(0);
  
  const [winner, setWinner] = useState<Team | null>(null);
  
  // Initialize teams and board
  useEffect(() => {
    if (playerNames.length < 4) return;
    
    // Shuffle players
    const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
    setRedCaptain(shuffled[0]);
    setBlueCaptain(shuffled[1]);
    
    const rest = shuffled.slice(2);
    const half = Math.ceil(rest.length / 2);
    setRedTeam(rest.slice(0, half));
    setBlueTeam(rest.slice(half));
    
    initBoard();
  }, [playerNames]);

  const initBoard = () => {
    const shuffledWords = contentService.getCodenamesWords(difficulty);
    
    let colorAssignment: CardColor[] = [];

    if (activeMode === 'deep_cover') {
      // 8 red, 8 blue, 7 neutral, 2 assassins
      colorAssignment = [
        ...Array(8).fill('red'),
        ...Array(8).fill('blue'),
        ...Array(7).fill('neutral'),
        ...Array(2).fill('assassin')
      ];
    } else if (activeMode === 'double_agent') {
      // 8 red, 8 blue, 7 neutral, 1 assassin, 1 double agent
      colorAssignment = [
        ...Array(8).fill('red'),
        ...Array(8).fill('blue'),
        ...Array(7).fill('neutral'),
        'assassin',
        'double_agent'
      ];
    } else {
      // Classic: 9 red, 8 blue, 7 neutral, 1 assassin
      colorAssignment = [
        ...Array(9).fill('red'),
        ...Array(8).fill('blue'),
        ...Array(7).fill('neutral'),
        'assassin'
      ];
    }

    colorAssignment = colorAssignment.sort(() => Math.random() - 0.5);
    
    const newCards = shuffledWords.map((word, i) => ({
      id: i,
      word,
      color: colorAssignment[i],
      revealed: false
    }));
    
    setCards(newCards);
    setTurn(activeMode === 'classic' ? 'red' : (Math.random() > 0.5 ? 'red' : 'blue'));
    setPhase('setup');
    setWinner(null);
  };

  const currentCaptain = turn === 'red' ? redCaptain : blueCaptain;
  
  const submitClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueWord || clueCount < 0) return;
    setGuessesLeft(clueCount + 1); // +1 extra guess allowed
    setPhase('pass_team');
  };

  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);
  
  const handleCardClick = (card: Card) => {
    if (phase !== 'team' || card.revealed) return;
    
    // Handle Double Agent conversion
    let cardColor = card.color;
    if (cardColor === 'double_agent') {
      cardColor = turn;
    }

    const updatedCards = cards.map(c => c.id === card.id ? { ...c, revealed: true, color: cardColor } : c);
    setCards(updatedCards);
    
    if (cardColor === 'assassin') {
      setWinner(turn === 'red' ? 'blue' : 'red');
      setPhase('game_over');
      return;
    }
    
    const redLeft = updatedCards.filter(c => c.color === 'red' && !c.revealed).length;
    const blueLeft = updatedCards.filter(c => c.color === 'blue' && !c.revealed).length;
    
    if (redLeft === 0) {
      setWinner('red');
      setPhase('game_over');
      return;
    }
    if (blueLeft === 0) {
      setWinner('blue');
      setPhase('game_over');
      return;
    }
    
    if (cardColor === turn) {
      const left = guessesLeft - 1;
      setGuessesLeft(left);
      if (left <= 0) {
        setLastActionMsg('ХОД ОКОНЧЕН');
        setTimeout(() => {
          setLastActionMsg(null);
          endTurn();
        }, 1500);
      }
    } else {
      setLastActionMsg(cardColor === 'neutral' ? 'МИРНЫЙ ЖИТЕЛЬ' : 'АГЕНТ ПРОТИВНИКА');
      setTimeout(() => {
        setLastActionMsg(null);
        endTurn();
      }, 1500);
    }
  };
  
  const endTurn = () => {
    setTurn(turn === 'red' ? 'blue' : 'red');
    setClueWord('');
    setClueCount(0);
    setPhase('pass_captain');
  };

  if (playerNames.length < 4) {
    return <div className="text-white flex items-center justify-center min-h-screen text-center p-8">Нужно минимум 4 игрока.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen text-white pb-20">
      <GameHeader 
        title="КОДОВЫЕ ИМЕНА" 
        subtitle="Битва шпионов" 
        icon={Grid} 
        themeColor="text-emerald-500 bg-emerald-500/90 border-emerald-500/30" 
        onBack={onBack} 
      />
      
      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full pt-10">
        <AnimatePresence mode="wait">
          
          {phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 flex-1 flex flex-col justify-center"
            >
              <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-widest text-emerald-400">Команды</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                  <h3 className="text-red-400 font-bold mb-2 uppercase text-xs flex items-center gap-2"><Users className="w-4 h-4"/> Красные</h3>
                  <p className="font-bold border-b border-red-500/20 pb-2 mb-2"><span className="text-xs text-red-500/50 uppercase block">Капитан</span>{redCaptain}</p>
                  <p className="text-sm text-red-300 opacity-80">{redTeam.join(', ')}</p>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                  <h3 className="text-blue-400 font-bold mb-2 uppercase text-xs flex items-center gap-2"><Users className="w-4 h-4"/> Синие</h3>
                  <p className="font-bold border-b border-blue-500/20 pb-2 mb-2"><span className="text-xs text-blue-500/50 uppercase block">Капитан</span>{blueCaptain}</p>
                  <p className="text-sm text-blue-300 opacity-80">{blueTeam.join(', ')}</p>
                </div>
              </div>
              
              <PrimaryButton onClick={() => setPhase('pass_captain')} variant="emerald" className="mt-8">ИГРАТЬ</PrimaryButton>
            </motion.div>
          )}

          {phase === 'pass_captain' && (
            <motion.div
              key="pass_captain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className={`p-8 rounded-[2rem] ${turn === 'red' ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} border shadow-2xl`}>
                 <User className={`w-24 h-24 ${turn === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-bold">Передайте телефон капитану</p>
                <h2 className={`text-5xl font-black uppercase tracking-tight ${turn === 'red' ? 'text-red-400' : 'text-blue-400'}`}>{currentCaptain}</h2>
                <div className="mt-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${turn === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    Команда {turn === 'red' ? 'Красных' : 'Синих'}
                  </span>
                </div>
              </div>
              <div className="w-full pt-8">
                 <PrimaryButton onClick={() => setPhase('captain')} variant={turn === 'red' ? 'red' : 'blue'} className="w-full h-16 text-lg tracking-widest">Я ГОТОВ</PrimaryButton>
                 <p className="text-[10px] text-gray-500 font-bold mt-4 animate-pulse uppercase">Остальные не должны видеть экран!</p>
              </div>
            </motion.div>
          )}

          {phase === 'captain' && (
            <motion.div
              key="captain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 flex flex-col"
            >
              <div className="text-center">
                <p className={`text-[20px] font-black uppercase tracking-widest ${turn === 'red' ? 'text-red-500' : 'text-blue-500'}`}>Ваш ход: капитану</p>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 mb-2 text-[12px] font-black uppercase tracking-widest">
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Красные</div>
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Синие</div>
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-stone-400"></span> Мирные (конец хода)</div>
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-black border border-red-900"></span> Убийца (смерть)</div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Придумайте подсказку (слово и число)</p>

              </div>
              
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {cards.map(card => (
                  <div 
                    key={card.id} 
                    className={`aspect-[4/3] rounded flex items-center justify-center p-1 text-center relative
                      ${card.revealed ? 'opacity-30' : ''}
                      ${card.color === 'red' ? 'bg-red-500/80' : 
                        card.color === 'blue' ? 'bg-blue-500/80' : 
                        card.color === 'neutral' ? 'bg-stone-300/90 text-stone-900 border border-stone-400/50' : 
                        card.color === 'double_agent' ? 'bg-emerald-500/80' :
                        'bg-black border border-red-900'}
                    `}
                  >
                    <span className="text-[9px] font-bold leading-tight break-words uppercase">{card.word}</span>
                    {card.color === 'double_agent' && <div className="absolute top-1 right-1"><Zap className="w-2 h-2 text-white fill-white" /></div>}
                  </div>
                ))}
              </div>

              <form onSubmit={submitClue} className="space-y-4 mt-auto">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clueWord}
                    onChange={(e) => setClueWord(e.target.value.replace(/ /g, ''))}
                    placeholder="Одно слово"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center font-bold outline-none focus:border-emerald-500/50 transition-colors uppercase"
                    required
                  />
                  <input
                    type="number"
                    inputMode={"decimal"}
                    min="0"
                    max="9"
                    pattern="[0-9]*"
                    value={clueCount === 0 ? '' : clueCount}
                    onChange={(e) => setClueCount(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-20 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-bold outline-none focus:border-emerald-500/50 transition-colors"
                    required
                  />
                </div>
                <PrimaryButton type="submit" variant={turn === 'red' ? 'red' : 'blue'} disabled={!clueWord || clueCount <= 0}>ПОДТВЕРДИТЬ</PrimaryButton>
              </form>
            </motion.div>
          )}

          {phase === 'pass_team' && (
            <motion.div
              key="pass_team"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className={`p-8 rounded-[2rem] ${turn === 'red' ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} border shadow-2xl`}>
                 <Users className={`w-24 h-24 ${turn === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-bold">Передайте телефон команде</p>
                <div className="mt-4">
                  <span className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest ${turn === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    Команда {turn === 'red' ? 'Красных' : 'Синих'}
                  </span>
                </div>
              </div>
              <div className="w-full pt-8">
                 <PrimaryButton onClick={() => setPhase('team')} variant={turn === 'red' ? 'red' : 'blue'} className="w-full h-16 text-lg tracking-widest">МЫ ГОТОВЫ</PrimaryButton>
              </div>
            </motion.div>
          )}

          {phase === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 flex flex-col h-full"
            >
              <div className="flex flex-col items-center justify-center text-center bg-white/5 py-3 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${turn === 'red' ? 'bg-red-400' : 'bg-blue-400'}`} />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">ПОДСКАЗКА</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-2xl font-black uppercase text-white tracking-widest">{clueWord}</h3>
                   <span className="text-xl font-bold text-gray-500">{clueCount}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Осталось попыток: <strong className="text-white">{guessesLeft}</strong></p>
              </div>

              <div className="grid grid-cols-5 gap-1.5 flex-1 items-center relative">
                <AnimatePresence>
                  {lastActionMsg && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      className="absolute inset-0 z-10 flex items-center justify-center p-4"
                    >
                      <div className="bg-black/90 backdrop-blur-md border border-white/20 px-6 py-4 rounded-3xl shadow-2xl">
                        <p className="text-xl font-black text-center text-white tracking-widest">{lastActionMsg}</p>
                        <p className="text-[10px] text-gray-500 text-center uppercase font-bold mt-2">Ход переходит...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {cards.map(card => (
                  <button 
                    key={card.id} 
                    onClick={() => handleCardClick(card)}
                    disabled={card.revealed}
                    className={`aspect-[4/3] rounded flex items-center justify-center p-1 text-center transition-all
                      ${!card.revealed ? 'bg-stone-200 hover:bg-stone-300 active:scale-95 cursor-pointer shadow-md border-b-2 border-stone-400 text-stone-800' : ''}
                      ${card.revealed && card.color === 'red' ? 'bg-red-500 text-white border border-red-700 pointer-events-none opacity-80' : ''}
                      ${card.revealed && card.color === 'blue' ? 'bg-blue-500 text-white border border-blue-700 pointer-events-none opacity-80' : ''}
                      ${card.revealed && card.color === 'neutral' ? 'bg-stone-400 text-stone-800 border border-stone-500 pointer-events-none opacity-80' : ''}
                      ${card.revealed && card.color === 'assassin' ? 'bg-stone-900 text-white border border-black pointer-events-none opacity-90' : ''}
                    `}
                  >
                    <span className={`text-[10px] sm:text-xs font-black leading-tight break-words uppercase ${!card.revealed ? 'text-stone-800' : ''}`}>
                      {card.word}
                    </span>
                  </button>
                ))}
              </div>

              <PrimaryButton onClick={endTurn} variant="outline" className="mt-4">ПАС (ПЕРЕДАТЬ ХОД)</PrimaryButton>
            </motion.div>
          )}

          {phase === 'game_over' && (
            <motion.div
              key="game_over"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="space-y-4">
                 <p className="text-sm uppercase tracking-widest text-emerald-500 font-bold">ИГРА ОКОНЧЕНА</p>
                 <h2 className={`text-5xl font-black uppercase ${winner === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                    ПОБЕДА {winner === 'red' ? 'КРАСНЫХ' : 'СИНИХ'}!
                 </h2>
              </div>
              <PrimaryButton onClick={initBoard} variant="white">СЫГРАТЬ ЕЩЕ</PrimaryButton>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
