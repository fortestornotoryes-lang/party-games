import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon, Users, KeyRound, AlertOctagon, Key, Trophy } from 'lucide-react';
import { GameHeader } from '../../components/GameHeader';
import { PrimaryButton } from '../../components/UI';
import { useGameSettings } from '../../contexts/GameSettingsContext';
import { contentService } from '../../services/contentService';
import { GAMES_REGISTRY } from '../../registry/GameRegistry';
import { DecryptoPhase } from './types';

interface DecryptoGameProps {
    playerNames: string[];
    onBack: () => void;
}

type TeamColor = 'red' | 'blue';

interface RoundData {
    code: number[];
    clues: string[];
    interceptionGuess: number[] | null;
    teamGuess: number[];
}

interface TeamState {
    words: string[];
    players: string[];
    interceptions: number;
    fails: number;
    history: RoundData[];
    captainIndex: number;
}

// ─── style helpers ────────────────────────────────────────────────────────────

const tLabel = (c: TeamColor) => c === 'red' ? 'Красных' : 'Синих';
const tText  = (c: TeamColor) => c === 'red' ? 'text-premium-red' : 'text-premium-blue';
const tBg    = (c: TeamColor) => c === 'red'
    ? 'bg-premium-red/10 border-premium-red/20'
    : 'bg-premium-blue/10 border-premium-blue/20';
const tBadge = (c: TeamColor) => c === 'red'
    ? 'bg-premium-red/20 text-premium-red'
    : 'bg-premium-blue/20 text-premium-blue';
const tFocus = (c: TeamColor) => c === 'red'
    ? 'focus:border-premium-red/50'
    : 'focus:border-premium-blue/50';
const tGlow  = (c: TeamColor) => c === 'red'
    ? 'drop-shadow-[0_0_15px_rgba(255,46,77,0.5)]'
    : 'drop-shadow-[0_0_15px_rgba(63,123,255,0.5)]';

// ─── CodeInput ────────────────────────────────────────────────────────────────

const CodeInput: React.FC<{
    value: (number | '')[];
    onChange: (v: (number | '')[]) => void;
    max: number;
    team: TeamColor;
}> = ({ value, onChange, max, team }) => (
    <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map(i => (
            <input
                key={i} type="number" min="1" max={max} required
                value={value[i] === '' ? '' : value[i]}
                onChange={(e) => {
                    const g = [...value] as (number | '')[];
                    if (e.target.value === '') {
                        g[i] = '';
                    } else {
                        const v = parseInt(e.target.value);
                        if (v >= 1 && v <= max) g[i] = v;
                    }
                    onChange(g);
                }}
                className={`h-16 text-2xl font-black text-center rounded-xl bg-white/5 border border-white/10 outline-none transition-colors ${tFocus(team)}`}
            />
        ))}
    </div>
);

// ─── ScoreRow ─────────────────────────────────────────────────────────────────

