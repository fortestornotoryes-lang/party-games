import {Siren, Users} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import type {CatastropheScenario} from '../types';

import {PrimaryButton} from "@/shared/components/PrimaryButton";
import {Typography} from '@/shared/components/Typography';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import {feedbackService, VIBRATE} from '@/shared/services/feedbackService';

interface BriefingPhaseProps {
    scenario: CatastropheScenario;
    playerCount: number;
    bunkerCapacity: number;
    onStart: () => void;
}

export const BriefingPhase: React.FC<BriefingPhaseProps> = ({
    scenario,
    playerCount,
    bunkerCapacity,
    onStart,
}) => {
    const {t} = useTranslation();

    const handleStart = () => {
        feedbackService.vibrate(VIBRATE.tap);
        onStart();
    };

    return (
        <motion.div
            key="briefing"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.5}}
            className="flex flex-col min-h-full px-5 py-6 gap-6"
        >
            {/* Alarm header */}
            <div className="flex items-center gap-2 justify-center">
                <Siren className="w-5 h-5 text-premium-orange animate-pulse"/>
                <Typography.Label size="sm" color="orange">
                    {t(`${NS.BUNKER}.emergencyAlert`)}
                </Typography.Label>
                <Siren className="w-5 h-5 text-premium-orange animate-pulse"/>
            </div>

            {/* Catastrophe card */}
            <motion.div
                initial={{scale: 0.85, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{delay: 0.2, type: 'spring', stiffness: 260, damping: 22}}
                className="relative rounded-premium-md overflow-hidden"
                style={{
                    background:
                        'linear-gradient(160deg, rgba(255,138,31,0.12) 0%, rgba(255,46,77,0.08) 100%)',
                    border: '1.5px solid rgba(255,138,31,0.35)',
                    boxShadow: '0 0 80px rgba(255,138,31,0.18), 0 24px 64px rgba(0,0,0,0.5)',
                }}
            >
                {/* Top glow */}
                <div
                    className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse at 50% 0%, rgba(255,138,31,0.22), transparent 70%)',
                    }}
                />

                <div className="relative p-7 text-center space-y-4 overflow-y-auto">
                    {/* Emoji */}
                    <div className="text-5xl leading-none">{scenario.emoji}</div>

                    {/* Title */}
                    <Typography.Display size="sm" color="white" glow align="center">
                        {scenario.title.toUpperCase()}
                    </Typography.Display>

                    {/* Description */}
                    <Typography.Body size="sm" color="body" align="center">
                        {scenario.description}
                    </Typography.Body>
                </div>
            </motion.div>

            {/* Bunker capacity info */}
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.45}}
                className="rounded-premium-md p-4"
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-white/40"/>
                        <Typography.Label size="xs" color="muted">
                            {t(`${NS.BUNKER}.playersInGroup`)}
                        </Typography.Label>
                    </div>
                    <Typography.Heading size="sm" color="white">
                        {playerCount}
                    </Typography.Heading>
                </div>
                <div className="my-3" style={{height: '1px', background: 'rgba(255,255,255,0.06)'}}/>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-base">🏠</span>
                        <Typography.Label size="xs" color="muted">
                            {t(`${NS.BUNKER}.bunkerSpots`)}
                        </Typography.Label>
                    </div>
                    <Typography.Heading size="sm" color="orange">
                        {bunkerCapacity}
                    </Typography.Heading>
                </div>

                {/* Slots visual */}
                <div className="mt-3 flex gap-1.5 flex-wrap">
                    {Array.from({length: playerCount}).map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 flex-1 rounded-full min-w-[18px] transition-all ${
                                i < bunkerCapacity ? 'bg-premium-orange/70' : 'bg-white/10'
                            }`}
                        />
                    ))}
                </div>
                <div className="mt-2 flex justify-between">
                    <Typography.Caption color="faint">
                        {t(`${NS.BUNKER}.wontEnter`, {n: playerCount - bunkerCapacity})}
                    </Typography.Caption>
                    <Typography.Caption color="orange">
                        {t(`${NS.BUNKER}.willEnter`, {n: bunkerCapacity})}
                    </Typography.Caption>
                </div>
            </motion.div>

            {/* Start button */}
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.6}}
                className="mt-auto"
            >
                <PrimaryButton onClick={handleStart} variant="premium">
                    {t(`${NS.BUNKER}.distributeCards`)}
                </PrimaryButton>
            </motion.div>
        </motion.div>
    );
};
