import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Trash2, RefreshCw, Database } from 'lucide-react';
import { storageService, GameSettings } from '../services/storageService';
import { feedbackService } from '../services/feedbackService';
import { GameKey } from '../types/games';
import { Difficulty } from '../types';
import { SectionLabel, IconButton, TextInput, PageWrapper, Typography, TabButton } from './UI';

interface SettingsProps {
  onBack: () => void;
}

// ─── game meta ────────────────────────────────────────────────────────────────

const ALL_WORD_GAMES = [
  { id: GameKey.JustOne,       short: 'Just One',   activeCls: 'bg-premium-yellow/10 border-premium-yellow/30 text-premium-yellow' },
  { id: GameKey.Alias,         short: 'Alias',       activeCls: 'bg-premium-blue/10   border-premium-blue/30   text-premium-blue'   },
  { id: GameKey.Telestrations, short: 'Telest.',     activeCls: 'bg-premium-orange/10 border-premium-orange/30 text-premium-orange' },
  { id: GameKey.Codenames,     short: 'Codenames',   activeCls: 'bg-premium-green/10  border-premium-green/30  text-premium-green'  },
  { id: GameKey.Decrypto,      short: 'Decrypto',    activeCls: 'bg-premium-purple/10 border-premium-purple/30 text-premium-purple' },
  { id: GameKey.Spy,           short: 'Spy Hunt',    activeCls: 'bg-premium-red/10    border-premium-red/30    text-premium-red'    },
  { id: GameKey.FakeArtist,    short: 'Fake Art.',   activeCls: 'bg-premium-green/10  border-premium-green/30  text-premium-green'  },
  { id: GameKey.Wavelength,    short: 'Wavelength',  activeCls: 'bg-premium-purple/10 border-premium-purple/30 text-premium-purple' },
  { id: GameKey.TruthOrDare,   short: 'П/Действие',  activeCls: 'bg-premium-red/10    border-premium-red/30    text-premium-red'    },
] as const;

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'easy',   label: 'Легко' },
  { id: 'medium', label: 'Норма' },
  { id: 'hard',   label: 'Профи' },
];

function getPlaceholder(gameId: GameKey): string {
  switch (gameId) {
    case GameKey.TruthOrDare: return 'Вопрос или задание...';
    case GameKey.Spy:         return 'Название локации...';
    case GameKey.FakeArtist:  return 'Тема для рисунка...';
    case GameKey.Wavelength:  return 'Горячее — Холодное';
    default:                  return 'Своё слово...';
  }
}

function todKey(type: 'truth' | 'dare', diff: Difficulty) {
  return `tod_${type}_${diff}`;
}

