import {Ghost, MapPin, Shield} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import {useGameSettings} from '../../../contexts/GameSettingsContext';
import {ROLE_TOKENS} from '../../../theme/colors';
import type {Player} from '../../../types';

import {DistributionFlow} from '@/components/DistributionFlow';
import {Typography} from '@/components/Typography';
import {SPY_HUNT_ROLE_IDS} from '@/constants/spyHuntContent';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';

interface RoleDistributionProps {
    players: Player[];
    location: string;
    onFinish: () => void;
}

export const RoleDistribution: React.FC<RoleDistributionProps> = ({
                                                                      players,
                                                                      location,
                                                                      onFinish,
                                                                  }) => {
    const {t} = useTranslation();
    const {difficulty} = useGameSettings();

    return (
        <DistributionFlow
            players={players}
            onFinish={onFinish}
            activeColor="bg-premium-red"
            getCardStyle={(player) => {
                const roleType = player.isSpy ? 'spy' : player.role === SPY_HUNT_ROLE_IDS.TRAITOR ? 'traitor' : 'agent';
                return {
                    className: 'min-h-[28rem]',
                    style: {
                        border: ROLE_TOKENS[roleType].cardBorder,
                        boxShadow: ROLE_TOKENS[roleType].cardShadow,
                    },
                };
            }}
            renderCard={(player, isLast, onNext) => {
                const roleType = player.isSpy ? 'spy' : player.role === SPY_HUNT_ROLE_IDS.TRAITOR ? 'traitor' : 'agent';
                return (
                    <>
                        {/* Gradient bg */}
                        <div
                            className={`absolute inset-0 ${
                                roleType === 'spy'
                                    ? 'bg-gradient-to-b from-premium-red/[0.22]    via-premium-red/[0.06]    to-black/70'
                                    : roleType === 'traitor'
                                        ? 'bg-gradient-to-b from-premium-orange/20     via-premium-orange/[0.05] to-black/70'
                                        : 'bg-gradient-to-b from-premium-green/[0.15]  via-premium-green/[0.05]  to-black/70'
                            }`}
                        />

                        {/* Top glow */}
                        <div
                            className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-60"
                            style={{background: ROLE_TOKENS[roleType].topGlow}}
                        />

                        <div className="relative z-10 flex flex-col flex-1 p-7 items-center text-center">
                            {/* ── SPY ── */}
                            {roleType === 'spy' && (
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    className="flex-1 flex flex-col items-center justify-between w-full"
                                >
                                    <div className="text-center">
                                        <Typography.Caption color="red" className="opacity-50 tracking-[0.45em]">
                                            {t(`${NS.SPY_HUNT}.secretRole`)}
                                        </Typography.Caption>
                                        <Typography.Title color="muted" className="mt-0.5">
                                            {player.name}
                                        </Typography.Title>
                                    </div>

                                    <div className="space-y-3 text-center">
                                        <motion.div
                                            animate={{scale: [1, 1.06, 1]}}
                                            transition={{duration: 2.5, repeat: Infinity}}
                                        >
                                            <Ghost
                                                className="w-[88px] h-[88px] text-premium-red mx-auto"
                                                style={{filter: ROLE_TOKENS.spy.iconFilter}}
                                            />
                                        </motion.div>
                                        <Typography.Display size="lg" color="red" glow align="center">
                                            {t(`${NS.SPY_HUNT}.spy`)}
                                        </Typography.Display>
                                        <Typography.Body size="xs" color="faint" align="center">
                                            {t(`${NS.SPY_HUNT}.locationUnknown`)}
                                            <br/>
                                            {t(`${NS.SPY_HUNT}.dontRevealFindLocation`)}
                                        </Typography.Body>
                                        {difficulty === 'easy' && (
                                            <div
                                                className="px-4 py-2 bg-premium-red/10 border border-premium-red/20 rounded-premium-md">
                                                <Typography.Caption size="xs" color="red" className="opacity-55 mb-0.5">
                                                    {t(`${NS.SPY_HUNT}.hintLabel`)}
                                                </Typography.Caption>
                                                <p className="text-xs text-premium-red font-black">
                                                    {t(`${NS.SPY_HUNT}.lettersInName`, {n: location.length})}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={onNext}
                                        className="w-full py-4 bg-premium-red rounded-premium-md font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                                        style={{boxShadow: ROLE_TOKENS.spy.btnShadow}}
                                    >
                                        {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                                    </button>
                                </motion.div>
                            )}

                            {/* ── TRAITOR ── */}
                            {roleType === 'traitor' && (
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    className="flex-1 flex flex-col items-center justify-between w-full"
                                >
                                    <div className="text-center">
                                        <Typography.Caption color="orange" className="opacity-50 tracking-[0.45em]">
                                            {t(`${NS.SPY_HUNT}.secretRole`)}
                                        </Typography.Caption>
                                        <Typography.Title color="muted" className="mt-0.5">
                                            {player.name}
                                        </Typography.Title>
                                    </div>

                                    <div className="space-y-4 text-center">
                                        <Shield
                                            className="w-[72px] h-[72px] text-premium-orange mx-auto"
                                            style={{filter: ROLE_TOKENS.traitor.iconFilter}}
                                        />
                                        <Typography.Display size="md" color="orange" glow align="center">
                                            {t(`${NS.SPY_HUNT}.traitor`)}
                                        </Typography.Display>
                                        <div
                                            className="px-4 py-3 bg-premium-orange/10 border border-premium-orange/20 rounded-premium-md">
                                            <Typography.Caption size="xs" color="orange" className="opacity-50 mb-1">
                                                {t(`${NS.SPY_HUNT}.yourLocation`)}
                                            </Typography.Caption>
                                            <Typography.Heading size="sm" align="center">
                                                {location}
                                            </Typography.Heading>
                                        </div>
                                        <Typography.Caption color="faint">
                                            {t(`${NS.SPY_HUNT}.helpSpyConfuseOthers`)}
                                        </Typography.Caption>
                                    </div>

                                    <button
                                        onClick={onNext}
                                        className="w-full py-4 bg-premium-orange rounded-premium-md font-black uppercase tracking-[0.2em] text-white active:scale-95 transition-transform"
                                        style={{boxShadow: ROLE_TOKENS.traitor.btnShadow}}
                                    >
                                        {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                                    </button>
                                </motion.div>
                            )}

                            {/* ── AGENT ── */}
                            {roleType === 'agent' && (
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    className="flex-1 flex flex-col items-center justify-between w-full"
                                >
                                    <div className="text-center">
                                        <Typography.Caption color="green" className="opacity-50 tracking-[0.45em]">
                                            {t(`${NS.SPY_HUNT}.agentLabel`)}
                                        </Typography.Caption>
                                        <Typography.Title color="muted" className="mt-0.5">
                                            {player.name}
                                        </Typography.Title>
                                    </div>

                                    <div className="space-y-4 text-center">
                                        <MapPin
                                            className="w-[72px] h-[72px] text-premium-green mx-auto"
                                            style={{filter: ROLE_TOKENS.agent.iconFilter}}
                                        />
                                        <div className="space-y-1">
                                            <Typography.Caption color="green" className="opacity-50 tracking-[0.35em]">
                                                {t(`${NS.SPY_HUNT}.secretLocation`)}
                                            </Typography.Caption>
                                            <h3
                                                className="font-black italic text-white uppercase tracking-tighter leading-tight wrap-break-word"
                                                style={{
                                                    textShadow: ROLE_TOKENS.agent.textShadow,
                                                    fontSize: 'clamp(22px, 9vw, 40px)',
                                                }}
                                            >
                                                {location}
                                            </h3>
                                        </div>
                                        <div
                                            className="px-4 py-3 bg-premium-green/10 border border-premium-green/20 rounded-premium-md">
                                            <Typography.Caption size="xs" color="dimmer" className="mb-1">
                                                {t(`${NS.SPY_HUNT}.yourRole`)}
                                            </Typography.Caption>
                                            <Typography.Heading size="sm" color="green">
                                                {player.role}
                                            </Typography.Heading>
                                        </div>
                                        <Typography.Caption color="dimmer">
                                            {t(`${NS.SPY_HUNT}.findSpy`)}
                                        </Typography.Caption>
                                    </div>

                                    <button
                                        onClick={onNext}
                                        className="w-full py-4 bg-premium-green rounded-premium-md font-black uppercase tracking-[0.2em] text-black active:scale-95 transition-transform"
                                        style={{boxShadow: ROLE_TOKENS.agent.btnShadow}}
                                    >
                                        {isLast ? t(`${NS.SPY_HUNT}.startGame`) : t(`${NS.SPY_HUNT}.gotIt`)}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </>
                );
            }}
        />
    );
};
