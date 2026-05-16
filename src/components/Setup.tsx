import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { UserPlus, UserMinus, Play, HelpCircle, X, ChevronRight, ArrowLeft, LucideIcon, GripVertical, Shuffle } from 'lucide-react';

interface SetupProps {
    onStart: (playerNames: string[]) => void;
    onBack: () => void;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    themeColor: 'red' | 'emerald' | 'sky' | 'orange' | 'purple';
    playerPlaceholder: string;
    addPlayerLabel: string;
    instructions: { title: string; content: string }[];
    minPlayers?: number;
    maxPlayers?: number;
}

const colorConfig = {
    red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-500',
        button: 'bg-red-600 hover:bg-red-500 active:bg-red-700',
        shadow: 'shadow-red-900/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,#450a0a,transparent_50%)]',
        focus: 'focus:border-red-500/50',
        addHover: 'hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/10',
        closeHover: 'hover:bg-red-500/10 hover:text-red-500',
        indexBg: 'bg-red-500/15 text-red-400',
    },
    emerald: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-500',
        button: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700',
        shadow: 'shadow-emerald-900/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,#064e3b,transparent_50%)]',
        focus: 'focus:border-emerald-500/50',
        addHover: 'hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/10',
        closeHover: 'hover:bg-emerald-500/10 hover:text-emerald-500',
        indexBg: 'bg-emerald-500/15 text-emerald-400',
    },
    sky: {
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/30',
        text: 'text-sky-500',
        button: 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700',
        shadow: 'shadow-sky-900/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,#0c4a6e,transparent_50%)]',
        focus: 'focus:border-sky-500/50',
        addHover: 'hover:border-sky-500/30 hover:text-sky-400 hover:bg-sky-500/10',
        closeHover: 'hover:bg-sky-500/10 hover:text-sky-500',
        indexBg: 'bg-sky-500/15 text-sky-400',
    },
    orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-500',
        button: 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700',
        shadow: 'shadow-orange-900/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,#7c2d12,transparent_50%)]',
        focus: 'focus:border-orange-500/50',
        addHover: 'hover:border-orange-500/30 hover:text-orange-400 hover:bg-orange-500/10',
        closeHover: 'hover:bg-orange-500/10 hover:text-orange-500',
        indexBg: 'bg-orange-500/15 text-orange-400',
    },
    purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-500',
        button: 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700',
        shadow: 'shadow-purple-900/40',
        gradient: 'bg-[radial-gradient(circle_at_50%_0%,#581c87,transparent_50%)]',
        focus: 'focus:border-purple-500/50',
        addHover: 'hover:border-purple-500/30 hover:text-purple-400 hover:bg-purple-500/10',
        closeHover: 'hover:bg-purple-500/10 hover:text-purple-500',
        indexBg: 'bg-purple-500/15 text-purple-400',
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
            className="flex items-center gap-2 list-none"
            whileDrag={{ scale: 1.02, zIndex: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
            {/* Drag handle */}
            <div
                onPointerDown={e => dragControls.start(e)}
                className="w-8 h-11 shrink-0 flex items-center justify-center text-gray-700 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none select-none"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Index */}
            <span className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black select-none ${config.indexBg}`}>
                {index + 1}
            </span>

            {/* Input */}
            <input
                type="text"
                value={player.name}
                onChange={e => onChange(player.id, e.target.value)}
                autoComplete="off"
                className={`flex-1 min-w-0 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 focus:outline-none ${config.focus} transition-colors text-base font-medium placeholder:text-gray-700`}
                placeholder={`${placeholder} ${index + 1}`}
            />

            {/* Remove */}
            <button
                onClick={() => onRemove(player.id)}
                disabled={!canRemove}
                className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center transition-all ${
                    canRemove
                        ? `${config.bg} ${config.text} active:bg-red-500 active:text-white`
                        : 'opacity-0 pointer-events-none'
                }`}
            >
                <UserMinus className="w-4 h-4" />
            </button>
        </Reorder.Item>
    );
};

