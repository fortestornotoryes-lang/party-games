import React from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {PrimaryButton} from '@/components/UI';
import {useTranslation} from '@/i18n';
import {Card, Team} from '../types';

interface TeamPhaseProps {
    cards: Card[];
    turn: Team;
    clueWord: string;
    clueCount: number;
    guessesLeft: number;
    lastActionMsg: string | null;
    onCardClick: (card: Card) => void;
    onEndTurn: () => void;
}

export const TeamPhase: React.FC<TeamPhaseProps> = ({
                                                        cards,
                                                        turn,
                                                        clueWord,
                                                        clueCount,
                                                        guessesLeft,
                                                        lastActionMsg,
                                                        onCardClick,
                                                        onEndTurn,
                                                    }) => {
    const {t} = useTranslation();

    return (
        <motion.div
            key="team"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="space-y-4 flex flex-col h-full"
        >
            <div
                className="flex flex-col items-center justify-center text-center bg-white/5 py-3 rounded-premium-md border border-white/10 relative overflow-hidden">
                <div
                    className={`absolute left-0 top-0 bottom-0 w-2 ${turn === 'red' ? 'bg-premium-red' : 'bg-premium-blue'}`}
                />
                <p className="text-tag text-white/40 uppercase tracking-widest font-black mb-1">
                    {t('codenames.clueLabel')}
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black uppercase text-white tracking-widest">{clueWord}</h3>
                    <span className="text-xl font-bold text-white/30">{clueCount}</span>
                </div>
                <p className="text-xs text-white/30 mt-2">
                    {t('codenames.guessesLeft', {n: guessesLeft})}
                </p>
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
                                className="bg-black/90 backdrop-blur-md border border-white/20 px-6 py-4 rounded-premium-lg shadow-2xl">
                                <p className="text-xl font-black text-center text-white tracking-widest">
                                    {lastActionMsg}
                                </p>
                                <p className="text-tag text-white/30 text-center uppercase font-bold mt-2">
                                    {t('codenames.turnPassing')}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => onCardClick(card)}
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
                className={`text-tag sm:text-xs font-black leading-tight wrap-break-word uppercase ${!card.revealed ? 'text-stone-800' : ''}`}
            >
              {card.word}
            </span>
                    </button>
                ))}
            </div>

            <PrimaryButton onClick={onEndTurn} variant="outline" className="mt-4">
                {t('codenames.passTurn')}
            </PrimaryButton>
        </motion.div>
    );
};
