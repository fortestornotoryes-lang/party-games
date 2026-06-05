import {ArrowLeft, Database, Plus, RefreshCw, Search, Trash2} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import React, {useMemo, useState} from 'react';

import {feedbackService, VIBRATE} from '../services/feedbackService';
import type {GameSettings} from '../services/storageService';
import {storageService} from '../services/storageService';
import type {Difficulty} from '../types';
import {GameKey} from '../types/games';

import {Pagination} from './Pagination';
import {IconButton, PageWrapper, SectionLabel, TabButton, Typography} from './UI';

import {TextInput} from '@/components/TextInput.tsx';
import {useLanguage} from '@/i18n';

interface SettingsProps {
    onBack: () => void;
}

const PAGE_SIZE = 1;

const ALL_WORD_GAMES = [
    {
        id: GameKey.JustOne,
        short: 'Just One',
        activeCls: 'bg-premium-yellow/10 border-premium-yellow/30 text-premium-yellow',
    },
    {
        id: GameKey.Alias,
        short: 'Alias',
        activeCls: 'bg-premium-blue/10   border-premium-blue/30   text-premium-blue',
    },
    {
        id: GameKey.Telestrations,
        short: 'Telest.',
        activeCls: 'bg-premium-orange/10 border-premium-orange/30 text-premium-orange',
    },
    {
        id: GameKey.Codenames,
        short: 'Codenames',
        activeCls: 'bg-premium-green/10  border-premium-green/30  text-premium-green',
    },
    {
        id: GameKey.Decrypto,
        short: 'Decrypto',
        activeCls: 'bg-premium-purple/10 border-premium-purple/30 text-premium-purple',
    },
    {
        id: GameKey.Spy,
        short: 'Spy Hunt',
        activeCls: 'bg-premium-red/10    border-premium-red/30    text-premium-red',
    },
    {
        id: GameKey.FakeArtist,
        short: 'Fake Art.',
        activeCls: 'bg-premium-green/10  border-premium-green/30  text-premium-green',
    },
    {
        id: GameKey.Wavelength,
        short: 'Wavelength',
        activeCls: 'bg-premium-purple/10 border-premium-purple/30 text-premium-purple',
    },
    {
        id: GameKey.TruthOrDare,
        short: 'П/Действие',
        activeCls: 'bg-premium-red/10    border-premium-red/30    text-premium-red',
    },
] as const;

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
    {id: 'easy', label: 'Легко'},
    {id: 'medium', label: 'Норма'},
    {id: 'hard', label: 'Профи'},
];

function todKey(type: 'truth' | 'dare', diff: Difficulty) {
    return `tod_${type}_${diff}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

const SettingToggle: React.FC<{
    label: string;
    description: string;
    value: boolean;
    onToggle: () => void;
}> = ({label, description, value, onToggle}) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <p className="text-sm font-bold text-white/80">{label}</p>
            <p className="text-tag text-white/25 uppercase font-black tracking-widest">
                {description}
            </p>
        </div>
        <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-premium-green' : 'bg-white/10'}`}
        >
            <motion.div
                animate={{x: value ? 24 : 0}}
                className="w-4 h-4 bg-white rounded-full shadow-lg"
            />
        </button>
    </div>
);

// ─── component ────────────────────────────────────────────────────────────────

