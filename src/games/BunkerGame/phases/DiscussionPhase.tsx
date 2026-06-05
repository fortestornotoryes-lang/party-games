import React, {useEffect} from 'react';
import {motion} from 'motion/react';
import {ChevronRight, Clock, MessageCircle} from 'lucide-react';
import {PrimaryButton, Typography} from '@/components/UI';
import {TimerBar} from '@/components/TimerBar';
import {useTimer} from '@/hooks/useTimer';
import {feedbackService, VIBRATE} from '@/services/feedbackService';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {type BunkerCharacter, getRevealedTrait} from '../types';

interface DiscussionPhaseProps {
    characters: BunkerCharacter[];
    revealRound: number; // 1, 2, or 3
    totalRounds: number;
    onNext: () => void; // go to next reveal round or voting
}

const DISCUSSION_SECONDS = 150; // 2.5 minutes

export const DiscussionPhase: React.FC<DiscussionPhaseProps> = ({
                                                                    characters,
                                                                    revealRound,
                                                                    totalRounds,
                                                                    onNext,
                                                                }) => {
    const {t} = useTranslation();
    const isLastRound = revealRound === totalRounds;

    const {timeLeft, start, reset} = useTimer({
        initialTime: DISCUSSION_SECONDS,
        onTimeUp: () => {
            feedbackService.vibrate(VIBRATE.timeout);
        },
    });

    useEffect(() => {
        reset(DISCUSSION_SECONDS);
        start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revealRound]);

    const handleNext = () => {
        feedbackService.vibrate(VIBRATE.tap);
        onNext();
    };

    const timerPct = (timeLeft / DISCUSSION_SECONDS) * 100;
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
                                        {char.playerName} · {char.age} л · {char.gender} ·{' '}
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
