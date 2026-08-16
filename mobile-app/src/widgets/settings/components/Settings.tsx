import { ArrowLeft, Database, WholeWord } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/shared/components/GlassCard';
import { IconButton } from '@/shared/components/IconButton';
import { SectionLabel } from '@/shared/components/SectionLabel';
import { TabButton } from '@/shared/components/TabButton';
import { Typography } from '@/shared/components/Typography';
import { useLanguage } from '@/shared/i18n';
import { storageService } from '@/shared/services/storageService';
import type { GameSettings } from '@/shared/services/storageService';

interface SettingsProps {
  onBack: () => void;
}

// ─── sub-components ───────────────────────────────────────────────────────────

const SettingToggle: React.FC<{
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}> = ({ label, description, value, onToggle }) => (
  <View className="flex-row items-center justify-between py-3">
    <View className="min-w-0 flex-1 pr-4">
      <Text className="text-sm font-bold text-white/80">{label}</Text>
      <Text
        className="text-tag mt-0.5 font-black uppercase text-white/25"
        style={{ letterSpacing: 1 }}
      >
        {description}
      </Text>
    </View>
    <Pressable
      onPress={onToggle}
      className={`h-6 w-12 rounded-full p-1 ${value ? 'bg-premium-green' : 'bg-white/10'}`}
    >
      <MotiView
        animate={{ translateX: value ? 24 : 0 }}
        transition={{ type: 'timing', duration: 180 }}
        className="h-4 w-4 rounded-full bg-white"
      />
    </Pressable>
  </View>
);

// ─── component ────────────────────────────────────────────────────────────────

/**
 * Экран настроек. Вкладка «Слова» (кастомные слова, статистика пулов)
 * появится вместе с переносом контент-модулей игр (этапы 4–6) — сейчас заглушка.
 */
export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'general' | 'words'>('general');
  const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());
  const { t, lang, setLang } = useLanguage();

  const toggleSetting = (key: 'visualEffects' | 'vibration' | 'sounds') => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    storageService.saveSettings({ [key]: next[key] });
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 48,
        paddingHorizontal: 24,
      }}
    >
      <View className="mx-auto w-full max-w-md">
        {/* Шапка */}
        <View className="mb-8 flex-row items-center justify-between">
          <IconButton icon={ArrowLeft} onClick={onBack} />
          <Typography.Heading>{t('settingsPage.title')}</Typography.Heading>
          <View className="w-12" />
        </View>

        {/* Вкладки */}
        <View className="rounded-premium-md mb-8 flex-row bg-white/5 p-1">
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
        </View>

        <AnimatePresence exitBeforeEnter>
        {activeTab === 'general' && (
          <MotiView
            key="general"
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: 'timing', duration: 200 }}
            className="gap-6"
          >
            <GlassCard className="rounded-premium-xl border-white/5 p-6">
              <SectionLabel className="mb-5">{t('settingsPage.effectsSection')}</SectionLabel>
              <SettingToggle
                label={t('settingsPage.visualEffects')}
                description={t('settingsPage.visualEffectsDesc')}
                value={!!settings.visualEffects}
                onToggle={() => {
                  toggleSetting('visualEffects');
                }}
              />
              <View className="h-px bg-white/5" />
              <SettingToggle
                label={t('settingsPage.vibration')}
                description={t('settingsPage.vibrationDesc')}
                value={!!settings.vibration}
                onToggle={() => {
                  toggleSetting('vibration');
                }}
              />
              <View className="h-px bg-white/5" />
              <SettingToggle
                label={t('settingsPage.sounds')}
                description={t('settingsPage.soundsDesc')}
                value={!!settings.sounds}
                onToggle={() => {
                  toggleSetting('sounds');
                }}
              />
            </GlassCard>

            <GlassCard className="rounded-premium-xl border-white/5 p-6">
              <SectionLabel className="mb-5">Язык / Language</SectionLabel>
              <View className="flex-row gap-2">
                {(['ru', 'en'] as const).map((l) => (
                  <Pressable
                    key={l}
                    onPress={() => {
                      setLang(l);
                    }}
                    className={`rounded-premium-md flex-1 items-center border py-3 ${
                      lang === l ? 'border-white/25 bg-white/15' : 'border-white/5 bg-white/5'
                    }`}
                  >
                    <Text
                      className={`text-xs font-black uppercase ${
                        lang === l ? 'text-white' : 'text-white/30'
                      }`}
                      style={{ letterSpacing: 0.8 }}
                    >
                      {l === 'ru' ? 'Русский' : 'English'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </GlassCard>

            <GlassCard className="rounded-premium-xl border-white/5 p-6">
              <SectionLabel className="mb-4">{t('settingsPage.storageSection')}</SectionLabel>
              <View className="mb-3 flex-row items-center gap-3">
                <View className="bg-premium-green/10 rounded-premium-sm border-premium-green/20 h-10 w-10 items-center justify-center border">
                  <Database size={20} color="rgb(0,216,138)" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-white/80">MMKV</Text>
                  <Text
                    className="text-tag text-premium-green font-black uppercase"
                    style={{ letterSpacing: 1 }}
                  >
                    {t('settingsPage.storageActive')}
                  </Text>
                </View>
              </View>
              <Text className="text-xs leading-5 text-white/30">{t('settingsPage.storageDesc')}</Text>
            </GlassCard>

            <GlassCard className="rounded-premium-xl border-white/5 p-6">
              <SectionLabel className="mb-2">{t('settingsPage.aboutSection')}</SectionLabel>
              <Text className="text-xs leading-5 text-white/30">{t('settingsPage.aboutText')}</Text>
            </GlassCard>
          </MotiView>
        )}

        {activeTab === 'words' && (
          <MotiView
            key="words"
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: 'timing', duration: 200 }}
          >
            {/* TODO(этапы 4–6): полный редактор кастомных слов после переноса контент-модулей игр */}
            <GlassCard className="rounded-premium-xl items-center border-white/5 p-10">
              <WholeWord size={32} color="rgba(255,255,255,0.15)" />
              <Text className="mt-4 text-center text-sm font-medium leading-6 text-white/30">
                {lang === 'ru'
                  ? 'Редактор слов появится вместе с переносом игр'
                  : 'Word editor arrives with the games port'}
              </Text>
            </GlassCard>
          </MotiView>
        )}
        </AnimatePresence>
      </View>
    </ScrollView>
  );
};