export const Settings: React.FC<SettingsProps> = ({onBack}) => {
    const [activeTab, setActiveTab] = useState<'general' | 'words'>('general');
    const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());
    const {lang, setLang} = useLanguage();

    // Words tab state
    const [alsoAdd, setAlsoAdd] = useState<Set<GameKey>>(new Set([GameKey.JustOne]));
    const [wordDiff, setWordDiff] = useState<Difficulty>('medium');
    const [todType, setTodType] = useState<'truth' | 'dare'>('truth');
    const [todDiff, setTodDiff] = useState<Difficulty>('medium');
    const [newWord, setNewWord] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    const selectedGame = Array.from(alsoAdd)[0] ?? GameKey.JustOne;
    const isTod = alsoAdd.has(GameKey.TruthOrDare);

    const customWords = useMemo(
        () =>
            isTod
                ? storageService.getCustomWordsByKey(todKey(todType, todDiff))
                : storageService.getCustomWordsByKey(`${selectedGame}_${wordDiff}`),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedGame, todType, todDiff, isTod, wordDiff, refreshKey],
    );

    const usedCount = useMemo(
        () => storageService.getUsedWords(selectedGame).length,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedGame, refreshKey],
    );

    // Filtered + paginated slice
    const filteredWords = customWords.filter((w) =>
        w.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const maxPage = Math.max(1, Math.ceil(filteredWords.length / PAGE_SIZE));
    const effectivePage = Math.min(currentPage, maxPage);
    const pagedWords = filteredWords.slice(
        (effectivePage - 1) * PAGE_SIZE,
        effectivePage * PAGE_SIZE,
    );

    const refresh = () => {
        setRefreshKey((k) => k + 1);
    };

    // ── handlers ──

    const toggleSetting = (key: keyof GameSettings) => {
        const next = {...settings, [key]: !settings[key]};
        setSettings(next);
        storageService.saveSettings(next);
        if (key === 'vibration') feedbackService.vibrate(VIBRATE.tap);
        if (key === 'sounds') feedbackService.playSound('click');
    };

    const toggleAlsoAdd = (id: GameKey) => {
        setAlsoAdd((prev) => {
            const next = new Set(prev);
            if (id === GameKey.TruthOrDare) {
                if (next.has(id)) {
                    if (next.size > 1) next.delete(id);
                } else {
                    next.clear();
                    next.add(id);
                }
            } else {
                next.delete(GameKey.TruthOrDare);
                if (next.has(id)) {
                    if (next.size > 1) next.delete(id);
                } else {
                    next.add(id);
                }
            }
            return next;
        });
        setNewWord('');
        setValidationError(null);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleSetWordDiff = (d: Difficulty) => {
        setWordDiff(d);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleSetTodType = (t: 'truth' | 'dare') => {
        setTodType(t);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleSetTodDiff = (d: Difficulty) => {
        setTodDiff(d);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleAdd = () => {
        const word = newWord.trim();

        if (word.length < 3) {
            setValidationError('Минимум 3 буквы');
            return;
        }

        const wordLower = word.toLowerCase();
        const isDuplicate = isTod
            ? storageService
                .getCustomWordsByKey(todKey(todType, todDiff))
                .some((w) => w.toLowerCase() === wordLower)
            : Array.from(alsoAdd).some((id) =>
                storageService
                    .getCustomWordsByKey(`${id}_${wordDiff}`)
                    .some((w) => w.toLowerCase() === wordLower),
            );

        if (isDuplicate) {
            setValidationError('Уже добавлено');
            return;
        }

        if (isTod) {
            storageService.addCustomWordByKey(todKey(todType, todDiff), word);
        } else {
            alsoAdd.forEach((id) => {
                storageService.addCustomWordByKey(`${id}_${wordDiff}`, word);
            });
        }

        setNewWord('');
        setValidationError(null);
        refresh();
    };

    const handleRemove = (word: string) => {
        if (isTod) {
            storageService.removeCustomWordByKey(todKey(todType, todDiff), word);
        } else {
            storageService.removeCustomWordByKey(`${selectedGame}_${wordDiff}`, word);
        }
        if (pagedWords.length === 1 && effectivePage > 1) {
            setCurrentPage((p) => p - 1);
        }
        refresh();
    };

    const handleReset = () => {
        if (!confirm('Сбросить прогресс для этой игры?')) return;
        storageService.resetUsedWords(selectedGame);
        refresh();
    };

    // ── render ──

    return (
        <PageWrapper>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <IconButton icon={ArrowLeft} onClick={onBack}/>
                <Typography.Heading>Настройки</Typography.Heading>
                <div className="w-12"/>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-premium-md mb-8">
                <TabButton active={activeTab === 'general'} onClick={() => {
                    setActiveTab('general');
                }}>
                    Общие
                </TabButton>
                <TabButton active={activeTab === 'words'} onClick={() => {
                    setActiveTab('words');
                }}>
                    Слова
                </TabButton>
            </div>

            <AnimatePresence mode="wait">
                {/* ── GENERAL TAB ── */}
                {activeTab === 'general' && (
                    <motion.div
                        key="general"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        className="space-y-6"
                    >
                        <div className="glass-card rounded-premium-xl p-6 border border-white/5 space-y-1">
                            <SectionLabel className="mb-5">Эффекты и отклик</SectionLabel>
                            <div className="divide-y divide-white/5">
                                <SettingToggle
                                    label="Визуальные эффекты"
                                    description="Конфетти и анимации"
                                    value={!!settings.visualEffects}
                                    onToggle={() => {
                                        toggleSetting('visualEffects');
                                    }}
                                />
                                <SettingToggle
                                    label="Вибрация"
                                    description="Тактильный отклик"
                                    value={!!settings.vibration}
                                    onToggle={() => {
                                        toggleSetting('vibration');
                                    }}
                                />
                                <SettingToggle
                                    label="Звуки"
                                    description="Звуковые эффекты"
                                    value={!!settings.sounds}
                                    onToggle={() => {
                                        toggleSetting('sounds');
                                    }}
                                />
                            </div>
                        </div>

                        <div className="glass-card rounded-premium-xl p-6 border border-white/5">
                            <SectionLabel className="mb-5">Язык / Language</SectionLabel>
                            <div className="flex gap-2">
                                {(['ru', 'en'] as const).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => {
                                            setLang(l);
                                        }}
                                        className={`flex-1 py-3 rounded-premium-md text-xs font-black uppercase tracking-wider border transition-all ${
                                            lang === l
                                                ? 'bg-white/15 text-white border-white/25'
                                                : 'bg-white/3 text-white/30 border-white/5'
                                        }`}
                                    >
                                        {l === 'ru' ? 'Русский' : 'English'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-premium-xl p-6 border border-white/5">
                            <SectionLabel className="mb-4">Хранилище</SectionLabel>
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 bg-premium-green/10 rounded-premium-sm flex items-center justify-center border border-premium-green/20">
                                    <Database className="w-5 h-5 text-premium-green"/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white/80">LocalStorage</p>
                                    <p className="text-tag text-premium-green font-black uppercase tracking-widest">
                                        Активно
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-white/30 leading-relaxed">
                                Игроки, пройденные вопросы и свои слова хранятся локально в браузере.
                            </p>
                        </div>

                        <div className="glass-card rounded-premium-xl p-6 border border-white/5">
                            <SectionLabel className="mb-2">О приложении</SectionLabel>
                            <p className="text-xs text-white/30 leading-relaxed">
                                Версия 1.1.0-beta · Я писал это на отьебись, как и всё остальное
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ── WORDS TAB ── */}
                {activeTab === 'words' && (
                    <motion.div
                        key="words"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        className="space-y-6"
                    >
                        {/* 1. TruthOrDare — type + difficulty selectors */}
                        <AnimatePresence>
                            {isTod ? (
                                <motion.div
                                    key="tod-selectors"
                                    initial={{opacity: 0, height: 0}}
                                    animate={{opacity: 1, height: 'auto'}}
                                    exit={{opacity: 0, height: 0}}
                                    className="space-y-3"
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['truth', 'dare'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => {
                                                    handleSetTodType(t);
                                                }}
                                                className={`py-3 rounded-premium-md text-tag font-black uppercase tracking-widest border transition-all ${
                                                    todType === t
                                                        ? t === 'truth'
                                                            ? 'bg-premium-sky/10 border-premium-sky/30 text-premium-sky'
                                                            : 'bg-premium-red/10 border-premium-red/30 text-premium-red'
                                                        : 'border-white/8 text-white/20'
                                                }`}
                                            >
                                                {t === 'truth' ? 'Правда' : 'Действие'}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {DIFFICULTIES.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => {
                                                    handleSetTodDiff(d.id);
                                                }}
                                                className={`py-3 rounded-premium-md text-tag font-black uppercase tracking-widest border transition-all ${
                                                    todDiff === d.id
                                                        ? d.id === 'easy'
                                                            ? 'bg-premium-green/10  border-premium-green/30  text-premium-green'
                                                            : d.id === 'medium'
                                                                ? 'bg-premium-sky/10    border-premium-sky/30    text-premium-sky'
                                                                : 'bg-premium-red/10    border-premium-red/30    text-premium-red'
                                                        : 'border-white/8 text-white/20'
                                                }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        {/* 2. Progress */}
                        <div className="flex items-center justify-between py-1">
                            <div>
                                <p className="text-tag font-black uppercase tracking-[0.4em] text-white/40 mb-0.5">
                                    Прогресс
                                </p>
                                <p className="text-label text-white/20 font-medium">
                                    {usedCount > 0 ? `${String(usedCount)} пройдено` : 'Нет пройденных'}
                                </p>
                            </div>
                            {usedCount > 0 && (
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-premium-red/10 text-premium-red rounded-premium-sm text-micro font-black uppercase tracking-widest border border-premium-red/20 active:scale-95 transition-transform"
                                >
                                    <RefreshCw className="w-3 h-3"/>
                                    Сброс
                                </button>
                            )}
                        </div>

                        {/* 3. Add form */}
                        <div className="space-y-3">
                            <SectionLabel>Добавить</SectionLabel>

                            {/* Difficulty selector (non-TruthOrDare) */}
                            {!isTod && (
                                <div className="grid grid-cols-3 gap-2">
                                    {DIFFICULTIES.map((d) => (
                                        <button
                                            key={d.id}
                                            onClick={() => {
                                                handleSetWordDiff(d.id);
                                            }}
                                            className={`py-2.5 rounded-premium-md text-tag font-black uppercase tracking-widest border transition-all ${
                                                wordDiff === d.id
                                                    ? d.id === 'easy'
                                                        ? 'bg-premium-green/10  border-premium-green/30  text-premium-green'
                                                        : d.id === 'medium'
                                                            ? 'bg-premium-sky/10    border-premium-sky/30    text-premium-sky'
                                                            : 'bg-premium-red/10    border-premium-red/30    text-premium-red'
                                                    : 'border-white/8 text-white/20'
                                            }`}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <div className="flex gap-2">
                                    <TextInput
                                        value={newWord}
                                        onChange={(e) => {
                                            setNewWord(e.target.value);
                                            setValidationError(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAdd();
                                        }}
                                        className="flex-1"
                                    />
                                    <button
                                        onClick={handleAdd}
                                        disabled={newWord.trim().length < 3}
                                        className="shrink-0 w-12 rounded-premium-md bg-premium-green text-black flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
                                    >
                                        <Plus className="w-5 h-5"/>
                                    </button>
                                </div>

                                {/* Validation error */}
                                <AnimatePresence>
                                    {validationError !== null && (
                                        <motion.p
                                            initial={{opacity: 0, y: -4}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0}}
                                            className="text-tag font-black uppercase tracking-widest text-premium-red/70 pl-1"
                                        >
                                            {validationError}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Game chips — primary game selector */}
                            <div>
                                <p className="text-micro font-black uppercase tracking-[0.35em] text-white/20 mb-2">
                                    Добавить в:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_WORD_GAMES.map((game) => (
                                        <button
                                            key={game.id}
                                            onClick={() => {
                                                toggleAlsoAdd(game.id);
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-micro font-black uppercase tracking-widest border transition-all ${
                                                alsoAdd.has(game.id) ? game.activeCls : 'border-white/8 text-white/20'
                                            }`}
                                        >
                                            {game.short}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. Custom words list */}
                        <div>
                            <SectionLabel>
                                {isTod
                                    ? `Свои ${todType === 'truth' ? 'правды' : 'действия'} · ${DIFFICULTIES.find((d) => d.id === todDiff)?.label ?? ''}`
                                    : `Свои слова · ${DIFFICULTIES.find((d) => d.id === wordDiff)?.label ?? ''}`}
                            </SectionLabel>

                            {customWords.length === 0 ? (
                                <p className="text-label text-white/15 font-medium text-center py-10 italic">
                                    Ничего не добавлено
                                </p>
                            ) : (
                                <>
                                    {/* Search */}
                                    <div className="relative mb-3">
                                        <Search
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none"/>
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            placeholder="Поиск..."
                                            className="w-full pl-8 pr-4 py-2.5 bg-white/5 rounded-premium-md text-sm text-white/60 placeholder:text-white/20 border border-white/8 outline-none"
                                        />
                                    </div>

                                    {/* Word list */}
                                    {filteredWords.length === 0 ? (
                                        <p className="text-label text-white/15 font-medium text-center py-6 italic">
                                            Ничего не найдено
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {pagedWords.map((word) => (
                                                <div
                                                    key={word}
                                                    className="flex items-center justify-between bg-white/2 px-4 py-3 rounded-premium-md border border-white/5"
                                                >
                          <span className="text-sm font-medium text-white/60 leading-snug flex-1 mr-3">
                            {word}
                          </span>
                                                    <button
                                                        onClick={() => {
                                                            handleRemove(word);
                                                        }}
                                                        className="text-white/15 hover:text-premium-red active:scale-90 transition-all shrink-0 p-1 rounded-premium-xs"
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            ))}

                                            <Pagination
                                                page={effectivePage}
                                                total={filteredWords.length}
                                                perPage={PAGE_SIZE}
                                                onChange={setCurrentPage}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageWrapper>
    );
};
