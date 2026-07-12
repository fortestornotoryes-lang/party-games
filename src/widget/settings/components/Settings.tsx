import { ArrowLeft, Database, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useMemo, useState } from 'react';

import { GameKey } from '@/entities/game/types';
import { IconButton } from '@/shared/components/IconButton';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { Pagination } from '@/shared/components/Pagination';
import { SectionLabel } from '@/shared/components/SectionLabel';
import { TabButton } from '@/shared/components/TabButton';
import { TextInput } from '@/shared/components/TextInput';
import { Typography } from '@/shared/components/Typography';
import { useLanguage } from '@/shared/i18n';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { storageService } from '@/shared/services/storageService';
import type { GameSettings } from '@/shared/services/storageService';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

interface SettingsProps {
  onBack: () => void;
}

const PAGE_SIZE = 8;

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
    // short резолвится через t('settingsPage.todShort') в рендере
    id: GameKey.TruthOrDare,
    short: null,
    activeCls: 'bg-premium-red/10    border-premium-red/30    text-premium-red',
  },
] as const;

const DIFFICULTIES: { id: Difficulty; labelKey: string }[] = [
  { id: DIFFICULTY.EASY, labelKey: 'common.difficultyShort.easy' },
  { id: DIFFICULTY.MEDIUM, labelKey: 'common.difficultyShort.medium' },
  { id: DIFFICULTY.HARD, labelKey: 'common.difficultyShort.hard' },
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
}> = ({ label, description, value, onToggle }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm font-bold text-white/80">{label}</p>
      <p className="text-tag font-black tracking-widest text-white/25 uppercase">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`h-6 w-12 rounded-full p-1 transition-colors ${value ? 'bg-premium-green' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: value ? 24 : 0 }}
        className="h-4 w-4 rounded-full bg-white shadow-lg"
      />
    </button>
  </div>
);

// ─── component ────────────────────────────────────────────────────────────────

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'words'>('general');
  // TODO: RN — replace with useEffect async load (useState lazy initializer incompatible with async)
  const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());
  const { t, lang, setLang } = useLanguage();

  // Words tab state
  const [alsoAdd, setAlsoAdd] = useState<Set<GameKey>>(new Set([GameKey.JustOne]));
  const [wordDiff, setWordDiff] = useState<Difficulty>(DIFFICULTY.MEDIUM);
  const [todType, setTodType] = useState<'truth' | 'dare'>('truth');
  const [todDiff, setTodDiff] = useState<Difficulty>(DIFFICULTY.MEDIUM);
  const [newWord, setNewWord] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedGame = Array.from(alsoAdd)[0] ?? GameKey.JustOne;
  const isTod = alsoAdd.has(GameKey.TruthOrDare);

  // TODO: RN — replace with useEffect async load (useMemo render-path read incompatible with async)
  const customWords = useMemo(
    () =>
      isTod
        ? storageService.getCustomWordsByKey(todKey(todType, todDiff))
        : storageService.getCustomWordsByKey(`${selectedGame}_${wordDiff}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedGame, todType, todDiff, isTod, wordDiff, refreshKey]
  );

  // TODO: RN — replace with useEffect async load (useMemo render-path read incompatible with async)
  const usedCount = useMemo(
    () => storageService.getUsedWords(selectedGame).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedGame, refreshKey]
  );

  // Filtered + paginated slice
  const filteredWords = customWords.filter((w) =>
    w.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const maxPage = Math.max(1, Math.ceil(filteredWords.length / PAGE_SIZE));
  const effectivePage = Math.min(currentPage, maxPage);
  const pagedWords = filteredWords.slice(
    (effectivePage - 1) * PAGE_SIZE,
    effectivePage * PAGE_SIZE
  );

  const refresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // ── handlers ──

  const toggleSetting = (key: keyof GameSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    void storageService.saveSettingsAsync(next);
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

  const handleAdd = async () => {
    const word = newWord.trim();

    if (word.length < 3) {
      setValidationError(t('settingsPage.errMinLetters'));
      return;
    }

    const wordLower = word.toLowerCase();
    const isDuplicate = isTod
      ? (await storageService.getCustomWordsByKeyAsync(todKey(todType, todDiff))).some(
          (w) => w.toLowerCase() === wordLower
        )
      : (
          await Promise.all(
            Array.from(alsoAdd).map((id) =>
              storageService.getCustomWordsByKeyAsync(`${id}_${wordDiff}`)
            )
          )
        ).some((words) => words.some((w) => w.toLowerCase() === wordLower));

    if (isDuplicate) {
      setValidationError(t('settingsPage.errDuplicate'));
      return;
    }

    if (isTod) {
      await storageService.addCustomWordByKeyAsync(todKey(todType, todDiff), word);
    } else {
      for (const id of alsoAdd) {
        await storageService.addCustomWordByKeyAsync(`${id}_${wordDiff}`, word);
      }
    }

    setNewWord('');
    setValidationError(null);
    refresh();
  };

  const handleRemove = async (word: string) => {
    if (isTod) {
      await storageService.removeCustomWordByKeyAsync(todKey(todType, todDiff), word);
    } else {
      await storageService.removeCustomWordByKeyAsync(`${selectedGame}_${wordDiff}`, word);
    }
    if (pagedWords.length === 1 && effectivePage > 1) {
      setCurrentPage((p) => p - 1);
    }
    refresh();
  };

  const handleReset = async () => {
    if (!confirm(t('settingsPage.confirmReset'))) return;
    await storageService.resetUsedWordsAsync(selectedGame);
    refresh();
  };

  // ── render ──

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <IconButton icon={ArrowLeft} onClick={onBack} />
        <Typography.Heading>{t('settingsPage.title')}</Typography.Heading>
        <div className="w-12" />
      </div>

      {/* Tabs */}
      <div className="rounded-premium-md mb-8 flex bg-white/5 p-1">
        <TabButton
          active={activeTab === 'general'}
          onClick={() => {
            setActiveTab('general');
          }}
        >
          {t('settingsPage.tabGeneral')}
        </TabButton>
        <TabButton
          active={activeTab === 'words'}
          onClick={() => {
            setActiveTab('words');
          }}
        >
          {t('settingsPage.tabWords')}
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        {/* ── GENERAL TAB ── */}
        {activeTab === 'general' && (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-premium-xl space-y-1 border border-white/5 p-6">
              <SectionLabel className="mb-5">{t('settingsPage.effectsSection')}</SectionLabel>
              <div className="divide-y divide-white/5">
                <SettingToggle
                  label={t('settingsPage.visualEffects')}
                  description={t('settingsPage.visualEffectsDesc')}
                  value={!!settings.visualEffects}
                  onToggle={() => {
                    toggleSetting('visualEffects');
                  }}
                />
                <SettingToggle
                  label={t('settingsPage.vibration')}
                  description={t('settingsPage.vibrationDesc')}
                  value={!!settings.vibration}
                  onToggle={() => {
                    toggleSetting('vibration');
                  }}
                />
                <SettingToggle
                  label={t('settingsPage.sounds')}
                  description={t('settingsPage.soundsDesc')}
                  value={!!settings.sounds}
                  onToggle={() => {
                    toggleSetting('sounds');
                  }}
                />
              </div>
            </div>

            <div className="glass-card rounded-premium-xl border border-white/5 p-6">
              <SectionLabel className="mb-5">Язык / Language</SectionLabel>
              <div className="flex gap-2">
                {(['ru', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                    }}
                    className={`rounded-premium-md flex-1 border py-3 text-xs font-black tracking-wider uppercase transition-all ${
                      lang === l
                        ? 'border-white/25 bg-white/15 text-white'
                        : 'border-white/5 bg-white/3 text-white/30'
                    }`}
                  >
                    {l === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-premium-xl border border-white/5 p-6">
              <SectionLabel className="mb-4">{t('settingsPage.storageSection')}</SectionLabel>
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-premium-green/10 rounded-premium-sm border-premium-green/20 flex h-10 w-10 items-center justify-center border">
                  <Database className="text-premium-green h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/80">LocalStorage</p>
                  <p className="text-tag text-premium-green font-black tracking-widest uppercase">
                    {t('settingsPage.storageActive')}
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-white/30">
                {t('settingsPage.storageDesc')}
              </p>
            </div>

            <div className="glass-card rounded-premium-xl border border-white/5 p-6">
              <SectionLabel className="mb-2">{t('settingsPage.aboutSection')}</SectionLabel>
              <p className="text-xs leading-relaxed text-white/30">{t('settingsPage.aboutText')}</p>
            </div>
          </motion.div>
        )}

        {/* ── WORDS TAB ── */}
        {activeTab === 'words' && (
          <motion.div
            key="words"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* 1. TruthOrDare — type + difficulty selectors */}
            <AnimatePresence>
              {isTod ? (
                <motion.div
                  key="tod-selectors"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {(['truth', 'dare'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          handleSetTodType(type);
                        }}
                        className={`rounded-premium-md text-tag border py-3 font-black tracking-widest uppercase transition-all ${
                          todType === type
                            ? type === 'truth'
                              ? 'bg-premium-sky/10 border-premium-sky/30 text-premium-sky'
                              : 'bg-premium-red/10 border-premium-red/30 text-premium-red'
                            : 'border-white/8 text-white/20'
                        }`}
                      >
                        {type === 'truth' ? t('settingsPage.truth') : t('settingsPage.dare')}
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
                        className={`rounded-premium-md text-tag border py-3 font-black tracking-widest uppercase transition-all ${
                          todDiff === d.id
                            ? d.id === DIFFICULTY.EASY
                              ? 'bg-premium-green/10 border-premium-green/30 text-premium-green'
                              : d.id === DIFFICULTY.MEDIUM
                                ? 'bg-premium-sky/10 border-premium-sky/30 text-premium-sky'
                                : 'bg-premium-red/10 border-premium-red/30 text-premium-red'
                            : 'border-white/8 text-white/20'
                        }`}
                      >
                        {t(d.labelKey)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* 2. Progress */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-tag mb-0.5 font-black tracking-[0.4em] text-white/40 uppercase">
                  {t('settingsPage.progress')}
                </p>
                <p className="text-label font-medium text-white/20">
                  {usedCount > 0
                    ? t('settingsPage.usedCount', { n: usedCount })
                    : t('settingsPage.noUsed')}
                </p>
              </div>
              {usedCount > 0 && (
                <button
                  onClick={handleReset}
                  className="bg-premium-red/10 text-premium-red rounded-premium-sm text-micro border-premium-red/20 flex items-center gap-1.5 border px-3 py-1.5 font-black tracking-widest uppercase transition-transform active:scale-95"
                >
                  <RefreshCw className="h-3 w-3" />
                  {t('settingsPage.reset')}
                </button>
              )}
            </div>

            {/* 3. Add form */}
            <div className="space-y-3">
              <SectionLabel>{t('settingsPage.addSection')}</SectionLabel>

              {/* Difficulty selector (non-TruthOrDare) */}
              {!isTod && (
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        handleSetWordDiff(d.id);
                      }}
                      className={`rounded-premium-md text-tag border py-2.5 font-black tracking-widest uppercase transition-all ${
                        wordDiff === d.id
                          ? d.id === DIFFICULTY.EASY
                            ? 'bg-premium-green/10 border-premium-green/30 text-premium-green'
                            : d.id === DIFFICULTY.MEDIUM
                              ? 'bg-premium-sky/10 border-premium-sky/30 text-premium-sky'
                              : 'bg-premium-red/10 border-premium-red/30 text-premium-red'
                          : 'border-white/8 text-white/20'
                      }`}
                    >
                      {t(d.labelKey)}
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
                    className="rounded-premium-md bg-premium-green flex w-12 shrink-0 items-center justify-center text-black transition-all active:scale-95 disabled:opacity-30"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                {/* Validation error */}
                <AnimatePresence>
                  {validationError !== null && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-tag text-premium-red/70 pl-1 font-black tracking-widest uppercase"
                    >
                      {validationError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Game chips — primary game selector */}
              <div>
                <p className="text-micro mb-2 font-black tracking-[0.35em] text-white/20 uppercase">
                  {t('settingsPage.addTo')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_WORD_GAMES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        toggleAlsoAdd(game.id);
                      }}
                      className={`text-micro rounded-full border px-3 py-1.5 font-black tracking-widest uppercase transition-all ${
                        alsoAdd.has(game.id) ? game.activeCls : 'border-white/8 text-white/20'
                      }`}
                    >
                      {game.short ?? t('settingsPage.todShort')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Custom words list */}
            <div>
              <SectionLabel>
                {isTod
                  ? `${todType === 'truth' ? t('settingsPage.customTruths') : t('settingsPage.customDares')} · ${t(DIFFICULTIES.find((d) => d.id === todDiff)?.labelKey ?? '')}`
                  : `${t('settingsPage.customWords')} · ${t(DIFFICULTIES.find((d) => d.id === wordDiff)?.labelKey ?? '')}`}
              </SectionLabel>

              {customWords.length === 0 ? (
                <p className="text-label py-10 text-center font-medium text-white/15 italic">
                  {t('settingsPage.nothingAdded')}
                </p>
              ) : (
                <>
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-white/20" />
                    <input
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder={t('settingsPage.searchPlaceholder')}
                      className="rounded-premium-md w-full border border-white/8 bg-white/5 py-2.5 pr-4 pl-8 text-sm text-white/60 outline-none placeholder:text-white/20"
                    />
                  </div>

                  {/* Word list */}
                  {filteredWords.length === 0 ? (
                    <p className="text-label py-6 text-center font-medium text-white/15 italic">
                      {t('settingsPage.nothingFound')}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pagedWords.map((word) => (
                        <div
                          key={word}
                          className="rounded-premium-md flex items-center justify-between border border-white/5 bg-white/2 px-4 py-3"
                        >
                          <span className="mr-3 flex-1 text-sm leading-snug font-medium text-white/60">
                            {word}
                          </span>
                          <button
                            onClick={() => {
                              handleRemove(word);
                            }}
                            className="hover:text-premium-red rounded-premium-xs shrink-0 p-1 text-white/15 transition-all active:scale-90"
                          >
                            <Trash2 className="h-4 w-4" />
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
