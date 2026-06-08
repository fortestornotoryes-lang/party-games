import {AlertTriangle, Cpu, RotateCcw, Skull, Trophy, Zap} from 'lucide-react';
import {motion} from 'motion/react';
import React, {useEffect, useRef, useState} from 'react';

import type {BunkerCharacter, BunkerResources, CatastropheScenario, SurvivalEvent, SurvivalOutcome} from '../types';

import {PrimaryButton} from '@/components/PrimaryButton.tsx';
import {Typography} from '@/components/Typography';
import {getPlayerResourceContribution} from '@/constants/bunkerContent';
import {useTranslation} from '@/i18n';
import {NS} from '@/i18n/keys';
import {feedbackService, VIBRATE} from '@/services/feedbackService';

interface SurvivalPhaseProps {
    bunkerTeam: BunkerCharacter[];
    eliminated: BunkerCharacter[];
    scenario: CatastropheScenario;
    events: SurvivalEvent[];
    finalResources: BunkerResources;
    outcome: SurvivalOutcome;
    onRestart: () => void;
}

type Step = 'team' | 'events' | 'resources' | 'results';
const STEP_ORDER: Step[] = ['team', 'events', 'resources', 'results'];
const atLeast = (current: Step, min: Step) =>
    STEP_ORDER.indexOf(current) >= STEP_ORDER.indexOf(min);

const RESOURCE_META: {key: keyof BunkerResources; emoji: string}[] = [
    {key: 'food', emoji: '🍎'},
    {key: 'water', emoji: '💧'},
    {key: 'medicine', emoji: '💊'},
    {key: 'energy', emoji: '⚡'},
    {key: 'morale', emoji: '🧠'},
];

function barColor(val: number) {
    if (val >= 60) return '#00D88A';
    if (val >= 35) return '#FFCC1F';
    if (val >= 15) return '#FF8A1F';
    return '#FF2E4D';
}

const OUTCOME_CONFIG: Record<
    SurvivalOutcome,
    {color: string; bgColor: string; borderColor: string; shadow: string; emoji: string; icon: React.FC<{className?: string; style?: React.CSSProperties}>}
> = {
    full_victory: {color: '#00D88A', bgColor: 'rgba(0,216,138,0.1)',  borderColor: 'rgba(0,216,138,0.5)', shadow: '0 0 80px rgba(0,216,138,0.3)',  emoji: '🏆', icon: Trophy},
    partial:      {color: '#FFCC1F', bgColor: 'rgba(255,204,31,0.1)', borderColor: 'rgba(255,204,31,0.4)', shadow: '0 0 60px rgba(255,204,31,0.2)', emoji: '⚠️', icon: AlertTriangle},
    pyrrhic:      {color: '#FF8A1F', bgColor: 'rgba(255,138,31,0.1)', borderColor: 'rgba(255,138,31,0.4)', shadow: '0 0 60px rgba(255,138,31,0.2)', emoji: '💀', icon: Zap},
    defeat:       {color: '#FF2E4D', bgColor: 'rgba(255,46,77,0.1)',  borderColor: 'rgba(255,46,77,0.45)', shadow: '0 0 80px rgba(255,46,77,0.3)',  emoji: '☠️', icon: Skull},
};

const OUTCOME_COLOR_MAP: Record<SurvivalOutcome, 'green' | 'yellow' | 'orange' | 'red'> = {
    full_victory: 'green', partial: 'yellow', pyrrhic: 'orange', defeat: 'red',
};

function ResourceContribRow({char}: {char: BunkerCharacter}) {
    const contrib = getPlayerResourceContribution(char);
    const nonZero = RESOURCE_META.filter(({key}) => contrib[key] !== 0);
    if (nonZero.length === 0) return null;
    return (
        <div className="flex gap-3 mt-2 flex-wrap">
            {nonZero.map(({key, emoji}) => {
                const val = contrib[key];
                return (
                    <span key={key} className="text-xs font-black tabular-nums" style={{color: val > 0 ? '#00D88A' : '#FF2E4D'}}>
                        {emoji}{val > 0 ? '+' : ''}{val}
                    </span>
                );
            })}
        </div>
    );
}