export const Setup: React.FC<SetupProps> = ({
    onStart,
    onBack,
    title,
    subtitle,
    icon: Icon,
    themeColor,
    playerPlaceholder,
    addPlayerLabel,
    instructions,
    minPlayers = 3,
    maxPlayers = 8,
}) => {
    const config = colorConfig[themeColor];

    const [players, setPlayers] = useState<PlayerEntry[]>(() => {
        const shuffled = [...DEFAULT_NAMES].sort(() => Math.random() - 0.5);
        return Array.from({ length: minPlayers }, (_, i) => ({
            id: makeId(),
            name: shuffled[i] ?? `${playerPlaceholder} ${i + 1}`,
        }));
    });
    const [showInstructions, setShowInstructions] = useState(false);

    const addPlayer = () => {
        if (players.length < maxPlayers) {
            setPlayers(prev => [...prev, { id: makeId(), name: `${playerPlaceholder} ${prev.length + 1}` }]);
        }
    };

    const removePlayer = (id: string) => {
        if (players.length > minPlayers) {
            setPlayers(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleNameChange = (id: string, name: string) => {
        setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p));
    };

    const shufflePlayers = () => {
        setPlayers(prev => [...prev].sort(() => Math.random() - 0.5));
    };

    const isReady = players.every(p => p.name.trim() !== '');
    const canRemove = players.length > minPlayers;

    const titleWords = title.split(' ');
    const titleFirst = titleWords.slice(0, -1).join(' ');
    const titleLast = titleWords.at(-1) ?? title;

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#0a0502] text-[#e5e7eb] font-sans overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className={`absolute inset-0 ${config.gradient}`} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md relative z-10 px-4 pt-6 pb-28"
            >
                {/* Nav row */}
                <div className="flex items-center justify-between mb-6">
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={onBack}
                        className="p-3 rounded-2xl bg-white/5 active:bg-white/10 text-gray-400 flex items-center gap-2 border border-white/5 group transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Назад</span>
                    </motion.button>
                    <Icon className={`w-5 h-5 ${config.text} opacity-60`} />
                </div>

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] mb-3">
                        {titleWords.length > 1 ? (
                            <>{titleFirst} <span className={config.text}>{titleLast}</span></>
                        ) : (
                            <span className={config.text}>{title}</span>
                        )}
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500 border-l-2 border-white/10 pl-3">
                        {subtitle}
                    </p>
                </div>

                {/* Player list header */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Участники</span>
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            onClick={shufflePlayers}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400 active:text-white transition-colors"
                            title="Перемешать порядок"
                        >
                            <Shuffle className="w-3.5 h-3.5" />
                        </motion.button>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${config.indexBg} border-white/5`}>
                            {players.length} / {maxPlayers}
                        </span>
                    </div>
                </div>

                {/* Drag-reorderable player list */}
                <Reorder.Group
                    as="div"
                    axis="y"
                    values={players}
                    onReorder={setPlayers}
                    className="flex flex-col gap-2 mb-3"
                >
                    {players.map((player, index) => (
                        <PlayerRow
                            key={player.id}
                            player={player}
                            index={index}
                            canRemove={canRemove}
                            config={config}
                            placeholder={playerPlaceholder}
                            onRemove={removePlayer}
                            onChange={handleNameChange}
                        />
                    ))}
                </Reorder.Group>

                {/* Add player */}
                <AnimatePresence>
                    {players.length < maxPlayers && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={addPlayer}
                            className={`w-full py-3.5 border-2 border-dashed border-white/8 rounded-2xl flex items-center justify-center gap-2.5 text-gray-600 transition-all ${config.addHover}`}
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="uppercase text-[10px] font-bold tracking-widest">{addPlayerLabel}</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Fixed bottom action bar */}
            <div className="fixed bottom-0 left-0 right-0 z-20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0a0502] via-[#0a0502]/95 to-transparent pt-6">
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowInstructions(true)}
                        className="py-4 bg-white/5 active:bg-white/10 text-gray-400 rounded-2xl font-bold uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 transition-colors"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-[10px]">Брифинг</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        disabled={!isReady}
                        onClick={() => onStart(players.map(p => p.name))}
                        className={`py-4 ${config.button} text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl ${config.shadow} flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none transition-colors`}
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span className="text-[10px] italic">Старт</span>
                    </motion.button>
                </div>
            </div>

            {/* Instructions modal */}
            <AnimatePresence>
                {showInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/95 backdrop-blur-xl"
                        onClick={e => { if (e.target === e.currentTarget) setShowInstructions(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                            className={`bg-[#120a0a] border ${config.border} p-6 rounded-[2rem] max-w-lg w-full shadow-2xl`}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 ${config.bg} rounded-xl`}>
                                        <HelpCircle className={`w-5 h-5 ${config.text}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none">Брифинг</h2>
                                        <p className={`text-[10px] ${config.text} uppercase tracking-widest font-bold mt-0.5`}>{title}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className={`p-2 bg-white/5 rounded-xl ${config.closeHover} transition-colors`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
                                {instructions.map((inst, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
                                        <h4 className={`text-xs font-black ${config.text} uppercase flex items-center gap-1`}>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                            {inst.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{inst.content}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowInstructions(false)}
                                className="w-full py-4 mt-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm"
                            >
                                Принято
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