// ─── component ────────────────────────────────────────────────────────────────

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'words'>('general');
  const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());

  // Words tab state
  // alsoAdd is the primary game selector — chips under the word field
  const [alsoAdd, setAlsoAdd] = useState<Set<GameKey>>(new Set([GameKey.JustOne]));
  const [wordDiff, setWordDiff] = useState<Difficulty>('medium');
  const [todType, setTodType] = useState<'truth' | 'dare'>('truth');
  const [todDiff, setTodDiff] = useState<Difficulty>('medium');
  const [newWord, setNewWord] = useState('');
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [usedCount, setUsedCount] = useState(0);

  // selectedGame = first chip in selection (used for word list / progress display)
  const selectedGame = Array.from(alsoAdd)[0] ?? GameKey.JustOne;
  const isTod = alsoAdd.has(GameKey.TruthOrDare);

  const loadData = useCallback(() => {
    const words = isTod
      ? storageService.getCustomWordsByKey(todKey(todType, todDiff))
      : storageService.getCustomWordsByKey(`${selectedGame}_${wordDiff}`);
    setCustomWords(words);
    setUsedCount(storageService.getUsedWords(selectedGame).length);
  }, [selectedGame, todType, todDiff, isTod, wordDiff]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── handlers ──

  const toggleSetting = (key: keyof GameSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    storageService.saveSettings(next);
    if (key === 'vibration') feedbackService.vibrate(20);
    if (key === 'sounds') feedbackService.playSound('click');
  };

  const toggleAlsoAdd = (id: GameKey) => {
    setAlsoAdd(prev => {
      const next = new Set(prev);
      if (id === GameKey.TruthOrDare) {
        // TruthOrDare is mutually exclusive with other games
        if (next.has(id)) {
          if (next.size > 1) next.delete(id);
        } else {
          next.clear();
          next.add(id);
        }
      } else {
        // Selecting a regular game clears TruthOrDare
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
  };

  const handleAdd = () => {
    const word = newWord.trim();
    if (!word) return;

    if (isTod) {
      storageService.addCustomWordByKey(todKey(todType, todDiff), word);
    } else {
      alsoAdd.forEach(id =>
        storageService.addCustomWordByKey(`${id}_${wordDiff}`, word)
      );
    }

    setNewWord('');
    loadData();
  };

  const handleRemove = (word: string) => {
    if (isTod) {
      storageService.removeCustomWordByKey(todKey(todType, todDiff), word);
    } else {
      storageService.removeCustomWordByKey(`${selectedGame}_${wordDiff}`, word);
    }
    loadData();
  };

  const handleReset = () => {
    if (!confirm('Сбросить прогресс для этой игры?')) return;
    storageService.resetUsedWords(selectedGame);
    setUsedCount(0);
  };

  // ── sub-components ──

  const SettingToggle = ({
    label, description, value, onToggle,
  }: { label: string; description: string; value: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-bold text-white/80">{label}</p>
        <p className="text-[10px] text-white/25 uppercase font-black tracking-widest">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-premium-green' : 'bg-white/10'}`}
      >
        <motion.div animate={{ x: value ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-lg" />
      </button>
    </div>
  );

  // ── render ──

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <IconButton icon={ArrowLeft} onClick={onBack} />
        <Typography.Heading>Настройки</Typography.Heading>
        <div className="w-12" />
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
        <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>Общие</TabButton>
        <TabButton active={activeTab === 'words'}   onClick={() => setActiveTab('words')}>Слова</TabButton>
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
            <div className="glass-card rounded-[24px] p-6 border border-white/5 space-y-1">
              <SectionLabel className="mb-5">Эффекты и отклик</SectionLabel>
              <div className="divide-y divide-white/5">
                <SettingToggle label="Визуальные эффекты" description="Конфетти и анимации"  value={!!settings.visualEffects} onToggle={() => toggleSetting('visualEffects')} />
                <SettingToggle label="Вибрация"           description="Тактильный отклик"     value={!!settings.vibration}     onToggle={() => toggleSetting('vibration')} />
                <SettingToggle label="Звуки"              description="Звуковые эффекты"       value={!!settings.sounds}        onToggle={() => toggleSetting('sounds')} />
              </div>
            </div>

            <div className="glass-card rounded-[24px] p-6 border border-white/5">
              <SectionLabel className="mb-4">Хранилище</SectionLabel>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-premium-green/10 rounded-xl flex items-center justify-center border border-premium-green/20">
                  <Database className="w-5 h-5 text-premium-green" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/80">LocalStorage</p>
                  <p className="text-[10px] text-premium-green font-black uppercase tracking-widest">Активно</p>
                </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                Игроки, пройденные вопросы и свои слова хранятся локально в браузере.
              </p>
            </div>

            <div className="glass-card rounded-[24px] p-6 border border-white/5">
              <SectionLabel className="mb-2">О приложении</SectionLabel>
              <p className="text-xs text-white/30 leading-relaxed">Версия 1.1.0-beta · С любовью для вечеринок</p>
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
            {isTod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {/* Type */}
                <div className="grid grid-cols-2 gap-2">
                  {(['truth', 'dare'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTodType(t)}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
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
                {/* Difficulty */}
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setTodDiff(d.id)}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        todDiff === d.id
                          ? d.id === 'easy'   ? 'bg-premium-green/10  border-premium-green/30  text-premium-green'
                          : d.id === 'medium' ? 'bg-premium-sky/10    border-premium-sky/30    text-premium-sky'
                                              : 'bg-premium-red/10    border-premium-red/30    text-premium-red'
                          : 'border-white/8 text-white/20'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. Progress */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-0.5">Прогресс</p>
                <p className="text-[11px] text-white/20 font-medium">
                  {usedCount > 0 ? `${usedCount} пройдено` : 'Нет пройденных'}
                </p>
              </div>
              {usedCount > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-premium-red/10 text-premium-red rounded-xl text-[9px] font-black uppercase tracking-widest border border-premium-red/20 active:scale-95 transition-transform"
                >
                  <RefreshCw className="w-3 h-3" />
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
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setWordDiff(d.id)}
                      className={`py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        wordDiff === d.id
                          ? d.id === 'easy'   ? 'bg-premium-green/10  border-premium-green/30  text-premium-green'
                          : d.id === 'medium' ? 'bg-premium-sky/10    border-premium-sky/30    text-premium-sky'
                                              : 'bg-premium-red/10    border-premium-red/30    text-premium-red'
                          : 'border-white/8 text-white/20'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <TextInput
                  value={newWord}
                  onChange={e => setNewWord(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder={getPlaceholder(selectedGame)}
                  className="flex-1"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newWord.trim()}
                  className="shrink-0 w-12 rounded-2xl bg-premium-green text-black flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Game chips — primary game selector */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 mb-2">
                  Добавить в:
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_WORD_GAMES.map(game => (
                    <button
                      key={game.id}
                      onClick={() => toggleAlsoAdd(game.id)}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
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
                  ? `Свои ${todType === 'truth' ? 'правды' : 'действия'} · ${DIFFICULTIES.find(d => d.id === todDiff)?.label}`
                  : `Свои слова · ${DIFFICULTIES.find(d => d.id === wordDiff)?.label}`
                }
              </SectionLabel>

              {customWords.length === 0 ? (
                <p className="text-[11px] text-white/15 font-medium text-center py-10 italic">
                  Ничего не добавлено
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {customWords.map(word => (
                    <div
                      key={word}
                      className="flex items-center justify-between bg-white/[0.02] px-4 py-3 rounded-2xl border border-white/5"
                    >
                      <span className="text-sm font-medium text-white/60 leading-snug flex-1 mr-3">{word}</span>
                      <button
                        onClick={() => handleRemove(word)}
                        className="text-white/15 hover:text-premium-red active:scale-90 transition-all shrink-0 p-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </PageWrapper>
  );
};