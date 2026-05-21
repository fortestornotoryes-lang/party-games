import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, KeyRound, AlertOctagon, Key, Trophy } from 'lucide-react';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton } from '../../components/UI';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { contentService } from '../../services/contentService';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { shuffle } from '../../utils/random';
import { DecryptoPhase, TeamColor, TeamState } from './types';
import { tLabel, tText, tBg, tBadge } from './helpers';
import { PassScreen } from './components/PassScreen';
import { ScoreRow } from './components/ScoreRow';
import { CaptainCluesPhase } from './components/CaptainCluesPhase';
import { EnemyInterceptPhase } from './components/EnemyInterceptPhase';
import { TeamGuessPhase } from './components/TeamGuessPhase';

interface DecryptoGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const DecryptoGame: React.FC<DecryptoGameProps> = ({ playerNames, onBack }) => {
    const { difficulty, mode } = useGameSettings();
    const wordCount = mode === 'extended_5' ? 5 : mode === 'extended_6' ? 6 : 4;

    const [phase, setPhase] = useState<DecryptoPhase>(DecryptoPhase.Setup);
    const [round, setRound] = useState(1);
    const [activeTeam, setActiveTeam] = useState<TeamColor>('red');

    const [redState, setRedState] = useState<TeamState | null>(null);
    const [blueState, setBlueState] = useState<TeamState | null>(null);

    const [currentCode, setCurrentCode] = useState<number[]>([]);
    const [clues, setClues] = useState<string[]>(['', '', '']);
    const [interceptGuess, setInterceptGuess] = useState<(number | '')[]>(['', '', '']);
    const [teamGuess, setTeamGuess] = useState<(number | '')[]>(['', '', '']);
    const [winner, setWinner] = useState<TeamColor | null>(null);

    useEffect(() => { initGame(); }, [playerNames]);

    const generateCode = (): number[] => {
        const nums = Array.from({ length: wordCount }, (_, i) => i + 1);
        return shuffle(nums).slice(0, 3);
    };

    const initGame = () => {
        const shuffled = shuffle([...playerNames]);
        const half = Math.ceil(shuffled.length / 2);
        setRedState({ words: contentService.getDecryptoWords(difficulty, wordCount), players: shuffled.slice(0, half),  interceptions: 0, fails: 0, history: [], captainIndex: Math.floor(Math.random() * half) });
        setBlueState({ words: contentService.getDecryptoWords(difficulty, wordCount), players: shuffled.slice(half), interceptions: 0, fails: 0, history: [], captainIndex: Math.floor(Math.random() * (shuffled.length - half)) });
        setRound(1);
        setActiveTeam('red');
        setPhase(DecryptoPhase.Setup);
        setWinner(null);
    };

    const startRound = () => {
        setCurrentCode(generateCode());
        setClues(['', '', '']);
        setInterceptGuess(['', '', '']);
        setTeamGuess(['', '', '']);
        setPhase(DecryptoPhase.PassCaptain);
    };

    const getCaptainName = (team: TeamColor) => {
        const s = team === 'red' ? redState : blueState;
        return s ? s.players[s.captainIndex % s.players.length] : '';
    };

    const continueAfterReveal = () => {
        const cur: TeamState = {
            ...(activeTeam === 'red' ? redState! : blueState!),
            history: [...(activeTeam === 'red' ? redState! : blueState!).history],
        };
        const env: TeamState = { ...(activeTeam === 'red' ? blueState! : redState!) };

        const intercepted = round > 1 && (interceptGuess as number[]).join('') === currentCode.join('');
        const failed      = (teamGuess as number[]).join('') !== currentCode.join('');

        if (intercepted) env.interceptions += 1;
        if (failed)      cur.fails         += 1;

        cur.history.push({
            code: currentCode,
            clues,
            interceptionGuess: round > 1 ? (interceptGuess as number[]) : null,
            teamGuess: teamGuess as number[],
        });

        const newRed  = activeTeam === 'red' ? cur : env;
        const newBlue = activeTeam === 'red' ? env : cur;

        if (env.interceptions >= 2 || cur.fails >= 2) {
            setRedState(newRed);
            setBlueState(newBlue);
            setWinner(activeTeam === 'red' ? 'blue' : 'red');
            setPhase(DecryptoPhase.GameOver);
            return;
        }

        if (activeTeam === 'red') {
            setRedState(newRed);
            setBlueState(newBlue);
            setActiveTeam('blue');
        } else {
            setRedState(newRed);
            setBlueState(newBlue);
            setActiveTeam('red');
            setRound(r => r + 1);
        }

        setCurrentCode(generateCode());
        setClues(['', '', '']);
        setInterceptGuess(['', '', '']);
        setTeamGuess(['', '', '']);
        setPhase(DecryptoPhase.PassCaptain);
    };

