import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Save, Plus, Trash2, Settings as SettingsIcon, Database, RefreshCw } from 'lucide-react';
import { storageService, GameSettings } from '../services/storageService';
import { feedbackService } from '../services/feedbackService';
import { GameKey } from '../types/games';
import { PrimaryButton, GameCard, SectionLabel, IconButton, TextInput, PageWrapper, Typography, TabButton } from './UI';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'words'>('general');
  const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());
  const [selectedGame, setSelectedGame] = useState<GameKey>(GameKey.JustOne);
  const [newWord, setNewWord] = useState('');
  const [customWords, setCustomWords] = useState<string[]>(storageService.getCustomWords(selectedGame));
  const [usedWordsCount, setUsedWordsCount] = useState(storageService.getUsedWords(selectedGame).length);

  const toggleSetting = (key: keyof GameSettings) => {
    const newValue = !settings[key];
    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    
    if (key === 'vibration') feedbackService.vibrate(20);
    if (key === 'sounds') feedbackService.playSound('click');
  };

  const SettingToggle = ({ label, value, onToggle, description }: { label: string, value: boolean, onToggle: () => void, description: string }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[10px] text-gray-500 uppercase font-black">{description}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-premium-green' : 'bg-white/10'}`}
      >
        <motion.div 
          animate={{ x: value ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-lg" 
        />
      </button>
    </div>
  );

  const games: { id: GameKey; name: string }[] = [
    { id: GameKey.JustOne, name: 'Просто Слово' },
    { id: GameKey.Spy, name: 'Найди Шпиона' },
    { id: GameKey.Alias, name: 'Алиас' },
    { id: GameKey.FakeArtist, name: 'Арт-Обман' },
  ];

  const handleAddWord = () => {
    if (newWord.trim()) {
      storageService.addCustomWord(selectedGame, newWord.trim());
      setCustomWords(storageService.getCustomWords(selectedGame));
      setNewWord('');
    }
  };

  const handleRemoveWord = (word: string) => {
    storageService.removeCustomWord(selectedGame, word);
    setCustomWords(storageService.getCustomWords(selectedGame));
  };

  const handleResetUsed = () => {
    if (confirm('Вы уверены, что хотите сбросить список пройденных слов для этой игры?')) {
      storageService.resetUsedWords(selectedGame);
      setUsedWordsCount(0);
    }
  };

  const handleGameChange = (gameId: GameKey) => {
    setSelectedGame(gameId);
    setCustomWords(storageService.getCustomWords(gameId));
    setUsedWordsCount(storageService.getUsedWords(gameId).length);
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <IconButton icon={ArrowLeft} onClick={onBack} />
        <Typography.Heading>Настройки</Typography.Heading>
        <div className="w-12" />
      </div>

      <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
        <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
          Общие
        </TabButton>
        <TabButton active={activeTab === 'words'} onClick={() => setActiveTab('words')}>
          Слова
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' && (
          <motion.div 
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <GameCard title="Эффекты и Отклик">
              <div className="space-y-4 divide-y divide-white/5">
                <SettingToggle 
                  label="Визуальные эффекты"
                  description="Конфетти и анимации"
                  value={!!settings.visualEffects} 
                  onToggle={() => toggleSetting('visualEffects')} 
                />
                <SettingToggle 
                  label="Вибрация"
                  description="Тактильный отклик"
                  value={!!settings.vibration} 
                  onToggle={() => toggleSetting('vibration')} 
                />
                <SettingToggle 
                  label="Звуки"
                  description="Звуковые эффекты"
                  value={!!settings.sounds} 
                  onToggle={() => toggleSetting('sounds')} 
                />
              </div>
            </GameCard>

            <GameCard title="Хранилище">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-premium-green/10 rounded-xl flex items-center justify-center border border-premium-green/20">
                    <Database className="w-5 h-5 text-premium-green" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">LocalStorage</p>
                    <SectionLabel>Статус: Активно</SectionLabel>
                  </div>
                </div>
                <Typography.Description>
                  Ваши данные (игроки, пройденные слова, кастомные слова) сохраняются локально в браузере.
                </Typography.Description>
              </div>
            </GameCard>

            <GameCard title="Информация">
              <Typography.Description>
                Версия 1.1.0-beta<br/>
                <span className="text-gray-400">С любовью для вечеринок 🍻</span>
              </Typography.Description>
            </GameCard>
          </motion.div>
        )}

        {activeTab === 'words' && (
          <motion.div 
            key="words"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => handleGameChange(game.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selectedGame === game.id ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-gray-600'}`}
                >
                  {game.name}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionLabel>Сброс прогресса</SectionLabel>
                <button 
                  onClick={handleResetUsed}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20 active:scale-95 transition-transform"
                >
                  <RefreshCw className="w-3 h-3" />
                  Очистить ({usedWordsCount})
                </button>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4">
                <div className="flex gap-2">
                  <TextInput 
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Добавить свое слово..."
                  />
                  <IconButton
                    variant="filled"
                    icon={Plus}
                    onClick={handleAddWord}
                    className="w-14 h-14 shrink-0 rounded-2xl bg-premium-green text-black"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {customWords.length === 0 ? (
                    <Typography.Description className="text-center py-8 italic">Нет добавленных слов</Typography.Description>
                  ) : (
                    customWords.map(word => (
                      <div key={word} className="flex items-center justify-between bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                        <span className="text-sm font-medium">{word}</span>
                        <IconButton 
                          icon={Trash2}
                          onClick={() => handleRemoveWord(word)}
                          className="p-2 bg-transparent text-gray-600 hover:text-red-400"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};