export const SurvivalPhase: React.FC<SurvivalPhaseProps> = ({
    bunkerTeam,
    eliminated,
    scenario,
    events,
    finalResources,
    outcome,
    onRestart,
}) => {
    const {t} = useTranslation();
    const [step, setStep] = useState<Step>('team');
    const [displayedResources, setDisplayedResources] = useState<BunkerResources>(
        {food: 100, water: 100, medicine: 100, energy: 100, morale: 100}
    );
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t1 = setTimeout(() => { setStep('events'); },    1800);
        const t2 = setTimeout(() => { setStep('resources'); }, 3500);
        const t3 = setTimeout(() => {
            setDisplayedResources(finalResources);
            feedbackService.vibrate(VIBRATE.celebrate);
        }, 4000);
        const t4 = setTimeout(() => {
            setStep('results');
        }, 5800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [finalResources]);

    // Scroll results block into view when it appears
    useEffect(() => {
        if (step === 'results' && resultsRef.current) {
            setTimeout(() => resultsRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}), 80);
        }
    }, [step]);

    useEffect(() => {
        if (step === 'results') {
            if (outcome === 'full_victory') feedbackService.vibrate(VIBRATE.celebrate);
            else if (outcome === 'defeat')  feedbackService.vibrate(VIBRATE.error);
        }
    }, [step, outcome]);

    const cfg = OUTCOME_CONFIG[outcome];
    const OutcomeIcon = cfg.icon;
    const eliminatedBaseDelay = 0.4 + bunkerTeam.length * 0.07 + 0.15;

    return (
        <motion.div
            key="survival"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="flex flex-col px-5 py-6 gap-5"
        >
            {/* Header */}
            <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                    <Cpu className="w-4 h-4 text-premium-sky animate-pulse"/>
                    <Typography.Label size="sm" color="sky">
                        {t(`${NS.BUNKER}.survivalLabel`)}
                    </Typography.Label>
                </div>
                <Typography.Caption color="faint">
                    {scenario.emoji} {scenario.title}
                </Typography.Caption>
            </div>

            {/* Team composition */}
            <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-2">
                <Typography.Label size="xs" color="muted">
                    {t(`${NS.BUNKER}.teamInBunker`)}
                </Typography.Label>
                <div className="flex flex-wrap gap-1.5">
                    {bunkerTeam.map((c, i) => (
                        <motion.div
                            key={c.playerName}
                            initial={{scale: 0, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{delay: i * 0.12, type: 'spring'}}
                            className="px-3 py-1.5 rounded-premium-sm text-xs font-bold"
                            style={{background: 'rgba(0,216,138,0.1)', border: '1px solid rgba(0,216,138,0.3)', color: '#00D88A'}}
                        >
                            {c.profession.emoji} {c.playerName}
                        </motion.div>
                    ))}
                    {eliminated.map((c, i) => (
                        <motion.div
                            key={c.playerName}
                            initial={{scale: 0, opacity: 0}}
                            animate={{scale: 1, opacity: 0.35}}
                            transition={{delay: (bunkerTeam.length + i) * 0.12}}
                            className="px-3 py-1.5 rounded-premium-sm text-xs font-bold line-through"
                            style={{background: 'rgba(255,46,77,0.08)', border: '1px solid rgba(255,46,77,0.2)', color: '#FF2E4D'}}
                        >
                            {c.playerName}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Events */}
            {atLeast(step, 'events') && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-2">
                    <Typography.Label size="xs" color="muted">
                        {t(`${NS.BUNKER}.eventsInBunker`)}
                    </Typography.Label>
                    <div className="space-y-1.5">
                        {events.map((ev, i) => (
                            <motion.div
                                key={ev.title}
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: i * 0.25}}
                                className="flex items-center gap-3 p-2.5 rounded-premium-sm"
                                style={{
                                    background: ev.positive ? 'rgba(0,216,138,0.07)' : 'rgba(255,138,31,0.07)',
                                    border: `1px solid ${ev.positive ? 'rgba(0,216,138,0.2)' : 'rgba(255,138,31,0.2)'}`,
                                }}
                            >
                                <span className="text-lg flex-shrink-0">{ev.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white/80 leading-tight">{ev.title}</div>
                                    <div className="text-tag text-white/40 leading-tight mt-0.5">{ev.description}</div>
                                </div>
                                <div className="text-tag font-black flex-shrink-0" style={{color: ev.positive ? '#00D88A' : '#FF8A1F'}}>
                                    {Object.entries(ev.effect).map(([k, v]) => `${k}:${v > 0 ? '+' : ''}${v}`).join(' ')}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Resource bars */}
            {atLeast(step, 'resources') && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-2">
                    <Typography.Label size="xs" color="muted">
                        {t(`${NS.BUNKER}.resourcesLabel`)}
                    </Typography.Label>
                    <div className="space-y-2">
                        {RESOURCE_META.map(({key, emoji}) => {
                            const val = displayedResources[key];
                            const color = barColor(val);
                            return (
                                <div key={key} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm">{emoji}</span>
                                            <span className="text-tag text-white/50 font-black uppercase tracking-wider">
                                                {t(`${NS.BUNKER}.resources.${key}`)}
                                            </span>
                                        </div>
                                        <motion.span key={val} initial={{scale: 1.2}} animate={{scale: 1}} className="text-sm font-black tabular-nums" style={{color}}>
                                            {val}%
                                        </motion.span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            initial={{width: '100%'}}
                                            animate={{width: `${val}%`}}
                                            transition={{duration: 0.8, ease: 'easeOut'}}
                                            style={{background: color}}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* ── Results (merged) ──────────────────────────────────────────── */}
            {step === 'results' && (
                <div ref={resultsRef} className="flex flex-col gap-5 pt-2">
                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/8"/>
                        <span className="text-tag text-white/20 font-black uppercase tracking-widest">итоги</span>
                        <div className="flex-1 h-px bg-white/8"/>
                    </div>

                    {/* Outcome card */}
                    <motion.div
                        initial={{scale: 0.85, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{type: 'spring', stiffness: 240, damping: 22}}
                        className="rounded-premium-md p-7 text-center space-y-3"
                        style={{background: cfg.bgColor, border: `2px solid ${cfg.borderColor}`, boxShadow: `${cfg.shadow}, 0 24px 64px rgba(0,0,0,0.5)`}}
                    >
                        <OutcomeIcon className="w-8 h-8 mx-auto" style={{color: cfg.color}}/>
                        <Typography.Display size="md" glow align="center" color={OUTCOME_COLOR_MAP[outcome]}>
                            {t(`${NS.BUNKER}.outcomes.${outcome}.title`)}
                        </Typography.Display>
                        <Typography.Body size="sm" color="body" align="center">
                            {t(`${NS.BUNKER}.outcomes.${outcome}.subtitle`)}
                        </Typography.Body>
                    </motion.div>

                    {/* Survivors */}
                    <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="space-y-2">
                        <Typography.Label size="xs" color="muted">
                            {t(`${NS.BUNKER}.survivorsLabel`)}
                        </Typography.Label>
                        <div className="space-y-1.5">
                            {bunkerTeam.map((char, idx) => (
                                <motion.div
                                    key={char.playerName}
                                    initial={{opacity: 0, x: -16}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.3 + idx * 0.07, type: 'spring', stiffness: 280, damping: 26}}
                                    className="p-3 rounded-premium-sm"
                                    style={{background: 'rgba(0,216,138,0.06)', border: '1px solid rgba(0,216,138,0.2)'}}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{char.profession.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-black text-white">{char.playerName}</div>
                                            <div className="text-tag text-white/40">
                                                {char.profession.name} · {char.age} л · {char.gender}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 flex-wrap justify-end">
                                            {[char.health, char.hobby, char.trait].map(
                                                (a, i) => a.isPositive && <span key={i} className="text-sm" title={a.name}>{a.emoji}</span>
                                            )}
                                        </div>
                                    </div>
                                    <ResourceContribRow char={char}/>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Eliminated */}
                    {eliminated.length > 0 && (
                        <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{delay: eliminatedBaseDelay}} className="space-y-2">
                            <Typography.Label size="xs" color="muted">
                                {t(`${NS.BUNKER}.outsidersLabel`)}
                            </Typography.Label>
                            <div className="space-y-1.5">
                                {eliminated.map((char, idx) => (
                                    <motion.div
                                        key={char.playerName}
                                        initial={{opacity: 0, x: -16}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: eliminatedBaseDelay + 0.1 + idx * 0.07, type: 'spring', stiffness: 280, damping: 26}}
                                        className="p-3 rounded-premium-sm"
                                        style={{background: 'rgba(255,46,77,0.05)', border: '1px solid rgba(255,46,77,0.18)'}}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl opacity-50">{char.profession.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-black" style={{color: 'rgba(255,100,120,0.8)'}}>
                                                    {char.playerName}
                                                </div>
                                                <div className="text-tag text-white/30">
                                                    {char.profession.name} · {char.age} л · {char.gender}
                                                </div>
                                            </div>
                                        </div>
                                        <ResourceContribRow char={char}/>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* New game */}
                    <motion.div
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: eliminatedBaseDelay + eliminated.length * 0.07 + 0.15}}
                        className="pb-2"
                    >
                        <PrimaryButton onClick={onRestart} variant="outline" icon={RotateCcw}>
                            {t(`${NS.BUNKER}.newGameBtn`)}
                        </PrimaryButton>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};
