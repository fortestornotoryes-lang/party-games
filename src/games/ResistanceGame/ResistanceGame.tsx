import confetti from 'canvas-confetti';
import {Activity, ArrowRight, CheckCircle2, Fingerprint, RotateCcw, Shield, Skull, XCircle,} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React, {useEffect} from 'react';

import {GAMES_REGISTRY} from '../../registry/GameRegistry';

import {ResistanceDistribution} from './components/ResistanceDistribution';
import {ResistancePhase} from './types';

import {GameHeader} from '@/components/GameHeader';
import {PassPhoneCard} from '@/components/PassPhoneCard';
import {MISSION_SIZES} from "@/games/ResistanceGame/constants.ts";
import {PrimaryButton} from "@/shared/components/PrimaryButton";
import {usePersistedState} from '@/shared/hooks/usePersistedState';
import {useTranslation} from '@/shared/i18n';
import {NS} from '@/shared/i18n/keys';
import type {Player} from '@/shared/types';
import {GameKey} from '@/types/games';
import {initResistance} from '@/utils/gameLogic.ts';

interface ResistanceGameProps {
    playerNames: string[];
    onBack: () => void;
}

export const ResistanceGame: React.FC<ResistanceGameProps> = ({playerNames, onBack}) => {
    const {t} = useTranslation();
    const K = GameKey.Resistance;
    const [players] = usePersistedState<Player[]>(
        K,
        'players',
        () => initResistance(playerNames).players
    );
    const [phase, setPhase] = usePersistedState<ResistancePhase>(
        K,
        'phase',
        ResistancePhase.Distributing
    );
    const [missionIndex, setMissionIndex] = usePersistedState(K, 'missionIndex', 0);
    const [resistanceScore, setResistanceScore] = usePersistedState(K, 'resistanceScore', 0);
    const [spiesScore, setSpiesScore] = usePersistedState(K, 'spiesScore', 0);
    const [leaderIndex, setLeaderIndex] = usePersistedState(K, 'leaderIndex', 0);
    const [selectedTeam, setSelectedTeam] = usePersistedState<string[]>(K, 'selectedTeam', []);
    const [missionVotes, setMissionVotes] = usePersistedState<boolean[]>(K, 'missionVotes', []);
    const [winner, setWinner] = usePersistedState<'resistance' | 'spies' | null>(
        K,
        'winner',
        null
    );

    useEffect(() => {
        if (phase === ResistancePhase.GameOver && winner) {
            const colors = winner === 'resistance' ? ['#3b82f6', '#ffffff'] : ['#ef4444', '#000000'];
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }

                const particleCount = 50 * (timeLeft / duration);
                void confetti({
                    ...defaults,
                    particleCount,
                    origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2},
                    colors,
                });
                void confetti({
                    ...defaults,
                    particleCount,
                    origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2},
                    colors,
                });
            }, 250);

            return () => {
                clearInterval(interval);
            };
        }
    }, [phase, winner]);

    if (players.length === 0) return null;

    if (phase === ResistancePhase.Distributing) {
        return (
            <ResistanceDistribution
                players={players}
                onFinish={() => {
                    setPhase(ResistancePhase.Proposing);
                }}
            />
        );
    }

    const missionSize = MISSION_SIZES[players.length]?.[missionIndex] ?? 2;
    const currentLeader = players[leaderIndex % players.length];
    const currentVoterId = selectedTeam[missionVotes.length];
    const currentVoter = players.find((p) => p.id === currentVoterId);

    const handleToggle = (id: string) => {
        if (selectedTeam.includes(id)) setSelectedTeam(selectedTeam.filter((pid) => pid !== id));
        else if (selectedTeam.length < missionSize) setSelectedTeam([...selectedTeam, id]);
    };

    const handleMissionVote = (success: boolean) => {
        const nextVotes = [...missionVotes, success];
        setMissionVotes(nextVotes);
        if (nextVotes.length === selectedTeam.length) {
            const failed = nextVotes.includes(false);

            const nextSpiesScore = spiesScore + (failed ? 1 : 0);
            const nextResScore = resistanceScore + (failed ? 0 : 1);
            setSpiesScore(nextSpiesScore);
            setResistanceScore(nextResScore);

            if (nextSpiesScore >= 3 || nextResScore >= 3) {
                setWinner(nextSpiesScore >= 3 ? 'spies' : 'resistance');
                setPhase(ResistancePhase.GameOver);
            } else {
                setPhase(ResistancePhase.MissionResult);
            }
        } else {
            setPhase(ResistancePhase.MissionVoting);
        }
    };

    const nextMission = () => {
        setMissionIndex(missionIndex + 1);
        setLeaderIndex(leaderIndex + 1);
        setSelectedTeam([]);
        setMissionVotes([]);
        setPhase(ResistancePhase.Proposing);
    };

    return (
        <div className="flex flex-col min-h-screen pb-10">
            <GameHeader
                title={GAMES_REGISTRY.resistance.title}
                subtitle={t(`${NS.RESISTANCE}.missionN`, {n: missionIndex + 1})}
                icon={Shield}
                theme="blue"
                onBack={onBack}
            />

            <div className="p-6 flex-1 flex flex-col max-w-sm mx-auto w-full gap-6">
                <div
                    className="flex justify-between p-4 bg-white/5 rounded-premium-lg border border-white/10 shadow-2xl">
                    <div className="text-center group">
                        <p className="text-tag text-premium-blue font-black tracking-widest mb-1">{t(`${NS.RESISTANCE}.resistanceLabel`)}</p>
                        <div className="flex items-center gap-2">
                            {[0, 1, 2].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${i < resistanceScore ? 'bg-premium-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5 border border-white/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="text-center group">
                        <p className="text-tag text-premium-red font-black tracking-widest mb-1">{t(`${NS.RESISTANCE}.spiesLabel`)}</p>
                        <div className="flex items-center gap-2 justify-end">
                            {[0, 1, 2].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${i < spiesScore ? 'bg-premium-red shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/5 border border-white/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {phase === ResistancePhase.Proposing && (
                        <motion.div
                            key="proposing"
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -20}}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-1">
                                <p className="text-tag text-white/80 font-black uppercase tracking-widest">
                                    {t(`${NS.RESISTANCE}.missionLeader`)}
                                </p>
                                <h3 className="text-4xl font-black italic text-white uppercase">
                                    {currentLeader.name}
                                </h3>
                                <p className="text-xs text-premium-blue font-bold uppercase tracking-wider mt-2">
                                    {t(`${NS.RESISTANCE}.selectTeam`, {n: missionSize})}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {players.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            handleToggle(p.id);
                                        }}
                                        className={`p-4 rounded-premium-md border text-left flex items-center transition-all ${selectedTeam.includes(p.id) ? 'bg-premium-blue/10 border-premium-blue/50 shadow-lg shadow-premium-blue/10' : 'bg-white/5 border-white/5 opacity-60'}`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${selectedTeam.includes(p.id) ? 'bg-premium-blue border-premium-blue' : 'border-white/20'}`}
                                        >
                                            {selectedTeam.includes(p.id) && (
                                                <CheckCircle2 className="w-3 h-3 text-white"/>
                                            )}
                                        </div>
                                        <span
                                            className={`font-black italic uppercase tracking-tight text-lg ${selectedTeam.includes(p.id) ? 'text-white' : 'text-white/30'}`}
                                        >
                      {p.name}
                    </span>
                                    </button>
                                ))}
                            </div>

                            <PrimaryButton
                                disabled={selectedTeam.length !== missionSize}
                                onClick={() => {
                                    setPhase(ResistancePhase.PassingPhone);
                                }}
                                className="bg-white !text-black"
                                icon={ArrowRight}
                            >
                                {t(`${NS.RESISTANCE}.startMission`)}
                            </PrimaryButton>
                        </motion.div>
                    )}

                    {phase === ResistancePhase.PassingPhone && (
                        <motion.div
                            key={`pass-${missionVotes.length}`}
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            className="flex-1 flex flex-col items-center justify-center"
                        >
                            <PassPhoneCard
                                playerName={currentVoter?.name ?? ''}
                                badge={t(`${NS.RESISTANCE}.votingBadge`)}
                                badgeColor="sky"
                                instruction={t(`${NS.RESISTANCE}.tapToVote`)}
                                icon={Fingerprint}
                                accentColor="sky"
                                onClick={() => {
                                    setPhase(ResistancePhase.MissionVoting);
                                }}
                            />
                        </motion.div>
                    )}

                    {phase === ResistancePhase.MissionVoting && (
                        <motion.div
                            key="voting"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            className="space-y-8 flex-1 flex flex-col items-center justify-center"
                        >
                            <div className="text-center">
                                <p className="text-tag text-premium-blue font-black uppercase tracking-widest mb-2">
                                    {t(`${NS.RESISTANCE}.votingBadge`)}
                                </p>
                                <h4 className="text-4xl font-black italic text-white uppercase">
                                    {currentVoter?.name}
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 gap-4 w-full">
                                <button
                                    onClick={() => {
                                        handleMissionVote(true);
                                    }}
                                    className="group p-8 bg-premium-green/10 border-2 border-premium-green/30 rounded-premium-3xl flex flex-col items-center gap-4 active:scale-95 transition-all"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-premium-green"/>
                                    <span
                                        className="text-xl font-black italic text-premium-green uppercase tracking-widest">
                    {t(`${NS.RESISTANCE}.success`)}
                  </span>
                                </button>
                                <button
                                    onClick={() => {
                                        handleMissionVote(false);
                                    }}
                                    className="group p-8 bg-premium-red/10 border-2 border-premium-red/30 rounded-premium-3xl flex flex-col items-center gap-4 active:scale-95 transition-all"
                                >
                                    <XCircle className="w-12 h-12 text-premium-red"/>
                                    <span
                                        className="text-xl font-black italic text-premium-red uppercase tracking-widest">
                    {t(`${NS.RESISTANCE}.fail`)}
                  </span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {phase === ResistancePhase.MissionResult && (
                        <motion.div
                            key="result"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            className="space-y-8 text-center flex-1 flex flex-col items-center justify-center"
                        >
                            <div
                                className={`p-12 rounded-premium-3xl w-full border-2 ${missionVotes.includes(false) ? 'bg-premium-red/10 border-premium-red/40' : 'bg-premium-green/10 border-premium-green/40'}`}
                            >
                                <div className="mb-4 flex justify-center">
                                    {missionVotes.includes(false) ? (
                                        <Skull className="w-16 h-16 text-premium-red"/>
                                    ) : (
                                        <Activity className="w-16 h-16 text-premium-green"/>
                                    )}
                                </div>
                                <h3
                                    className={`text-5xl font-black italic uppercase leading-none ${missionVotes.includes(false) ? 'text-premium-red' : 'text-premium-green'}`}
                                >
                                    {t(`${NS.RESISTANCE}.missionTitle`)}
                                    <br/>
                                    {missionVotes.includes(false)
                                        ? t(`${NS.RESISTANCE}.missionFailed`)
                                        : t(`${NS.RESISTANCE}.missionSucceeded`)}
                                </h3>
                            </div>
                            <PrimaryButton onClick={nextMission} variant="outline" icon={ArrowRight}>
                                {t(`${NS.COMMON}.next`)}
                            </PrimaryButton>
                        </motion.div>
                    )}

                    {phase === ResistancePhase.GameOver && (
                        <motion.div
                            key="over"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            className="space-y-12 text-center flex-1 flex flex-col items-center justify-center"
                        >
                            <div
                                className={`p-12 rounded-premium-3xl w-full border-4 ${winner === 'resistance' ? 'bg-premium-blue/10 border-premium-blue/60 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'bg-premium-red/10 border-premium-red/60 shadow-[0_0_50px_rgba(239,68,68,0.3)]'}`}
                            >
                                <h2 className="text-tag font-black uppercase tracking-[0.5em] mb-4 opacity-60">
                                    {t(`${NS.RESISTANCE}.finalScore`)}
                                </h2>
                                <h3
                                    className={`text-6xl font-black italic uppercase leading-none ${winner === 'resistance' ? 'text-premium-blue' : 'text-premium-red'}`}
                                >
                                    {winner === 'resistance'
                                        ? t(`${NS.RESISTANCE}.resistanceLabel`)
                                        : t(`${NS.RESISTANCE}.spiesLabel`)}
                                    <br/>
                                    {t(`${NS.RESISTANCE}.won`)}
                                </h3>
                            </div>

                            <div className="w-full space-y-3">
                                <p className="text-tag font-black text-white/20 uppercase tracking-widest">
                                    {t(`${NS.RESISTANCE}.spyAgents`)}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {players
                                        .filter((p) => p.isSpy)
                                        .map((p) => (
                                            <div
                                                key={p.id}
                                                className="p-3 bg-premium-red/10 border border-premium-red/30 rounded-premium-sm font-bold italic uppercase text-premium-red"
                                            >
                                                {p.name}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <PrimaryButton onClick={onBack} icon={RotateCcw} variant="blue">
                                {t(`${NS.RESISTANCE}.restart`)}
                            </PrimaryButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
