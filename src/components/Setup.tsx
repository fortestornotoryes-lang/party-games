import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { UserPlus, UserMinus, Play, HelpCircle, X, ChevronRight, ArrowLeft, LucideIcon, GripVertical, Shuffle, Users } from 'lucide-react';
import { SectionLabel, Badge, IconButton, TextInput, PrimaryButton,PageWrapper ,Typography, ParallaxBackground } from './UI';
import { InstructionsModal } from './InstructionsModal';
import { storageService } from '../services/storageService';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { GameTheme } from '../types';

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
    minPlayers?: number;
    maxPlayers?: number;
    children?: React.ReactNode;
}

const colorConfig: Record<GameTheme, {
    bg: string;
    border: string;
    text: string;
    button: string;
    shadow: string;
    gradient: string;
    focus: string;
    addHover: string;
    closeHover: string;
    indexBg: string;
}> = {
    red: {
        bg: 'bg-premium-red/10',
        border: 'border-premium-red/30',
        text: 'text-premium-red',
        button: 'bg-premium-red hover:bg-[#ff4d6a] active:scale-95 shadow-[0_20px_50px_rgba(255,46,77,0.3)]',
        shadow: 'shadow-premium-red/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,46,77,0.15),transparent_70%)]',
        focus: 'focus:border-premium-red/50',
        addHover: 'hover:bg-premium-red/5 hover:text-white/80 hover:border-premium-red/20',
        closeHover: 'hover:bg-premium-red/10 hover:text-premium-red',
        indexBg: 'bg-premium-red/20 text-premium-red border-premium-red/30',
    },
    emerald: {
        bg: 'bg-premium-green/10',
        border: 'border-premium-green/30',
        text: 'text-premium-green',
        button: 'bg-premium-green hover:bg-[#1ae599] active:scale-95 shadow-[0_20px_50px_rgba(0,216,138,0.3)]',
        shadow: 'shadow-premium-green/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,rgba(0,216,138,0.15),transparent_70%)]',
        focus: 'focus:border-premium-green/50',
        addHover: 'hover:bg-premium-green/5 hover:text-white/80 hover:border-premium-green/20',
        closeHover: 'hover:bg-premium-green/10 hover:text-premium-green',
        indexBg: 'bg-premium-green/20 text-premium-green border-premium-green/30',
    },
    sky: {
        bg: 'bg-premium-sky/10',
        border: 'border-premium-sky/30',
        text: 'text-premium-sky',
        button: 'bg-premium-sky hover:bg-[#3ac1ff] active:scale-95 shadow-[0_20px_50px_rgba(31,182,255,0.3)]',
        shadow: 'shadow-premium-sky/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,rgba(31,182,255,0.15),transparent_70%)]',
        focus: 'focus:border-premium-sky/50',
        addHover: 'hover:bg-premium-sky/5 hover:text-white/80 hover:border-premium-sky/20',
        closeHover: 'hover:bg-premium-sky/10 hover:text-premium-sky',
        indexBg: 'bg-premium-sky/20 text-premium-sky border-premium-sky/30',
    },
    orange: {
        bg: 'bg-premium-orange/10',
        border: 'border-premium-orange/30',
        text: 'text-premium-orange',
        button: 'bg-premium-orange hover:bg-[#ffa14d] active:scale-95 shadow-[0_20px_50px_rgba(255,138,31,0.3)]',
        shadow: 'shadow-premium-orange/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,138,31,0.15),transparent_70%)]',
        focus: 'focus:border-premium-orange/50',
        addHover: 'hover:bg-premium-orange/5 hover:text-white/80 hover:border-premium-orange/20',
        closeHover: 'hover:bg-premium-orange/10 hover:text-premium-orange',
        indexBg: 'bg-premium-orange/20 text-premium-orange border-premium-orange/30',
    },
    purple: {
        bg: 'bg-premium-purple/10',
        border: 'border-premium-purple/30',
        text: 'text-premium-purple',
        button: 'bg-premium-purple hover:bg-[#d499ff] active:scale-95 shadow-[0_20px_50px_rgba(199,123,255,0.3)]',
        shadow: 'shadow-premium-purple/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,rgba(199,123,255,0.15),transparent_70%)]',
        focus: 'focus:border-premium-purple/50',
        addHover: 'hover:bg-premium-purple/5 hover:text-white/80 hover:border-premium-purple/20',
        closeHover: 'hover:bg-premium-purple/10 hover:text-premium-purple',
        indexBg: 'bg-premium-purple/20 text-premium-purple border-premium-purple/30',
    },
    yellow: {
        bg: 'bg-premium-yellow/10',
        border: 'border-premium-yellow/30',
        text: 'text-premium-yellow',
        button: 'bg-premium-yellow hover:bg-[#ffd14d] active:scale-95 shadow-[0_20px_50px_rgba(255,216,77,0.3)]',
        shadow: 'shadow-premium-yellow/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,216,77,0.15),transparent_70%)]',
        focus: 'focus:border-premium-yellow/50',
        addHover: 'hover:bg-premium-yellow/5 hover:text-white/80 hover:border-premium-yellow/20',
        closeHover: 'hover:bg-premium-yellow/10 hover:text-premium-yellow',
        indexBg: 'bg-premium-yellow/20 text-premium-yellow border-premium-yellow/30',
    },
    blue: {
        bg: 'bg-premium-blue/10',
        border: 'border-premium-blue/30',
        text: 'text-premium-blue',
        button: 'bg-premium-blue hover:bg-[#6699ff] active:scale-95 shadow-[0_20px_50px_rgba(63,123,255,0.3)]',
        shadow: 'shadow-premium-blue/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,rgba(63,123,255,0.15),transparent_70%)]',
        focus: 'focus:border-premium-blue/50',
        addHover: 'hover:bg-premium-blue/5 hover:text-white/80 hover:border-premium-blue/20',
        closeHover: 'hover:bg-premium-blue/10 hover:text-premium-blue',
        indexBg: 'bg-premium-blue/20 text-premium-blue border-premium-blue/30',
    },
};

