import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {GameHeader} from '../../components/GameHeader';
import {PrimaryButton} from '../../components/UI';
import {Users, KeyRound, AlertOctagon, CheckCircle2, Key} from 'lucide-react';
import {useGameSettings} from '../../contexts/GameSettingsContext';
import {contentService} from '../../services/contentService';
import {GAMES_REGISTRY} from '../../registry/GameRegistry';

interface DecryptoGameProps {
    playerNames: string[];
    onBack: () => void;
}

type TeamColor = 'red' | 'blue';

interface RoundData {
    code: number[];
    clues: string[];
    interceptionGuess: (number | '')[] | null;
    teamGuess: (number | '')[];
}

interface TeamState {
    words: string[];
    players: string[];
    interceptions: number;
    fails: number;
    history: RoundData[];
    captainIndex: number;
}

type Phase =
    'setup'
    | 'pass_captain'
    | 'captain_clues'
    | 'pass_enemy'
    | 'enemy_intercept'
    | 'pass_team'
    | 'team_guess'
    | 'reveal'
    | 'game_over';

export const DecryptoGame: React.FC<DecryptoGameProps> = ({playerNames, onBack}) => {
    const {difficulty, mode} = useGameSettings();
    const wordCount = mode === 'extended_5' ? 5 : (mode === 'extended_6' ? 6 : 4);

    const [phase, setPhase] = useState<Phase>('setup');
    const [round, setRound] = useState(1);
    const [activeTeam, setActiveTeam] = useState<TeamColor>('red');

    const [redState, setRedState] = useState<TeamState | null>(null);
    const [blueState, setBlueState] = useState<TeamState | null>(null);

    // Transient round state
    const [currentCode, setCurrentCode] = useState<number[]>([]);
    const [clues, setClues] = useState<string[]>(['', '', '']);
    const [interceptGuess, setInterceptGuess] = useState<(number | '')[]>(['', '', '']);
    const [teamGuess, setTeamGuess] = useState<(number | '')[]>(['', '', '']);
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        initGame();
    }, [playerNames]);

    const generateCode = () => {
        const nums = Array.from({length: wordCount}, (_, i) => i + 1);
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        return nums.slice(0, 3);
    };

    const initGame = () => {
        const shuffledPlayers = [...playerNames].sort(() => Math.random() - 0.5);
        const half = Math.ceil(shuffledPlayers.length / 2);
        const redPlayers = shuffledPlayers.slice(0, half);
        const bluePlayers = shuffledPlayers.slice(half);

        const redWords = contentService.getDecryptoWords(difficulty, wordCount);
        const blueWords = contentService.getDecryptoWords(difficulty, wordCount);

        setRedState({
            words: redWords,
            players: redPlayers,
            interceptions: 0,
            fails: 0,
            history: [],
            captainIndex: 0
        });
        setBlueState({
            words: blueWords,
            players: bluePlayers,
            interceptions: 0,
            fails: 0,
            history: [],
            captainIndex: 0
        });
        setRound(1);
        setActiveTeam('red');
        setPhase('setup');
        setWinner(null);
    };

    const startRound = () => {
        setCurrentCode(generateCode());
        setClues(['', '', '']);
        setInterceptGuess(['', '', '']);
        setTeamGuess(['', '', '']);
        setPhase('pass_captain');
    };

    const getCaptainName = (team: TeamColor) => {
        const state = team === 'red' ? redState : blueState;
        if (!state) return '';
        return state.players[state.captainIndex % state.players.length];
    };

    const handleCluesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (clues.some(c => c.trim() === '')) return;
        if (round > 1) {
            setPhase('pass_enemy');
        } else {
            setInterceptGuess([]); // No intercept on round 1
            setPhase('pass_team');
        }
    };

    const handleInterceptSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPhase('pass_team');
    };

    const handleTeamGuessSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPhase('reveal');
    };

    const continueAfterReveal = () => {
        const EnemyState = activeTeam === 'red' ? blueState! : redState!;
        const CurrentState = activeTeam === 'red' ? redState! : blueState!;

        let isIntercepted = false;
        let isFailed = false;

        if (round > 1 && interceptGuess.join('') === currentCode.join('')) {
            EnemyState.interceptions += 1;
            isIntercepted = true;
        }
        if (teamGuess.join('') !== currentCode.join('')) {
            CurrentState.fails += 1;
            isFailed = true;
        }

        CurrentState.history.push({
            code: currentCode,
            clues,
            interceptionGuess: round > 1 ? interceptGuess : null,
            teamGuess
        });

        if (activeTeam === 'red') {
            setRedState({...CurrentState});
            setBlueState({...EnemyState});
        } else {
            setBlueState({...CurrentState});
            setRedState({...EnemyState});
        }

        // Check win condition
        if (EnemyState.interceptions >= 2) {
            setWinner(activeTeam === 'red' ? 'blue' : 'red');
            setPhase('game_over');
            return;
        }
        if (CurrentState.fails >= 2) {
            setWinner(activeTeam === 'red' ? 'blue' : 'red');
            setPhase('game_over');
            return;
        }

        // Switch turn
        if (activeTeam === 'red') {
            setActiveTeam('blue');
            setCurrentCode(generateCode());
            setClues(['', '', '']);
            setPhase('pass_captain');
        } else {
            // End of round
            setActiveTeam('red');
            setRound(round + 1);

            // Update captains
            const nextRed = {...redState!};
            nextRed.captainIndex = (nextRed.captainIndex + 1);
            const nextBlue = {...blueState!};
            nextBlue.captainIndex = (nextBlue.captainIndex + 1);
            setRedState(nextRed);
            setBlueState(nextBlue);

            setCurrentCode(generateCode());
            setClues(['', '', '']);
            setPhase('pass_captain');
        }
    };

    if (!redState || !blueState) return null;

    const currentTeamState = activeTeam === 'red' ? redState : blueState;
    const enemyTeamState = activeTeam === 'red' ? blueState : redState;
    const enemyTeamColor = activeTeam === 'red' ? 'blue' : 'red';

    return (
        <div className="flex flex-col min-h-screen text-white pb-20">
            <GameHeader
                title={GAMES_REGISTRY.decrypto.title}
                subtitle="Коды и перехваты"
                icon={Key}
                themeColor="text-purple-500 bg-purple-500/10 border-purple-500/30"
                onBack={onBack}
            />

            <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full pt-10">
                <AnimatePresence mode="wait">

                    {phase === 'setup' && (
                        <motion.div
                            key="setup"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            className="space-y-6 flex-1 flex flex-col justify-center"
                        >
                            <h2 className="text-2xl font-black text-center mb-2 uppercase tracking-widest text-purple-400">Команды</h2>
                            <p className="text-sm text-center text-gray-500 mb-6">Распределитесь для игры</p>

                            <div className="grid gap-3">
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                    <h3 className="text-red-400 font-bold uppercase text-xs mb-2 flex items-center gap-2">
                                        <Users className="w-4 h-4"/> Красная Команда</h3>
                                    <p className="text-sm text-red-100/70">{redState.players.join(', ')}</p>
                                </div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                                    <h3 className="text-blue-400 font-bold uppercase text-xs mb-2 flex items-center gap-2">
                                        <Users className="w-4 h-4"/> Синяя Команда</h3>
                                    <p className="text-sm text-blue-100/70">{blueState.players.join(', ')}</p>
                                </div>
                            </div>

                            <PrimaryButton onClick={startRound} variant="purple" className="mt-8">НАЧАТЬ РАУНД
                                1</PrimaryButton>
                        </motion.div>
                    )}

                    {phase === 'pass_captain' && (
                        <motion.div
                            key="pass_captain"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 1.1}}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div
                                className={`p-8 rounded-[2rem] ${activeTeam === 'red' ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} border shadow-2xl`}>
                                <KeyRound
                                    className={`w-24 h-24 ${activeTeam === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}/>
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-bold">Раунд {round} •
                                    Шифровальщик</p>
                                <h2 className={`text-5xl font-black uppercase tracking-tight ${activeTeam === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                                    {getCaptainName(activeTeam)}
                                </h2>
                                <div className="mt-4">
                  <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${activeTeam === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    Команда {activeTeam === 'red' ? 'Красных' : 'Синих'}
                  </span>
                                </div>
                            </div>
                            <div className="w-full pt-8">
                                <PrimaryButton onClick={() => setPhase('captain_clues')}
                                               variant={activeTeam === 'red' ? 'red' : 'blue'}
                                               className="w-full h-16 text-lg tracking-widest">ПОКАЗАТЬ
                                    КОД</PrimaryButton>
                                <p className="text-[10px] text-gray-500 font-bold mt-4 animate-pulse uppercase">Остальные
                                    не должны видеть экран!</p>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'captain_clues' && (
                        <motion.div
                            key="captain_clues"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="space-y-6 flex flex-col overflow-auto pb-8 relative h-full"
                        >
                            <div className="text-center sticky top-0 bg-black/50 backdrop-blur-md py-2 z-10 font-black">
                                <p className={`text-[10px] tracking-widest uppercase ${activeTeam === 'red' ? 'text-red-500' : 'text-blue-500'}`}>Шифровальщик {activeTeam === 'red' ? 'Красных' : 'Синих'}</p>
                                <h3 className="text-3xl text-white tracking-[0.2em]">{currentCode.join(' - ')}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {currentTeamState.words.map((w, i) => (
                                    <div key={i}
                                         className="bg-white/5 border border-white/10 p-2 rounded relative overflow-hidden flex flex-col items-center justify-center h-20">
                                        <span
                                            className="absolute left-2 top-2 text-[10px] text-gray-500 font-black">{i + 1}</span>
                                        <span className="text-sm font-bold uppercase">{w}</span>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleCluesSubmit} className="space-y-4 flex-1">
                                <p className="text-xs font-bold text-gray-400 text-center uppercase mt-4">Напишите
                                    ассоциации к словам кода</p>
                                {currentCode.map((num, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div
                                            className={`w-8 h-8 flex items-center justify-center font-black rounded-lg ${activeTeam === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {num}
                                        </div>
                                        <input
                                            required
                                            type="number"
                                            inputMode={"decimal"}
                                            value={clues[i]}
                                            onChange={(e) => {
                                                const newClues = [...clues];
                                                newClues[i] = e.target.value;
                                                setClues(newClues);
                                            }}
                                            placeholder={`Ассоциация на слово "${currentTeamState.words[num - 1]}"`}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors placeholder:text-gray-600"
                                        />
                                    </div>
                                ))}

                                <PrimaryButton type="submit" variant={activeTeam} className="w-full mt-6"
                                               disabled={clues.some(c => c.trim() === '')}>
                                    ЗАШИФРОВАТЬ
                                </PrimaryButton>
                            </form>
                        </motion.div>
                    )}

                    {phase === 'pass_enemy' && (
                        <motion.div
                            key="pass_enemy"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 1.1}}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div
                                className={`p-8 rounded-[2rem] ${enemyTeamColor === 'red' ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} border shadow-2xl`}>
                                <AlertOctagon
                                    className={`w-24 h-24 ${enemyTeamColor === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}/>
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-bold">Передайте
                                    телефон для перехвата</p>
                                <div className="mt-4">
                  <span
                      className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest ${enemyTeamColor === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    Командe {enemyTeamColor === 'red' ? 'Красных' : 'Синих'}
                  </span>
                                </div>
                            </div>
                            <div className="w-full pt-8">
                                <PrimaryButton onClick={() => setPhase('enemy_intercept')} variant={enemyTeamColor}
                                               className="w-full h-16 text-lg tracking-widest">ПЕРЕХВАТИТЬ</PrimaryButton>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'enemy_intercept' && (
                        <motion.div
                            key="enemy_intercept"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="space-y-4 flex flex-col h-full overflow-auto"
                        >
                            <div className="text-center font-black">
                                <p className={`text-[10px] tracking-widest uppercase ${enemyTeamColor === 'red' ? 'text-red-500' : 'text-blue-500'}`}>ВРЕМЯ
                                    ПЕРЕХВАТА</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Текущие подсказки
                                    врага</p>
                                <ul className="space-y-1">
                                    {clues.map((c, i) => <li key={i}
                                                             className="text-white font-bold">{i + 1}. {c}</li>)}
                                </ul>
                            </div>

                            {currentTeamState.history.length > 0 && (
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">История раундов
                                        врага</p>
                                    <div className="space-y-2">
                                        {currentTeamState.history.map((h, i) => (
                                            <div key={i} className="text-xs">
                                                <span
                                                    className="text-purple-400 font-bold">Код {h.code.join('-')}</span>: {h.clues.join(', ')}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleInterceptSubmit} className="mt-4 space-y-4 flex-1">
                                <p className="text-[10px] font-bold text-center text-gray-400 uppercase">Введите
                                    перехваченный код</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[0, 1, 2].map(i => (
                                        <input
                                            key={i} type="number" min="1" max={wordCount} required
                                            value={interceptGuess[i] || ''}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value);
                                                if (v >= 1 && v <= wordCount) {
                                                    const g = [...interceptGuess];
                                                    g[i] = v;
                                                    setInterceptGuess(g);
                                                } else if (e.target.value === '') {
                                                    const g = [...interceptGuess];
                                                    g[i] = 0;
                                                    setInterceptGuess(g);
                                                }
                                            }}
                                            className={`h-16 text-2xl font-black text-center rounded-xl bg-white/5 border border-white/10 flex-1 outline-none focus:border-${enemyTeamColor}-500/50`}
                                        />
                                    ))}
                                </div>
                                <PrimaryButton type="submit" variant={enemyTeamColor} className="w-full">ПОДТВЕРДИТЬ
                                    ПЕРЕХВАТ</PrimaryButton>
                            </form>
                        </motion.div>
                    )}

                    {phase === 'pass_team' && (
                        <motion.div
                            key="pass_team"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div
                                className={`p-8 rounded-[2rem] ${activeTeam === 'red' ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} border shadow-2xl`}>
                                <Users
                                    className={`w-24 h-24 ${activeTeam === 'red' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}/>
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-bold">Передайте
                                    вашей команде</p>
                                <div className="mt-4">
                  <span
                      className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest ${activeTeam === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    Командe {activeTeam === 'red' ? 'Красных' : 'Синих'}
                  </span>
                                </div>
                            </div>
                            <div className="w-full pt-8">
                                <PrimaryButton onClick={() => setPhase('team_guess')} variant={activeTeam}
                                               className="w-full h-16 text-lg tracking-widest">РАЗГАДАТЬ
                                    КОД</PrimaryButton>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'team_guess' && (
                        <motion.div
                            key="team_guess"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            className="space-y-4 flex flex-col h-full overflow-auto"
                        >
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {currentTeamState.words.map((w, i) => (
                                    <div key={i}
                                         className="bg-white/5 border border-white/10 p-2 rounded relative overflow-hidden flex flex-col items-center justify-center h-16">
                                        <span
                                            className="absolute left-2 top-2 text-[10px] text-gray-500 font-black">{i + 1}</span>
                                        <span className="text-sm font-bold uppercase">{w}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Новые подсказки</p>
                                <ul className="space-y-1 text-lg font-black uppercase tracking-wider text-center">
                                    {clues.map((c, i) => <li key={i} className="text-white">{c}</li>)}
                                </ul>
                            </div>

                            <form onSubmit={handleTeamGuessSubmit} className="mt-4 space-y-4 flex-1">
                                <p className="text-[10px] font-bold text-center text-gray-400 uppercase">Введите ваш
                                    код</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[0, 1, 2].map(i => (
                                        <input
                                            key={i} type="number" min="1" max={wordCount} required
                                            value={teamGuess[i] || ''}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value);
                                                if (v >= 1 && v <= wordCount) {
                                                    const g = [...teamGuess];
                                                    g[i] = v;
                                                    setTeamGuess(g);
                                                } else if (e.target.value === '') {
                                                    const g = [...teamGuess];
                                                    g[i] = 0;
                                                    setTeamGuess(g);
                                                }
                                            }}
                                            className={`h-16 text-2xl font-black text-center rounded-xl bg-white/5 border border-white/10 flex-1 outline-none focus:border-${activeTeam}-500/50`}
                                        />
                                    ))}
                                </div>
                                <PrimaryButton type="submit" variant={activeTeam}
                                               className="w-full">РАЗГАДАТЬ</PrimaryButton>
                            </form>
                        </motion.div>
                    )}

                    {phase === 'reveal' && (
                        <motion.div
                            key="reveal"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            className="flex-1 flex flex-col items-center justify-center text-center w-full"
                        >
                            <h2 className="text-3xl font-black uppercase text-white tracking-[0.2em] border-b border-white/20 pb-4 w-full mb-8">
                                ИТОГИ РАУНДА
                            </h2>

                            <div className="space-y-3 mt-8 w-full">
                                {round > 1 && (
                                    <div
                                        className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col w-full relative overflow-hidden">
                                        {interceptGuess.join('') === currentCode.join('') &&
                                            <div className="absolute inset-0 bg-red-500/10"></div>}
                                        <div className="flex justify-between items-center w-full z-10">
                                            <span className="text-xs text-gray-400 uppercase font-bold text-left">Перехват врага<br/><span
                                                className="text-white text-2xl tracking-[0.2em]">{interceptGuess.join('')}</span></span>
                                            {interceptGuess.join('') === currentCode.join('') ? (
                                                <span
                                                    className="text-red-400 font-black px-4 py-2 bg-red-400/20 rounded-xl border border-red-500/30">ПЕРЕХВАТ</span>
                                            ) : (
                                                <span
                                                    className="text-gray-500 font-bold px-4 py-2 bg-white/5 rounded-xl">МИМО</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col w-full relative overflow-hidden">
                                    {teamGuess.join('') === currentCode.join('') &&
                                        <div className="absolute inset-0 bg-emerald-500/10"></div>}
                                    <div className="flex justify-between items-center w-full z-10">
                                        <span className="text-xs text-gray-400 uppercase font-bold text-left">Твоя команда<br/><span
                                            className="text-white text-2xl tracking-[0.2em]">{teamGuess.join('')}</span></span>
                                        {teamGuess.join('') === currentCode.join('') ? (
                                            <span
                                                className="text-emerald-400 font-black px-4 py-2 bg-emerald-400/20 rounded-xl border border-emerald-500/30">УСПЕХ</span>
                                        ) : (
                                            <span
                                                className="text-red-400 font-black px-4 py-2 bg-red-400/20 rounded-xl border border-red-500/30">ОШИБКА</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full pt-8">
                                <PrimaryButton onClick={continueAfterReveal} variant="white"
                                               className="w-full h-16 text-lg tracking-widest">ДАЛЬШЕ</PrimaryButton>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'game_over' && (
                        <motion.div
                            key="game_over"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div className="space-y-4">
                                <p className="text-sm uppercase tracking-widest text-emerald-500 font-bold">ИГРА
                                    ОКОНЧЕНА</p>
                                <h2 className={`text-5xl font-black uppercase ${winner === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                                    ПОБЕДА {winner === 'red' ? 'КРАСНЫХ' : 'СИНИХ'}!
                                </h2>
                            </div>
                            <PrimaryButton onClick={initGame} variant="white">НОВАЯ ИГРА</PrimaryButton>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
