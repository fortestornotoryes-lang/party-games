import type {LucideIcon} from 'lucide-react';
import {ArrowLeft, HelpCircle, Play, Shuffle, UserPlus, Users,} from 'lucide-react';
import {motion, Reorder} from 'motion/react';
import React, {useEffect, useState} from 'react';

import {useGameSettings} from '../contexts/GameSettingsContext';
import {storageService} from '../services/storageService';
import {getTheme} from '../theme/colors';
import {DIFFICULTY, type GameTheme} from '../types';
import {shuffle} from '../utils/random';

import {InstructionsModal} from './InstructionsModal';
import { Typography } from "./Typography";

import {DEFAULT_NAMES, PlayerRow} from "@/components/PlayerRow.tsx";
import {PrimaryButton} from "@/components/PrimaryButton.tsx";

interface SetupProps {
    onStart: (playerNames: string[]) => void;
    onBack: () => void;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    themeColor: GameTheme;
    playerPlaceholder: string;
    addPlayerLabel: string;
    instructions: { title: string; content: string }[];
    description?: string;
    minPlayers: number;
    maxPlayers?: number;
    children?: React.ReactNode;
}

export interface PlayerEntry {
    id: string;
    name: string;
}

let _idCounter = 0;
const makeId = () => `p-${++_idCounter}-${Math.random().toString(36).slice(2, 6)}`;