interface PlayerEntry {
    id: string;
    name: string;
}

let _idCounter = 0;
const makeId = () => `p-${++_idCounter}-${Math.random().toString(36).slice(2, 6)}`;

const DEFAULT_NAMES = ['Дуня', 'Валера', 'Булочка', 'Люба', 'Саша'];

type Config = (typeof colorConfig)[keyof typeof colorConfig];

interface PlayerRowProps {
    player: PlayerEntry;
    index: number;
    canRemove: boolean;
    config: Config;
    placeholder: string;
    onRemove: (id: string) => void;
    onChange: (id: string, name: string) => void;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, index, canRemove, config, placeholder, onRemove, onChange }) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={player}
            dragListener={false}
            dragControls={dragControls}
            layout="position"
            className="flex items-center gap-4 list-none group"
            whileDrag={{ scale: 1.02, zIndex: 50, rotate: -1 }}
        >
            <div 
                onPointerDown={e => dragControls.start(e)} 
                className="w-5 h-9 shrink-0 flex items-center justify-center text-white/10 hover:text-white/80 cursor-grab active:cursor-grabbing touch-none select-none"
            >
                <GripVertical className="w-5 h-5" />
            </div>
            
            <div className={`w-9 h-9 shrink-0 rounded-premium-sm border flex items-center justify-center text-xs font-black italic select-none shadow-xl ${config.indexBg}`}>
                {index + 1}
            </div>

            <div className="flex-1 relative">
                <TextInput
                    value={player.name}
                    onChange={e => onChange(player.id, e.target.value)}
                    autoComplete="off"
                    className={`h-9 px-6 glass-card rounded-premium-md w-full text-base font-semibold placeholder:text-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-white/20 ${config.focus}`}
                    placeholder={`${placeholder} ${index + 1}`}
                />
            </div>

            <button 
                onClick={() => onRemove(player.id)} 
                disabled={!canRemove}
                className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-premium-md glass-card text-white/20 hover:text-premium-red hover:bg-premium-red/5 hover:border-premium-red/30 active:scale-90 transition-all ${!canRemove ? 'opacity-0 pointer-events-none' : ''}`}
            >
                <UserMinus className="w-5 h-5" />
            </button>
        </Reorder.Item>
    );
};

export const Setup: React.FC<SetupProps> = ({ onStart, onBack, title, subtitle, icon: Icon, themeColor, playerPlaceholder, addPlayerLabel, instructions, description, minPlayers = 3, maxPlayers = 8, children }) => {
    const { difficulty } = useGameSettings();
    const config = colorConfig[themeColor] || colorConfig.red;
    const [players, setPlayers] = useState<PlayerEntry[]>(() => {
        const savedNames = storageService.getPlayers();
        if (savedNames.length >= minPlayers) {
            return savedNames.slice(0, maxPlayers).map(name => ({ id: makeId(), name }));
        }
        const shuffled = [...DEFAULT_NAMES].sort(() => Math.random() - 0.5);
        return Array.from({ length: minPlayers }, (_, i) => ({ id: makeId(), name: shuffled[i] ?? `${playerPlaceholder} ${i + 1}` }));
    });
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const names = players.map(p => p.name);
        if (names.some(n => n.trim() !== '')) {
            storageService.savePlayers(names);
        }
    }, [players]);

    const addPlayer = () => { if (players.length < maxPlayers) setPlayers(prev => [...prev, { id: makeId(), name: `${playerPlaceholder} ${prev.length + 1}` }]); };
    const removePlayer = (id: string) => { if (players.length > minPlayers) setPlayers(prev => prev.filter(p => p.id !== id)); };
    const handleNameChange = (id: string, name: string) => { setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p)); };
    const shufflePlayers = () => { setPlayers(prev => [...prev].sort(() => Math.random() - 0.5)); };

    const isReady = players.every(p => p.name.trim() !== '');
    const canRemove = players.length > minPlayers;
    const titleWords = title.split(' ');

    return (
        <div className="min-h-screen pt-6 pb-32 px-6 relative flex flex-col items-center">
            {/* Ambient Background Gradient */}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
                {/* Header Section */}
                <div className="relative mb-12">
                    <div className="flex items-center justify-between mb-10">
                        <button 
                            onClick={onBack}
                            className="w-12 h-12 z-50 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-all border-none"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className={`w-12 h-12 rounded-[20px] glass-card flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-white/10`}>
                            <div className={`absolute inset-0 rounded-[20px] blur-xl opacity-20 ${config.bg}`} />
                            <Icon className={`w-7 h-7 ${config.text} relative z-10`} />
                        </div>
                    </div>

                    <div className="px-1">
                        <h2 className="text-[42px] font-black italic uppercase tracking-tighter leading-[0.75] mb-8">
                            {titleWords.length > 1 ? (
                                <>
                                    {titleWords.slice(0, -1).join(' ')} <br />
                                    <span className={`${config.text} drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>{titleWords.at(-1)}</span>
                                </>
                            ) : (
                                <span className={config.text}>{title}</span>
                            )}
                        </h2>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-3 rounded-full ${config.text} bg-current`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 italic">
                                    {subtitle}
                                </span>
                            </div>
                            <div className={`px-4 py-1.5 rounded-premium-sm glass-card border-none text-[10px] font-black italic uppercase tracking-[0.2em] font-display ${difficulty === 'easy' ? 'text-premium-green' : difficulty === 'medium' ? 'text-premium-sky' : 'text-premium-red'}`}>
                                {difficulty === 'easy' ? 'ЛЕГКО' : difficulty === 'medium' ? 'НОРМА' : 'ПРОФИ'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participants Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-3">
                             <Users className={`w-4 h-4 ${config.text}`} />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">УЧАСТНИКИ</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={shufflePlayers} className="text-white/20 hover:text-white/50 active:scale-90 transition-all">
                                <Shuffle className="w-5 h-5" />
                            </button>
                            <div className={`px-4 py-1 rounded-premium-sm border border-white/5 bg-white/3 text-[11px] font-black italic text-white/80 tracking-tighter`}>
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
                            className={`w-full mt-4 h-12 border-2 border-dashed border-white/25 rounded-premium-lg flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/50 transition-all ${config.addHover} hover:border-dashed`}
                        >
                            <UserPlus className="w-5 h-5" />
                            <span>Добавить</span>
                        </button>
                    )}
                </div>

                {children && <div className="mt-12">{children}</div>}
            </motion.div>

            {/* Footer Buttons */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-6 pb-10 bg-linear-to-t from-[#0B0915] via-[#0B0915]/95 to-transparent pt-12">
                <div className="grid grid-cols-[1fr_2fr] gap-5 max-w-md mx-auto">
                    <button 
                        onClick={() => setShowInstructions(true)} 
                        className="h-16 glass-card rounded-premium-md flex items-center justify-center gap-3 text-white/80 active:scale-95 transition-all group border-white/5"
                    >
                        <HelpCircle className="w-7 h-7 transition-colors group-hover:text-white/60" />
                    </button>
                    
                    <button 
                        disabled={!isReady} 
                        onClick={() => onStart(players.map(p => p.name))} 
                        className={`h-16 ${config.button} text-white rounded-premium-md flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30 relative overflow-hidden group border-none`}
                    >
                        <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Play className="w-6 h-6 fill-current relative z-10" />
                        <span className="text-2xl font-black uppercase tracking-tighter italic relative z-10 leading-none">СТАРТ</span>
                    </button>
                </div>
            </div>

            <InstructionsModal 
                open={showInstructions} 
                onClose={() => setShowInstructions(false)} 
                title={title} 
                instructions={instructions}
                description={description}
                theme={themeColor}
            />
        </div>
    );
};