import React, {useState, useEffect} from 'react';
import {AnimatePresence} from 'motion/react';
import {GameHeader} from '@/components/GameHeader';
import {Grid, User} from 'lucide-react';
import {useGameSettings} from '../../contexts/GameSettingsContext';
import {contentService} from '@/services/contentService.ts';
import {shuffle} from '@/utils/random.ts';
import {GAMES_REGISTRY} from '../../registry/GameRegistry';
import {CodenamesPhase, Team, CardColor, Card} from './types';
import {PassPhoneCard} from '@/components/PassPhoneCard.tsx';
import {useTranslation} from '@/i18n';
import {SetupPhase} from './phases/SetupPhase';
import {CaptainPhase} from './phases/CaptainPhase';
import {TeamPhase} from './phases/TeamPhase';
import {GameOverPhase} from './phases/GameOverPhase';

interface CodenamesGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const CodenamesGame: React.FC<CodenamesGameProps> = ({playerNames, onBack}) => {
    const {difficulty, mode: activeMode} = useGameSettings();
    const {t} = useTranslation();

    const [phase, setPhase] = useState<CodenamesPhase>(CodenamesPhase.Setup);
    const [cards, setCards] = useState<Card[]>([]);
    const [turn, setTurn] = useState<Team>('red');

    const [redCaptain, setRedCaptain] = useState('');
    const [blueCaptain, setBlueCaptain] = useState('');
    const [redTeam, setRedTeam] = useState<string[]>([]);
    const [blueTeam, setBlueTeam] = useState<string[]>([]);

    const [clueWord, setClueWord] = useState('');
    const [clueCount, setClueCount] = useState(0);
    const [guessesLeft, setGuessesLeft] = useState(0);
    const [winner, setWinner] = useState<Team | null>(null);
    const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

    useEffect(() => {
        if (playerNames.length < 4) return;
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
        let colorAssignment: CardColor[];

        if (activeMode === 'deep_cover') {
            colorAssignment = [...Array(8).fill('red'), ...Array(8).fill('blue'), ...Array(7).fill('neutral'), ...Array(2).fill('assassin')];
        } else if (activeMode === 'double_agent') {
            colorAssignment = [...Array(8).fill('red'), ...Array(8).fill('blue'), ...Array(7).fill('neutral'), 'assassin', 'double_agent'];
        } else {
            colorAssignment = [...Array(9).fill('red'), ...Array(8).fill('blue'), ...Array(7).fill('neutral'), 'assassin'];
        }

        colorAssignment = shuffle(colorAssignment);
        setCards(shuffledWords.map((word, i) => ({id: i, word, color: colorAssignment[i], revealed: false})));
        setTurn(activeMode === 'classic' ? 'red' : (Math.random() > 0.5 ? 'red' : 'blue'));
        setPhase(CodenamesPhase.Setup);
        setWinner(null);
    };

    const currentCaptain = turn === 'red' ? redCaptain : blueCaptain;

    const handleSubmitClue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clueWord || clueCount < 0) return;
        setGuessesLeft(clueCount + 1);
        setPhase(CodenamesPhase.PassTeam);
    };

    const endTurn = () => {
        setTurn(prev => prev === 'red' ? 'blue' : 'red');
        setClueWord('');
        setClueCount(0);
        setPhase(CodenamesPhase.PassCaptain);
    };

    const handleCardClick = (card: Card) => {
        if (card.revealed) return;

        let cardColor = card.color;
        if (cardColor === 'double_agent') cardColor = turn;

        const updatedCards = cards.map(c => c.id === card.id ? {...c, revealed: true, color: cardColor} : c);
        setCards(updatedCards);

        if (cardColor === 'assassin') {
            setWinner(turn === 'red' ? 'blue' : 'red');
            setPhase(CodenamesPhase.GameOver);
            return;
        }

        const redLeft = updatedCards.filter(c => c.color === 'red' && !c.revealed).length;
        const blueLeft = updatedCards.filter(c => c.color === 'blue' && !c.revealed).length;

        if (redLeft === 0) {setWinner('red'); setPhase(CodenamesPhase.GameOver); return;}
        if (blueLeft === 0) {setWinner('blue'); setPhase(CodenamesPhase.GameOver); return;}

        if (cardColor === turn) {
            const left = guessesLeft - 1;
            setGuessesLeft(left);
            if (left <= 0) {
                setLastActionMsg(t('codenames.turnEnded'));
                setTimeout(() => {setLastActionMsg(null); endTurn();}, 1500);
            }
        } else {
            setLastActionMsg(cardColor === 'neutral' ? t('codenames.neutralRevealed') : t('codenames.enemyAgent'));
            setTimeout(() => {setLastActionMsg(null); endTurn();}, 1500);
        }
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
                        <SetupPhase
                            redCaptain={redCaptain}
                            blueCaptain={blueCaptain}
                            redTeam={redTeam}
                            blueTeam={blueTeam}
                            onPlay={() => setPhase(CodenamesPhase.PassCaptain)}
                        />
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
                        <CaptainPhase
                            cards={cards}
                            turn={turn}
                            currentCaptain={currentCaptain}
                            clueWord={clueWord}
                            clueCount={clueCount}
                            onClueWordChange={setClueWord}
                            onClueCountChange={setClueCount}
                            onSubmit={handleSubmitClue}
                        />
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
                        <TeamPhase
                            cards={cards}
                            turn={turn}
                            clueWord={clueWord}
                            clueCount={clueCount}
                            guessesLeft={guessesLeft}
                            lastActionMsg={lastActionMsg}
                            onCardClick={handleCardClick}
                            onEndTurn={endTurn}
                        />
                    )}

                    {phase === CodenamesPhase.GameOver && winner && (
                        <GameOverPhase
                            winner={winner}
                            onRematch={initBoard}
                        />
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