    if (!redState || !blueState) return null;

    const curState    = activeTeam === 'red' ? redState : blueState;
    const enemyColor  = (activeTeam === 'red' ? 'blue' : 'red') as TeamColor;
    const intercepted = round > 1 && (interceptGuess as number[]).join('') === currentCode.join('');
    const guessCorrect = (teamGuess as number[]).join('') === currentCode.join('');

    return (
        <div className="flex flex-col min-h-screen text-white pb-20">
            <GameHeader
                title={GAMES_REGISTRY.decrypto.title}
                subtitle="Коды и перехваты"
                icon={Key}
                theme="purple"
                onBack={onBack}
            />

            <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full pt-10">
                <AnimatePresence mode="wait">

                    {/* ── SETUP ── */}
                    {phase === DecryptoPhase.Setup && (
                        <motion.div key="setup"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="space-y-6 flex-1 flex flex-col justify-center"
                        >
                            <h2 className="text-2xl font-black text-center uppercase tracking-widest text-premium-purple">Команды</h2>
                            <p className="text-sm text-center text-white/30">Распределитесь для игры</p>
                            <div className="grid gap-3">
                                {([['red', redState], ['blue', blueState]] as [TeamColor, TeamState][]).map(([color, state]) => (
                                    <div key={color} className={`p-4 ${tBg(color)} border rounded-2xl`}>
                                        <h3 className={`${tText(color)} font-bold uppercase text-xs mb-2 flex items-center gap-2`}>
                                            <Users className="w-4 h-4" /> Команда {tLabel(color)}
                                        </h3>
                                        <p className={`text-sm ${tText(color)} opacity-70`}>{state.players.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                            <PrimaryButton onClick={startRound} variant="purple" className="mt-8">НАЧАТЬ РАУНД 1</PrimaryButton>
                        </motion.div>
                    )}

                    {/* ── PASS CAPTAIN ── */}
                    {phase === DecryptoPhase.PassCaptain && (
                        <PassScreen key="pass_captain"
                            icon={KeyRound} team={activeTeam}
                            subtitle="Остальные не должны видеть экран!"
                            buttonLabel="ПОКАЗАТЬ КОД"
                            onContinue={() => setPhase(DecryptoPhase.CaptainClues)}
                            red={redState} blue={blueState}
                        >
                            <div className="space-y-1">
                                <p className="text-sm uppercase tracking-widest text-white/30 font-bold">
                                    Раунд {round} · Шифровальщик
                                </p>
                                <h2 className={`text-5xl font-black uppercase tracking-tight ${tText(activeTeam)}`}>
                                    {getCaptainName(activeTeam)}
                                </h2>
                                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${tBadge(activeTeam)}`}>
                                    Команда {tLabel(activeTeam)}
                                </span>
                            </div>
                        </PassScreen>
                    )}

                    {/* ── CAPTAIN CLUES ── */}
                    {phase === DecryptoPhase.CaptainClues && (
                        <CaptainCluesPhase
                            words={curState.words}
                            currentCode={currentCode}
                            clues={clues}
                            activeTeam={activeTeam}
                            onChange={setClues}
                            onSubmit={() => setPhase(round > 1 ? DecryptoPhase.PassEnemy : DecryptoPhase.PassTeam)}
                        />
                    )}

                    {/* ── PASS ENEMY ── */}
                    {phase === DecryptoPhase.PassEnemy && (
                        <PassScreen key="pass_enemy"
                            icon={AlertOctagon} team={enemyColor}
                            subtitle="Передайте телефон команде соперника"
                            buttonLabel="ПЕРЕХВАТИТЬ"
                            onContinue={() => setPhase(DecryptoPhase.EnemyIntercept)}
                            red={redState} blue={blueState}
                        />
                    )}

                    {/* ── ENEMY INTERCEPT ── */}
                    {phase === DecryptoPhase.EnemyIntercept && (
                        <EnemyInterceptPhase
                            enemyHistory={curState.history}
                            clues={clues}
                            interceptGuess={interceptGuess}
                            wordCount={wordCount}
                            enemyColor={enemyColor}
                            onChange={setInterceptGuess}
                            onSubmit={() => setPhase(DecryptoPhase.PassTeam)}
                        />
                    )}

                    {/* ── PASS TEAM ── */}
                    {phase === DecryptoPhase.PassTeam && (
                        <PassScreen key="pass_team"
                            icon={Users} team={activeTeam}
                            subtitle="Передайте телефон своей команде"
                            buttonLabel="РАЗГАДАТЬ КОД"
                            onContinue={() => setPhase(DecryptoPhase.TeamGuess)}
                            red={redState} blue={blueState}
                        />
                    )}

                    {/* ── TEAM GUESS ── */}
                    {phase === DecryptoPhase.TeamGuess && (
                        <TeamGuessPhase
                            words={curState.words}
                            clues={clues}
                            teamGuess={teamGuess}
                            wordCount={wordCount}
                            activeTeam={activeTeam}
                            onChange={setTeamGuess}
                            onSubmit={() => setPhase(DecryptoPhase.Reveal)}
                        />
                    )}

                    {/* ── REVEAL ── */}
                    {phase === DecryptoPhase.Reveal && (
                        <motion.div key="reveal"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center w-full gap-6"
                        >
                            <div className="w-full">
                                <h2 className="text-2xl font-black uppercase text-white tracking-[0.2em] border-b border-white/20 pb-3 mb-4">
                                    ИТОГИ РАУНДА
                                </h2>
                            </div>

                            <div className="space-y-3 w-full">
                                {round > 1 && (
                                    <div className={`border rounded-2xl p-5 flex justify-between items-center w-full ${intercepted ? 'bg-premium-red/10 border-premium-red/30' : 'bg-white/5 border-white/10'}`}>
                                        <div className="text-left">
                                            <p className="text-xs text-white/40 uppercase font-bold">Перехват {tLabel(enemyColor)}</p>
                                            <p className="text-white text-2xl font-black tracking-[0.2em] mt-1">
                                                {(interceptGuess as number[]).join(' - ')}
                                            </p>
                                        </div>
                                        <span className={`font-black px-4 py-2 rounded-xl border text-sm ${intercepted ? 'text-premium-red bg-premium-red/15 border-premium-red/30' : 'text-white/30 bg-white/5 border-white/10'}`}>
                                            {intercepted ? 'ПЕРЕХВАТ' : 'МИМО'}
                                        </span>
                                    </div>
                                )}

                                <div className={`border rounded-2xl p-5 flex justify-between items-center w-full ${guessCorrect ? 'bg-premium-green/10 border-premium-green/30' : 'bg-premium-red/10 border-premium-red/30'}`}>
                                    <div className="text-left">
                                        <p className="text-xs text-white/40 uppercase font-bold">Команда {tLabel(activeTeam)}</p>
                                        <p className="text-white text-2xl font-black tracking-[0.2em] mt-1">
                                            {(teamGuess as number[]).join(' - ')}
                                        </p>
                                    </div>
                                    <span className={`font-black px-4 py-2 rounded-xl border text-sm ${guessCorrect ? 'text-premium-green bg-premium-green/15 border-premium-green/30' : 'text-premium-red bg-premium-red/15 border-premium-red/30'}`}>
                                        {guessCorrect ? 'УСПЕХ' : 'ОШИБКА'}
                                    </span>
                                </div>
                            </div>

                            <ScoreRow red={redState} blue={blueState} />

                            <PrimaryButton onClick={continueAfterReveal} variant="white" className="w-full h-16 text-lg tracking-widest">
                                ДАЛЬШЕ
                            </PrimaryButton>
                        </motion.div>
                    )}

                    {/* ── GAME OVER ── */}
                    {phase === DecryptoPhase.GameOver && (
                        <motion.div key="game_over"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center gap-8"
                        >
                            <Trophy className={`w-24 h-24 ${winner ? tText(winner) : 'text-white'}`} />
                            <div className="space-y-2">
                                <p className="text-sm uppercase tracking-widest text-premium-green font-bold">ИГРА ОКОНЧЕНА</p>
                                <h2 className={`text-5xl font-black uppercase ${winner ? tText(winner) : ''}`}>
                                    ПОБЕДА {winner ? tLabel(winner).toUpperCase() : ''}!
                                </h2>
                            </div>
                            <div className="flex gap-4">
                                {([['red', redState], ['blue', blueState]] as [TeamColor, TeamState][]).map(([color, state]) => (
                                    <div key={color} className={`px-5 py-3 rounded-2xl border ${tBg(color)} text-center`}>
                                        <p className={`text-[9px] font-black uppercase ${tText(color)} mb-1`}>{tLabel(color)}</p>
                                        <p className="text-white/40 text-xs">✗ {state.interceptions} перехватов</p>
                                        <p className="text-white/40 text-xs">✗ {state.fails} ошибок</p>
                                    </div>
                                ))}
                            </div>
                            <PrimaryButton onClick={initGame} variant="white">НОВАЯ ИГРА</PrimaryButton>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
