import {EyeOff, Ghost, Palette} from 'lucide-react';
import {motion} from 'motion/react';
import React, {useEffect, useState} from 'react';

import {useGameSettings} from '../../../contexts/GameSettingsContext';
import {useFakeArtistContent} from '../model/useFakeArtistContent';

import {DistributionFlow} from '@/components/DistributionFlow';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import {rgba} from '@/shared/theme/colors';
import {DIFFICULTY, type Player} from '@/shared/types';

interface Props {
    players: Player[];
    onFinish: (word: string, category: string, rounds: number, timerSeconds: number) => void;
}

export const FakeArtistDistribution: React.FC<Props> = ({players, onFinish}) => {
    const {difficulty, rounds, timerSeconds} = useGameSettings();
    const {t} = useTranslation();
    const [word, setWord] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const diff = (difficulty) ?? DIFFICULTY.EASY;
        const item = useFakeArtistContent(diff);
        setWord(item.word);
        setCategory(item.category);
    }, [difficulty]);

    return (
        <DistributionFlow
            players={players}
            onFinish={() => {
                onFinish(word, category, rounds ?? 2, timerSeconds ?? 0);
            }}
            activeColor="bg-premium-sky"
            passIcon={EyeOff}
            passAccentColor="sky"
            getCardStyle={(player) => ({
                className: 'aspect-3/4',
                style: {
                    border: player.isSpy
                        ? `1.5px solid ${rgba('red', 0.45)}`
                        : `1.5px solid ${rgba('sky', 0.35)}`,
                    boxShadow: player.isSpy
                        ? `0 0 80px ${rgba('red', 0.22)}, var(--shadow-card), inset 0 1px 0 ${rgba('red', 0.12)}`
                        : `0 0 70px ${rgba('sky', 0.15)}, var(--shadow-card), inset 0 1px 0 ${rgba('sky', 0.08)}`,
                },
            })}
            renderCard={(player, isLast, onNext) => (
                <>
                    {/* Gradient bg */}
                    <div
                        className={`absolute inset-0 ${
                            player.isSpy
                                ? 'bg-gradient-to-b from-premium-red/[0.22] via-premium-red/[0.06] to-black/70'
                                : 'bg-gradient-to-b from-premium-sky/[0.18] via-premium-sky/[0.05] to-black/70'
                        }`}
                    />

                    {/* Top glow */}
                    <div
                        className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-60"
                        style={{background: player.isSpy ? rgba('red', 0.28) : rgba('sky', 0.2)}}
                    />

                    <div className="relative z-10 flex flex-col flex-1 p-7 items-center text-center">
                        {/* ── SPY ── */}
                        {!!player.isSpy && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="flex-1 flex flex-col items-center justify-between w-full"
                            >
                                <div>
                                    <p className="text-micro font-black uppercase tracking-[0.45em] text-premium-red/50">
                                        {t(`${NS.FAKE_ARTIST}.secretRole`)}
                                    </p>
                                    <h4 className="text-lg font-black italic text-white/50 mt-0.5">{player.name}</h4>
                                </div>

                                <div className="space-y-3">
                                    <motion.div
                                        animate={{scale: [1, 1.06, 1]}}
                                        transition={{duration: 2.5, repeat: Infinity}}
                                    >
                                        <Ghost
                                            className="w-[88px] h-[88px] text-premium-red mx-auto"
                                            style={{filter: `drop-shadow(0 0 20px ${rgba('red', 0.5)})`}}
                                        />
                                    </motion.div>
                                    <h3
                                        className="text-5xl font-black italic text-premium-red tracking-tighter leading-none"
                                        style={{textShadow: `0 0 48px ${rgba('red', 0.45)}`}}
                                    >
                                        {t(`${NS.FAKE_ARTIST}.imposter`)}
                                    </h3>
                                    <div
                                        className="px-4 py-2 bg-premium-red/10 border border-premium-red/20 rounded-premium-md">
                                        <p className="text-micro font-black uppercase text-premium-red/55 mb-0.5">
                                            {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                                        </p>
                                        <p className="text-sm font-black italic text-white uppercase">{category}</p>
                                    </div>
                                    <p className="text-white/30 text-tag leading-relaxed whitespace-pre-line">
                                        {t(`${NS.FAKE_ARTIST}.imposterHint`)}
                                    </p>
                                </div>

                                <button
                                    onClick={onNext}
                                    className="w-full py-4 bg-premium-red rounded-premium-md font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                                    style={{boxShadow: `0 8px 32px ${rgba('red', 0.35)}`}}
                                >
                                    {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
                                </button>
                            </motion.div>
                        )}

                        {/* ── ARTIST ── */}
                        {!player.isSpy && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="flex-1 flex flex-col items-center justify-between w-full"
                            >
                                <div>
                                    <p className="text-micro font-black uppercase tracking-[0.45em] text-premium-sky/50">
                                        {t(`${NS.FAKE_ARTIST}.artistRole`)}
                                    </p>
                                    <h4 className="text-lg font-black italic text-white/50 mt-0.5">{player.name}</h4>
                                </div>

                                <div className="space-y-4">
                                    <Palette
                                        className="w-[72px] h-[72px] text-premium-sky mx-auto"
                                        style={{filter: `drop-shadow(0 0 16px ${rgba('sky', 0.45)})`}}
                                    />
                                    <div className="space-y-1">
                                        <p className="text-micro font-black uppercase tracking-[0.35em] text-premium-sky/50">
                                            {t(`${NS.FAKE_ARTIST}.yourWord`)}
                                        </p>
                                        <h3
                                            className="text-5xl font-black italic text-white uppercase tracking-tighter leading-tight"
                                            style={{textShadow: `0 0 32px ${rgba('sky', 0.25)}`}}
                                        >
                                            {word}
                                        </h3>
                                    </div>
                                    <div
                                        className="px-4 py-3 bg-premium-sky/10 border border-premium-sky/20 rounded-premium-md">
                                        <p className="text-micro font-black uppercase text-premium-sky/50 tracking-widest mb-1">
                                            {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                                        </p>
                                        <p className="text-base font-black italic text-white uppercase">{category}</p>
                                    </div>
                                    <p className="text-white/[0.22] text-tag">
                                        {t(`${NS.FAKE_ARTIST}.artistHint`)}
                                    </p>
                                </div>

                                <button
                                    onClick={onNext}
                                    className="w-full py-4 bg-premium-sky rounded-premium-md font-black uppercase tracking-[0.2em] text-black active:scale-95 transition-transform"
                                    style={{boxShadow: `0 8px 32px ${rgba('sky', 0.25)}`}}
                                >
                                    {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </>
            )}
        />
    );
};