const ScoreRow: React.FC<{ red: TeamState; blue: TeamState }> = ({ red, blue }) => (
    <div className="flex gap-3 w-full">
        {([['red', red], ['blue', blue]] as [TeamColor, TeamState][]).map(([color, state]) => {
            const captain = state.players[state.captainIndex % state.players.length];
            return (
                <div key={color} className={`flex-1 p-3 rounded-xl border ${tBg(color)} space-y-2`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${tText(color)}`}>{tLabel(color)}</span>
                        <span className="text-[10px] text-white/40 font-bold">✗{state.interceptions} · {state.fails}ош</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {state.players.map(p => (
                            <span
                                key={p}
                                className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                                    p === captain
                                        ? `${tBadge(color)} border border-current/30`
                                        : 'bg-white/5 text-white/35'
                                }`}
                            >
                                {p === captain ? `★ ${p}` : p}
                            </span>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
);

// ─── PassScreen ───────────────────────────────────────────────────────────────

const PassScreen: React.FC<{
    icon: LucideIcon;
    team: TeamColor;
    subtitle: string;
    buttonLabel: string;
    onContinue: () => void;
    red: TeamState;
    blue: TeamState;
    children?: React.ReactNode;
}> = ({ icon: Icon, team, subtitle, buttonLabel, onContinue, red, blue, children }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="flex-1 flex flex-col items-center justify-center text-center gap-6"
    >
        <div className={`p-8 rounded-[2rem] ${tBg(team)} border shadow-2xl`}>
            <Icon className={`w-24 h-24 ${tText(team)} ${tGlow(team)}`} />
        </div>

        {children ?? (
            <span className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest ${tBadge(team)}`}>
                Команде {tLabel(team)}
            </span>
        )}

        <ScoreRow red={red} blue={blue} />

        <div className="w-full space-y-3">
            <PrimaryButton onClick={onContinue} variant={team} className="w-full h-16 text-lg tracking-widest">
                {buttonLabel}
            </PrimaryButton>
            <p className="text-[10px] text-white/25 font-bold uppercase animate-pulse">{subtitle}</p>
        </div>
    </motion.div>
);

// ─── main component ───────────────────────────────────────────────────────────

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
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        return nums.slice(0, 3);
    };

    const initGame = () => {
        const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
        const half = Math.ceil(shuffled.length / 2);
        const redPlayers  = shuffled.slice(0, half);
        const bluePlayers = shuffled.slice(half);
        setRedState({ words: contentService.getDecryptoWords(difficulty, wordCount), players: redPlayers,  interceptions: 0, fails: 0, history: [], captainIndex: Math.floor(Math.random() * redPlayers.length) });
        setBlueState({ words: contentService.getDecryptoWords(difficulty, wordCount), players: bluePlayers, interceptions: 0, fails: 0, history: [], captainIndex: Math.floor(Math.random() * bluePlayers.length) });
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

    const handleCluesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (clues.some(c => c.trim() === '')) return;
        setPhase(round > 1 ? DecryptoPhase.PassEnemy : DecryptoPhase.PassTeam);
    };

    const continueAfterReveal = () => {
        // Build mutable copies from current state — never re-read stale state refs
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

        // Check win condition before committing state
        if (env.interceptions >= 2 || cur.fails >= 2) {
            setRedState(newRed);
            setBlueState(newBlue);
            setWinner(activeTeam === 'red' ? 'blue' : 'red');
            setPhase(DecryptoPhase.GameOver);
            return;
        }

        if (activeTeam === 'red') {
            // Mid-round: switch to blue team
            setRedState(newRed);
            setBlueState(newBlue);
            setActiveTeam('blue');
        } else {
            // End of round: advance to next round, captain stays fixed
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

    const curState     = activeTeam === 'red' ? redState : blueState;
    const enemyColor   = activeTeam === 'red' ? 'blue' : 'red' as TeamColor;
    const intercepted  = round > 1 && (interceptGuess as number[]).join('') === currentCode.join('');
    const guessCorrect = (teamGuess as number[]).join('') === currentCode.join('');

    return (
        <div className="flex flex-col min-h-screen text-white pb-20">
            <GameHeader
                title={GAMES_REGISTRY.decrypto.title}
                subtitle="Коды и перехваты"
                icon={Key}
                themeColor="text-premium-purple bg-premium-purple/10 border-premium-purple/30"
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
                        <motion.div key="captain_clues"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6 flex flex-col overflow-auto pb-8 relative h-full"
                        >
                            <div className={`text-center sticky top-0 bg-black/60 backdrop-blur-md py-3 z-10`}>
                                <p className={`text-[10px] tracking-widest uppercase font-black ${tText(activeTeam)}`}>
                                    Шифровальщик {tLabel(activeTeam)}
                                </p>
                                <h3 className="text-3xl text-white font-black tracking-[0.2em]">
                                    {currentCode.join(' - ')}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {curState.words.map((w, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-2 rounded-xl relative flex flex-col items-center justify-center h-20">
                                        <span className="absolute left-2 top-2 text-[10px] text-white/30 font-black">{i + 1}</span>
                                        <span className="text-sm font-bold uppercase">{w}</span>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleCluesSubmit} className="space-y-4 flex-1">
                                <p className="text-xs font-bold text-white/40 text-center uppercase">Напишите ассоциации к словам кода</p>
                                {currentCode.map((num, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className={`w-8 h-8 flex items-center justify-center font-black rounded-lg shrink-0 ${tBadge(activeTeam)}`}>
                                            {num}
                                        </div>
                                        <input
                                            required type="text"
                                            value={clues[i]}
                                            onChange={(e) => {
                                                const c = [...clues];
                                                c[i] = e.target.value;
                                                setClues(c);
                                            }}
                                            placeholder={`Ассоциация на "${curState.words[num - 1]}"`}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors placeholder:text-white/25"
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
                        <motion.div key="enemy_intercept"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-4 flex flex-col h-full overflow-auto"
                        >
                            <p className={`text-[10px] tracking-widest uppercase font-black text-center ${tText(enemyColor)}`}>
                                ВРЕМЯ ПЕРЕХВАТА · КОМАНДА {tLabel(enemyColor).toUpperCase()}
                            </p>

                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <p className="text-xs text-white/30 font-bold uppercase mb-2">Текущие подсказки врага</p>
                                <ul className="space-y-1">
                                    {clues.map((c, i) => (
                                        <li key={i} className="text-white font-bold">{i + 1}. {c}</li>
                                    ))}
                                </ul>
                            </div>

                            {curState.history.length > 0 && (
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                    <p className="text-xs text-white/30 font-bold uppercase mb-2">История раундов врага</p>
                                    <div className="space-y-2">
                                        {curState.history.map((h, i) => (
                                            <div key={i} className="text-xs">
                                                <span className="text-premium-purple font-bold">Код {h.code.join('-')}</span>: {h.clues.join(', ')}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={(e) => { e.preventDefault(); setPhase(DecryptoPhase.PassTeam); }} className="mt-2 space-y-4 flex-1">
                                <p className="text-[10px] font-bold text-center text-white/40 uppercase">Введите перехваченный код</p>
                                <CodeInput value={interceptGuess} onChange={setInterceptGuess} max={wordCount} team={enemyColor} />
                                <PrimaryButton type="submit" variant={enemyColor} className="w-full">
                                    ПОДТВЕРДИТЬ ПЕРЕХВАТ
                                </PrimaryButton>
                            </form>
                        </motion.div>
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
                        <motion.div key="team_guess"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="space-y-4 flex flex-col h-full overflow-auto"
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {curState.words.map((w, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-2 rounded-xl relative flex flex-col items-center justify-center h-16">
                                        <span className="absolute left-2 top-2 text-[10px] text-white/30 font-black">{i + 1}</span>
                                        <span className="text-sm font-bold uppercase">{w}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl">
                                <p className="text-xs text-white/30 font-bold uppercase mb-2">Подсказки капитана</p>
                                <ul className="space-y-1 text-lg font-black uppercase tracking-wider text-center">
                                    {clues.map((c, i) => <li key={i} className="text-white">{c}</li>)}
                                </ul>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); setPhase(DecryptoPhase.Reveal); }} className="mt-2 space-y-4 flex-1">
                                <p className="text-[10px] font-bold text-center text-white/40 uppercase">Введите ваш код</p>
                                <CodeInput value={teamGuess} onChange={setTeamGuess} max={wordCount} team={activeTeam} />
                                <PrimaryButton type="submit" variant={activeTeam} className="w-full">РАЗГАДАТЬ</PrimaryButton>
                            </form>
                        </motion.div>
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