export const Setup: React.FC<SetupProps> = ({
                                                onStart,
                                                onBack,
                                                title,
                                                subtitle,
                                                themeColor,
                                                playerPlaceholder,
                                                instructions,
                                                description,
                                                minPlayers,
                                                maxPlayers = 12,
                                                children,
                                            }) => {
    const {difficulty} = useGameSettings();
    const config = getTheme(themeColor);
    // TODO: RN — replace with useEffect async load (useState lazy initializer incompatible with async)
    const [players, setPlayers] = useState<PlayerEntry[]>(() => {
        const savedNames = storageService.getPlayers();
        if (savedNames.length >= minPlayers) {
            return savedNames.slice(0, maxPlayers).map((name) => ({id: makeId(), name}));
        }
        const shuffled = shuffle(DEFAULT_NAMES);
        return Array.from({length: minPlayers}, (_, i) => ({
            id: makeId(),
            name: shuffled[i] ?? `${playerPlaceholder} ${i + 1}`,
        }));
    });
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const names = players.map((p) => p.name);
        if (names.some((n) => n.trim() !== '')) {
            storageService.savePlayers(names);
        }
    }, [players]);

    const addPlayer = () => {
        if (players.length < maxPlayers)
            setPlayers((prev) => [
                ...prev,
                {
                    id: makeId(),
                    name: `${playerPlaceholder} ${prev.length + 1}`,
                },
            ]);
    };
    const removePlayer = (id: string) => {
        if (players.length > minPlayers) setPlayers((prev) => prev.filter((p) => p.id !== id));
    };
    const handleNameChange = (id: string, name: string) => {
        setPlayers((prev) => prev.map((p) => (p.id === id ? {...p, name} : p)));
    };
    const shufflePlayers = () => {
        setPlayers((prev) => shuffle(prev));
    };

    const isReady = players.every((p) => p.name.trim() !== '');
    const canRemove = players.length > minPlayers;
    const titleWords = title.split(' ');

    return (
        <div className="min-h-screen pt-6 pb-24 px-6 relative flex flex-col items-center">
            {/* Ambient Background Gradient */}

            <motion.div
                initial={{opacity: 0, y: 16}}
                animate={{opacity: 1, y: 0}}
                className="w-full max-w-md relative z-10"
            >
                {/* Header Section */}
                <div className="relative mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={onBack}
                            className="w-12 h-12 z-50 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-all border-none"
                        >
                            <ArrowLeft className="w-6 h-6"/>
                        </button>
                        <Typography.Title className="tracking-tighter leading-[0.75] text-center">
                            {titleWords.length > 1 ? (
                                <>
                                    {titleWords.slice(0, -1).join(' ')} <br/>
                                    <span className={`${config.text} drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                    {titleWords.at(-1)}
                  </span>
                                </>
                            ) : (
                                <span className={config.text}>{title}</span>
                            )}
                        </Typography.Title>
                    </div>

                    <div className="px-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-3 rounded-full ${config.text} bg-current`}/>
                                <span className="text-tag font-black uppercase tracking-[0.4em] text-white/80 italic">
                  {subtitle}
                </span>
                            </div>
                            <div
                                className={`px-4 py-1.5 rounded-premium-sm glass-card border-none text-tag font-black italic uppercase tracking-[0.2em] font-display ${difficulty === DIFFICULTY.EASY ? 'text-premium-green' : difficulty === DIFFICULTY.MEDIUM ? 'text-premium-sky' : 'text-premium-red'}`}
                            >
                                {difficulty === DIFFICULTY.EASY ? 'ЛЕГКО' : difficulty === DIFFICULTY.MEDIUM ? 'НОРМА' : 'ПРОФИ'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participants Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-3">
                            <Users className={`w-4 h-4 ${config.text}`}/>
                            <span className="text-tag font-black uppercase tracking-[0.4em] text-white/80">
                УЧАСТНИКИ
              </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={shufflePlayers}
                                className="text-white/20 hover:text-white/50 active:scale-90 transition-all"
                            >
                                <Shuffle className="w-5 h-5"/>
                            </button>
                            <div
                                className={`px-4 py-1 rounded-premium-sm border border-white/5 bg-white/3 text-label font-black italic text-white/80 tracking-tighter`}
                            >
                                {players.length} / {maxPlayers}
                            </div>
                        </div>
                    </div>

                    <Reorder.Group values={players} onReorder={setPlayers} className="flex flex-col gap-4">
                        {players.map((p, i) => (
                            <PlayerRow
                                key={p.id}
                                player={p}
                                index={i}
                                canRemove={canRemove}
                                config={config}
                                placeholder={playerPlaceholder}
                                onRemove={removePlayer}
                                onChange={handleNameChange}
                            />
                        ))}
                    </Reorder.Group>

                    {players.length < maxPlayers && (
                        <button
                            onClick={addPlayer}
                            className={`w-full mt-4 h-12 border-2 border-dashed border-white/25 rounded-premium-lg flex items-center justify-center gap-4 text-label font-black uppercase tracking-[0.4em] text-white/50 transition-all ${config.addHover} hover:border-dashed`}
                        >
                            <UserPlus className="w-5 h-5"/>
                            <span>Добавить</span>
                        </button>
                    )}
                </div>

                {!!children && <div className="mt-12">{children}</div>}
            </motion.div>

            {/* Footer Buttons */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 p-6  bg-linear-to-t from-[#0B0915] via-[#0B0915]/95 to-transparent">
                <div className="grid grid-cols-[1fr_2fr] gap-5 max-w-md mx-auto">
                    <button
                        onClick={() => {
                            setShowInstructions(true);
                        }}
                        className="h-16 glass-card rounded-premium-md flex items-center justify-center gap-3 text-white/80 active:scale-95 transition-all group border-white/5"
                    >
                        <HelpCircle className="w-7 h-7 transition-colors group-hover:text-white/60"/>
                    </button>

                    <PrimaryButton
                        disabled={!isReady}
                        iconElement={<Play className="w-6 h-6 fill-current relative z-10"/>}
                        onClick={() => {
                            onStart(players.map((p) => p.name));
                        }}
                        className={`h-16 ${config.button} text-white rounded-premium-md flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30 relative overflow-hidden group border-none`}
                    >
            <span className="text-2xl font-black uppercase tracking-tighter italic relative z-10 leading-none">
              СТАРТ
            </span>
                    </PrimaryButton>
                </div>
            </div>

            <InstructionsModal
                open={showInstructions}
                onClose={() => {
                    setShowInstructions(false);
                }}
                title={title}
                instructions={instructions}
                description={description}
                theme={themeColor}
            />
        </div>
    );
};
