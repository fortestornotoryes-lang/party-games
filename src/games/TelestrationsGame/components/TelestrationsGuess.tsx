import {MessageSquare} from 'lucide-react';
import React from 'react';

import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface Props {
    lastDrawing: string;
    timeLeft: number;
    currentRound: number;
    shuffledPlayers: string[];
    guess: string;
    onGuessChange: (v: string) => void;
    onSubmit: () => void;
}

export const TelestrationsGuess: React.FC<Props> = ({
                                                        lastDrawing,
                                                        timeLeft,
                                                        currentRound,
                                                        shuffledPlayers,
                                                        guess,
                                                        onGuessChange,
                                                        onSubmit,
                                                    }) => {
    const {t} = useTranslation();

    return (
        <div className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-6 gap-4">
            <div className="text-center space-y-1">
                <p className="text-tag text-white/30 uppercase font-black tracking-widest">
                    {t(`${NS.TELESTRATIONS}.guessDrawing`)}
                </p>
                <span
                    className={`block text-2xl font-black tabular-nums ${timeLeft <= 10 ? 'text-premium-red animate-pulse' : 'text-white/40'}`}
                >
                    {t(`${NS.TELESTRATIONS}.timerSeconds`, {n: timeLeft})}
                </span>
                <h3 className="text-xl font-black italic">{t(`${NS.TELESTRATIONS}.whatIsDepicted`)}</h3>
            </div>

            <div className="flex justify-center gap-1.5">
                {shuffledPlayers.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            i < currentRound
                                ? 'w-3 bg-premium-orange/30'
                                : i === currentRound
                                    ? 'w-5 bg-premium-orange'
                                    : 'w-3 bg-white/10'
                        }`}
                    />
                ))}
            </div>

            <div className="w-full max-w-sm rounded-premium-md border border-white/10 overflow-hidden shadow-2xl">
                <img src={lastDrawing} alt="Drawing" className="w-full h-auto block"/>
            </div>

            <div className="w-full max-w-sm space-y-3">
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => {
                        onGuessChange(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && guess.trim()) onSubmit();
                    }}
                    placeholder={t(`${NS.TELESTRATIONS}.writePlaceholder`)}
                    className="w-full p-5 bg-white/5 border border-white/10 rounded-premium-md text-xl font-bold placeholder:text-white/25 focus:border-premium-orange focus:bg-premium-orange/5 transition-all outline-none"
                />
                <button
                    disabled={!guess.trim()}
                    onClick={onSubmit}
                    className="w-full py-5 bg-white text-black rounded-premium-md font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 disabled:opacity-20 transition-all shadow-2xl"
                >
                    <MessageSquare className="w-5 h-5"/>
                    <span>{t(`${NS.COMMON}.done`)}</span>
                </button>
            </div>
        </div>
    );
};
