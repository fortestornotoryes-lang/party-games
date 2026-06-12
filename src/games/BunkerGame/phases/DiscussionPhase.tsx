import {ChevronRight, Clock, MessageCircle} from 'lucide-react';
import {motion} from 'motion/react';
import React, {useEffect} from 'react';

import {ResourceContribRow} from '../components/ResourceContribRow';
import {getRevealedResourceContribution, getRevealedTrait} from '../helpers';
import {type BunkerCharacter, type DifficultyLevel} from '../types';

import {useGameSettings} from '@/entities/game/model/GameSettingsContext';
import {PrimaryButton} from "@/shared/components/PrimaryButton";
import {TimerBar} from '@/shared/components/TimerBar';
import {Typography} from '@/shared/components/Typography';
import {useTimer} from '@/shared/hooks/useTimer';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import {feedbackService, VIBRATE} from '@/shared/services/feedbackService';
import {DIFFICULTY} from '@/shared/types';

interface DiscussionPhaseProps {
    characters: BunkerCharacter[];
    revealRound: number;
    totalRounds: number;
    difficulty: DifficultyLevel;
    onNext: () => void;
}

export const DiscussionPhase: React.FC<DiscussionPhaseProps> = ({
                                                                    characters,
                                                                    revealRound,
                                                                    totalRounds,
                                                                    difficulty,
                                                                    onNext,
                                                                }) => {
    const {t} = useTranslation();
    const {timerSeconds} = useGameSettings();
    const isLastRound = revealRound === totalRounds;

    const {timeLeft, start, reset} = useTimer({
        initialTime: timerSeconds,
        onTimeUp: () => {
            feedbackService.vibrate(VIBRATE.timeout);
        },
    });

    useEffect(() => {
        reset(timerSeconds);
        start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revealRound, timerSeconds]);

    const handleNext = () => {
        feedbackService.vibrate(VIBRATE.tap);
        onNext();
    };

    const timerPct = (timeLeft / timerSeconds) * 100;
    const timerColor = timerPct > 50 ? '#00D88A' : timerPct > 20 ? '#FFCC1F' : '#FF2E4D';

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <motion.div
            key={`discussion-${revealRound}`}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            className="flex flex-col min-h-full px-5 py-6 gap-5"
        >
            {/* Header */}
            <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4 text-premium-green"/>
                    <Typography.Label size="sm" color="green">
                        {t(`${NS.BUNKER}.discussionOf`)} —{' '}
                        {t(`${NS.BUNKER}.discussionRoundNames.r${revealRound}`)}
                    </Typography.Label>
                </div>
                <Typography.Caption color="faint">
                    {t(`${NS.BUNKER}.roundOf`, {current: revealRound, total: totalRounds})}
                </Typography.Caption>
            </div>

            {/* Timer */}
            <div className="space-y-2">
                <TimerBar pct={timerPct} color={timerColor}/>
                <div className="flex items-center justify-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-white/30"/>
                    <span className="text-2xl font-black italic tabular-nums" style={{color: timerColor}}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </span>
                </div>
            </div>

            {/* What was revealed this round */}
            <div className="space-y-2">
                <Typography.Label size="xs" color="muted">
                    {t(`${NS.BUNKER}.revealedThisRound`)}
                </Typography.Label>
                <div className="space-y-1.5">
                    {characters.map((char) => {
                        const rev = getRevealedTrait(char, revealRound);
                        if (!rev) return null;
                        return (
                            <div
                                key={char.playerName}
                                className="flex items-center gap-3 p-3 rounded-premium-sm"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <span className="text-xl w-7 text-center flex-shrink-0">{rev.entry.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-micro text-white/30 font-black uppercase tracking-widest">
                                        {char.playerName} · {t(`${NS.BUNKER}.ageShort`, {n: char.age})} · {char.gender} ·{' '}
                                        {t(`${NS.BUNKER}.traitLabels.${rev.traitKey}`)}
                                    </div>
                                    <div className="text-sm font-bold text-white truncate">{rev.entry.name}</div>
                                </div>
                                {!rev.entry.isPositive && <span className="text-xs text-premium-red/70">⚠</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Previous rounds summary (compact) */}
            {revealRound > 1 && (
                <div className="space-y-2">
                    <Typography.Label size="xs" color="muted">
                        {t(`${NS.BUNKER}.revealedBefore`)}
                    </Typography.Label>
                    <div className="space-y-1">
                        {characters.map((char) => {
                            const prev: string[] = [];
                            for (let r = 1; r < revealRound; r++) {
                                const rev = getRevealedTrait(char, r);
                                if (rev) prev.push(`${rev.entry.emoji} ${rev.entry.name}`);
                            }
                            return (
                                <div key={char.playerName} className="flex items-start gap-2 text-label">
                  <span className="font-black text-white/50 w-20 flex-shrink-0 truncate">
                    {char.playerName}
                  </span>
                                    <span className="text-white/30">{prev.join(' · ')}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Resource contribution per player (revealed traits only, hidden on hard) */}
            {difficulty !== DIFFICULTY.HARD && (
                <div className="space-y-2">
                    <Typography.Label size="xs" color="muted">
                        {t(`${NS.BUNKER}.resourceContribution`)}
                    </Typography.Label>
                    <div className="space-y-1">
                        {characters.map((char) => {
                            const contrib = getRevealedResourceContribution(char, revealRound);
                            if (Object.values(contrib).every(v => v === 0)) return null;
                            return (
                                <div key={char.playerName} className="flex items-center gap-2 min-w-0">
                                    <span className="text-xs font-black text-white/50 w-20 flex-shrink-0 truncate">
                                        {char.playerName}
                                    </span>
                                    <ResourceContribRow contrib={contrib} className="flex gap-2 flex-wrap"/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Next button */}
            <div className="mt-auto">
                <PrimaryButton
                    onClick={handleNext}
                    variant={isLastRound ? 'premium' : 'outline'}
                    icon={ChevronRight}
                >
                    {isLastRound
                        ? t(`${NS.BUNKER}.toVoting`)
                        : t(`${NS.BUNKER}.nextRoundBtn`, {next: revealRound + 1, total: totalRounds})}
                </PrimaryButton>
            </div>
        </motion.div>
    );
};
