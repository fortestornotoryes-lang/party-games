import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {GameHeader} from '@/components/GameHeader';
import {PrimaryButton, Typography} from '@/components/UI';
import {Grid, User, Users, Zap} from 'lucide-react';
import {useGameSettings} from '../../contexts/GameSettingsContext';
import {contentService} from '@/services/contentService.ts';
import { shuffle } from '@/utils/random.ts';
import {GAMES_REGISTRY} from '../../registry/GameRegistry';
import {CodenamesPhase} from './types';
import {PassPhoneCard} from "@/components/PassPhoneCard.tsx";
import {useTranslation} from '@/i18n';

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

export const CodenamesGame: React.FC<CodenamesGameProps> = ({playerNames, onBack}) => {
    const {difficulty, mode: activeMode} = useGameSettings();
    const {t} = useTranslation();
    const [phase, setPhase] = useState<CodenamesPhase>(CodenamesPhase.Setup);
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
        const shuffled = shuffle(playerNames);
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

        colorAssignment = shuffle(colorAssignment);

        const newCards = shuffledWords.map((word, i) => ({
            id: i,
            word,
            color: colorAssignment[i],
            revealed: false
        }));

        setCards(newCards);
        setTurn(activeMode === 'classic' ? 'red' : (Math.random() > 0.5 ? 'red' : 'blue'));
        setPhase(CodenamesPhase.Setup);
        setWinner(null);
    };

    const currentCaptain = turn === 'red' ? redCaptain : blueCaptain;

    const submitClue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clueWord || clueCount < 0) return;
        setGuessesLeft(clueCount + 1); // +1 extra guess allowed
        setPhase(CodenamesPhase.PassTeam);
    };

    const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

    const handleCardClick = (card: Card) => {
        if (phase !== CodenamesPhase.Team || card.revealed) return;

        // Handle Double Agent conversion
        let cardColor = card.color;
        if (cardColor === 'double_agent') {
            cardColor = turn;
        }

        const updatedCards = cards.map(c => c.id === card.id ? {...c, revealed: true, color: cardColor} : c);
        setCards(updatedCards);

        if (cardColor === 'assassin') {
            setWinner(turn === 'red' ? 'blue' : 'red');
            setPhase(CodenamesPhase.GameOver);
            return;
        }

        const redLeft = updatedCards.filter(c => c.color === 'red' && !c.revealed).length;
        const blueLeft = updatedCards.filter(c => c.color === 'blue' && !c.revealed).length;

        if (redLeft === 0) {
            setWinner('red');
            setPhase(CodenamesPhase.GameOver);
            return;
        }
        if (blueLeft === 0) {
            setWinner('blue');
            setPhase(CodenamesPhase.GameOver);
            return;
        }

        if (cardColor === turn) {
            const left = guessesLeft - 1;
            setGuessesLeft(left);
            if (left <= 0) {
                setLastActionMsg(t('codenames.turnEnded'));
                setTimeout(() => {
                    setLastActionMsg(null);
                    endTurn();
                }, 1500);
            }
        } else {
            setLastActionMsg(cardColor === 'neutral' ? t('codenames.neutralRevealed') : t('codenames.enemyAgent'));
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
        setPhase(CodenamesPhase.PassCaptain);
    };

    if (playerNames.length < 4) {
        return <div className="text-white flex items-center justify-center min-h-screen text-center p-8">{t('codenames.minPlayers')}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen text-white pb-20">
            <GameHeader
                title={GAMES_REGISTRY.codenames.title}
                subtitle={t('codenames.subtitle')}
                icon={Grid}
                theme="green"
                onBack={onBack}
            />

            <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full pt-10">
                <AnimatePresence mode="wait">

                    {phase === CodenamesPhase.Setup && (
                        <motion.div
                            key="setup"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            className="space-y-6 flex-1 flex flex-col justify-center"
                        >
                            <Typography.Title className="text-2xl font-black text-center mb-6 uppercase tracking-widest " color='green'>{t('common.teams')}</Typography.Title>

                            <div className="flex flex-col justify-center gap-4">
                                <div className="p-4 bg-premium-red/10 text-center border border-premium-red/30 rounded-2xl">
                                    <Typography.Heading className=" font-bold mb-2 uppercase text-xs flex items-center gap-2">
                                        <Users className="w-5 h-5 text-premium-red"/> {t('codenames.redTeam')}
                                    </Typography.Heading>
                                    <p className="font-bold border-b border-premium-red/20 pb-2 mb-2"><span
                                        className="text-xs text-premium-red/50 uppercase block">{t('codenames.captain')}</span>{redCaptain}
                                    </p>
                                    <p className="text-sm text-premium-red/70 opacity-80">{redTeam.join(', ')}</p>
                                </div>

                                <div className="text-center font-black text-5xl tracking-wider uppercase drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-linear-to-b from-amber-300 via-orange-500 to-red-600 animate-pulse">
                                    {t('common.vs')}
                                </div>
                                <div className="p-4 bg-premium-blue/10 text-center border border-premium-blue/30 rounded-2xl">
                                    <Typography.Heading className=" font-bold mb-2 uppercase text-xs flex items-center gap-2">
                                        <Users className="w-5 h-5 text-premium-blue"/> {t('codenames.blueTeam')}
                                    </Typography.Heading>
                                    <p className="font-bold border-b border-premium-blue/20 pb-2 mb-2"><span
                                        className="text-xs text-premium-blue/50 uppercase block">{t('codenames.captain')}</span>{blueCaptain}
                                    </p>
                                    <p className="text-sm text-premium-blue/70 opacity-80">{blueTeam.join(', ')}</p>
                                </div>
                            </div>

                            <PrimaryButton onClick={() => setPhase(CodenamesPhase.PassCaptain)} variant="emerald"
                                           className="mt-8">{t('codenames.play')}</PrimaryButton>
                        </motion.div>
                    )}

                    {phase === CodenamesPhase.PassCaptain && (
                        <PassPhoneCard
                            playerName={currentCaptain}
                            badgeColor={turn}
                            playerLabel={t('codenames.captain')}
                            instruction={t('codenames.othersNoSee')}
                            icon={User}
                            accentColor={turn}
                            onClick={() => setPhase(CodenamesPhase.Captain)}
                        />
                    )}

                    {phase === CodenamesPhase.Captain && (
                        <motion.div
                            key="captain"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="space-y-4 flex flex-col"
                        >
                            <div className="text-center">
                                <p className={`text-[20px] font-black uppercase tracking-widest ${turn === 'red' ? 'text-premium-red' : 'text-premium-blue'}`}>{t('codenames.captainTurn', {name: currentCaptain})}</p>
                                <div
                                    className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 mb-2 text-[12px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-1"><span
                                        className="w-4 h-4 rounded-full border border-premium-red bg-black"></span> {t('codenames.redTeam')}
                                    </div>
                                    <div className="flex items-center gap-1"><span
                                        className="w-4 h-4 rounded-full border border-premium-blue bg-black"></span> {t('codenames.blueTeam')}
                                    </div>
                                    <div className="flex items-center gap-1"><span
                                        className="w-4 h-4 rounded-full border bg-stone-400/50 "></span> {t('codenames.neutralEndTurn')}
                                    </div>
                                    <div className="flex items-center gap-1"><span
                                        className="w-4 h-4 rounded-full bg-red-900 border border-red-900"></span> {t('codenames.assassinDeath')}
                                    </div>
                                </div>
                                <p className="text-xs text-white/40 mt-1">{t('codenames.makeClueHint')}</p>

                            </div>

                            <div className="grid grid-cols-5 gap-1.5 mb-4">
                                {cards.map(card => (
                                    <div
                                        key={card.id}
                                        className={`aspect-4/3 rounded border flex items-center justify-center p-1 text-center relative
                      ${card.revealed ? 'opacity-30' : ''}
                      ${card.color === 'red' ? 'border-premium-red/80' :
                                            card.color === 'blue' ? 'border-premium-blue/80' :
                                                card.color === 'neutral' ? 'bg-stone-400/50 text-white ' :
                                                    card.color === 'double_agent' ? 'border-premium-green/80' :
                                                        ' bg-red-900 border-red-900'}
                    `}
                                    >
                                        <span
                                            className="text-[9px] font-bold leading-tight wrap-break-word uppercase">{card.word}</span>
                                        {card.color === 'double_agent' && <div className="absolute top-1 right-1"><Zap
                                            className="w-4 h-4 text-white fill-white"/></div>}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={submitClue} className="space-y-4 mt-auto">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={clueWord}
                                        onChange={(e) => setClueWord(e.target.value.replace(/ /g, ''))}
                                        placeholder={t('codenames.oneWord')}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center font-bold outline-none focus:border-premium-green/50 transition-colors uppercase"
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
                                        className="w-20 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-bold outline-none focus:border-premium-green/50 transition-colors"
                                        required
                                    />
                                </div>
                                <PrimaryButton type="submit" variant={turn === 'red' ? 'red' : 'blue'}
                                               disabled={!clueWord || clueCount <= 0}>{t('codenames.confirm')}</PrimaryButton>
                            </form>
                        </motion.div>
                    )}

                    {phase === CodenamesPhase.PassTeam && (
                        <PassPhoneCard
                            playerName={turn === 'red' ? t('codenames.teamRed') : t('codenames.teamBlue')}
                            badgeColor={turn}
                            playerLabel={t('common.team')}
                            instruction={t('codenames.othersNoSee')}
                            icon={User}
                            accentColor={turn}
                            onClick={() => setPhase(CodenamesPhase.Team)}
                        />
                    )}

                    {phase === CodenamesPhase.Team && (
                        <motion.div
                            key="team"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="space-y-4 flex flex-col h-full"
                        >
                            <div
                                className="flex flex-col items-center justify-center text-center bg-white/5 py-3 rounded-2xl border border-white/10 relative overflow-hidden">
                                <div
                                    className={`absolute left-0 top-0 bottom-0 w-2 ${turn === 'red' ? 'bg-premium-red' : 'bg-premium-blue'}`}/>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">{t('codenames.clueLabel')}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-black uppercase text-white tracking-widest">{clueWord}</h3>
                                    <span className="text-xl font-bold text-white/30">{clueCount}</span>
                                </div>
                                <p className="text-xs text-white/30 mt-2">{t('codenames.guessesLeft', {n: guessesLeft})}</p>
                            </div>

                            <div className="grid grid-cols-5 gap-1.5 flex-1 items-center relative">
                                <AnimatePresence>
                                    {lastActionMsg && (
                                        <motion.div
                                            initial={{opacity: 0, scale: 0.5}}
                                            animate={{opacity: 1, scale: 1}}
                                            exit={{opacity: 0, scale: 1.2}}
                                            className="absolute inset-0 z-10 flex items-center justify-center p-4"
                                        >
                                            <div
                                                className="bg-black/90 backdrop-blur-md border border-white/20 px-6 py-4 rounded-3xl shadow-2xl">
                                                <p className="text-xl font-black text-center text-white tracking-widest">{lastActionMsg}</p>
                                                <p className="text-[10px] text-white/30 text-center uppercase font-bold mt-2">{t('codenames.turnPassing')}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {cards.map(card => (
                                    <button
                                        key={card.id}
                                        onClick={() => handleCardClick(card)}
                                        disabled={card.revealed}
                                        className={`aspect-4/3 rounded flex items-center justify-center p-1 text-center transition-all
                      ${!card.revealed ? 'bg-stone-200 hover:bg-stone-300 active:scale-95 cursor-pointer shadow-md border-b-2 border-stone-400 text-stone-800' : ''}
                      ${card.revealed && card.color === 'red' ? 'bg-premium-red text-white border border-red-700 pointer-events-none opacity-80' : ''}
                      ${card.revealed && card.color === 'blue' ? 'bg-premium-blue text-white border border-blue-700 pointer-events-none opacity-80' : ''}
                      ${card.revealed && card.color === 'neutral' ? 'bg-stone-400 text-stone-800 border border-stone-500 pointer-events-none opacity-80' : ''}
                      ${card.revealed && card.color === 'assassin' ? 'bg-stone-900 text-white border border-black pointer-events-none opacity-90' : ''}
                    `}
                                    >
                    <span
                        className={`text-[10px] sm:text-xs font-black leading-tight wrap-break-word uppercase ${!card.revealed ? 'text-stone-800' : ''}`}>
                      {card.word}
                    </span>
                                    </button>
                                ))}
                            </div>

                            <PrimaryButton onClick={endTurn} variant="outline" className="mt-4">{t('codenames.passTurn')}</PrimaryButton>
                        </motion.div>
                    )}

                    {phase === CodenamesPhase.GameOver && (
                        <motion.div
                            key="game_over"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.9}}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div className="space-y-4">
                                <p className="text-sm uppercase tracking-widest text-premium-green font-bold">{t('common.gameOver')}</p>
                                <h2 className={`text-5xl font-black uppercase ${winner === 'red' ? 'text-premium-red' : 'text-premium-blue'}`}>
                                    {winner === 'red' ? t('codenames.redWins') : t('codenames.blueWins')}
                                </h2>
                            </div>
                            <PrimaryButton onClick={initBoard} variant="white">{t('common.rematch')}</PrimaryButton>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
