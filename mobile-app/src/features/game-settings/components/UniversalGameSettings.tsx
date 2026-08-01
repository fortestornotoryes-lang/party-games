import { Target, Zap } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { GameKey, GameMode, GameSettingKey, GameSettingValue } from '@/entities/game/types';
import { useLocalizedGame } from '@/entities/game/useLocalizedGame';
import { contentService } from '@/features/word-stats/model/contentService';
import { GlassCard } from '@/shared/components/GlassCard';
import { useTranslation } from '@/shared/i18n';
import { getTheme, rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';
import { DIFFICULTY, type Difficulty } from '@/shared/types';

// ─── universal setting row ────────────────────────────────────────────────────

interface SettingOption {
  readonly value: string | GameSettingValue;
  readonly label: string;
  readonly sublabel?: string;
  readonly color?: GameTheme;
}

interface SettingRowProps {
  label: string;
  icon: LucideIcon;
  options: readonly SettingOption[];
  value: string | GameSettingValue;
  onChange: (v: string | GameSettingValue) => void;
  color?: GameTheme;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  color,
}) => (
  <View>
    <View className="mb-6 flex-row items-center gap-3 px-1">
      <Icon size={16} color="rgba(255,255,255,0.2)" />
      <Text
        className="text-tag font-black uppercase text-white/80"
        style={{ letterSpacing: 4 }}
      >
        {label}
      </Text>
    </View>
    <View className="flex-row gap-4">
      {options.map((opt) => {
        const isActive = value === opt.value;
        const activeTheme = getTheme(opt.color ?? color ?? 'green');
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => {
              onChange(opt.value);
            }}
            className="flex-1"
            style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
          >
            {isActive ? (
              <View
                className={`rounded-premium-md h-14 items-center justify-center border ${activeTheme.bg10} ${activeTheme.border40}`}
              >
                <Text
                  className={`text-card font-black uppercase italic ${activeTheme.text}`}
                  style={{ letterSpacing: -0.5 }}
                >
                  {opt.label}
                </Text>
                {!!opt.sublabel && (
                  <Text
                    className={`text-micro mt-0.5 font-bold uppercase opacity-80 ${activeTheme.text}`}
                    style={{ letterSpacing: 1 }}
                  >
                    {opt.sublabel}
                  </Text>
                )}
              </View>
            ) : (
              <GlassCard className="rounded-premium-md h-14 items-center justify-center border-white/5">
                <Text
                  className="text-card font-black uppercase italic text-white/90"
                  style={{ letterSpacing: -0.5 }}
                >
                  {opt.label}
                </Text>
                {!!opt.sublabel && (
                  <Text
                    className="text-micro mt-0.5 font-bold uppercase text-white/20"
                    style={{ letterSpacing: 1 }}
                  >
                    {opt.sublabel}
                  </Text>
                )}
              </GlassCard>
            )}
          </Pressable>
        );
      })}
    </View>
  </View>
);

// ─── main component ───────────────────────────────────────────────────────────

interface UniversalGameSettingsProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  currentGameId?: GameKey;
  mode?: GameMode['id'];
  setMode?: (m: GameMode['id']) => void;
  modes?: readonly GameMode[];
  /** Текущие значения настроек из схемы игры (GameMetadata.settings) */
  settingValues?: Partial<Record<GameSettingKey, GameSettingValue>>;
  onSettingChange?: (key: GameSettingKey, value: GameSettingValue) => void;
}

export const UniversalGameSettings: React.FC<UniversalGameSettingsProps> = ({
  difficulty,
  setDifficulty,
  currentGameId,
  mode,
  setMode,
  modes = [],
  settingValues,
  onSettingChange,
}) => {
  const { t } = useTranslation();
  const gameDef = useLocalizedGame(currentGameId);
  const green = getTheme('green');

  const getDiffSublabel = (d: Difficulty): string | undefined => {
    if (!currentGameId || !gameDef?.difficultySublabel) return undefined;
    const stats = contentService.getWordStats(currentGameId, d);
    return gameDef.difficultySublabel(d, stats.total > 0 ? stats.remaining : undefined, t);
  };

  const difficultyOptions: SettingOption[] = [
    {
      value: DIFFICULTY.EASY,
      label: t('common.difficultyShort.easy'),
      sublabel: getDiffSublabel(DIFFICULTY.EASY),
      color: 'green',
    },
    {
      value: DIFFICULTY.MEDIUM,
      label: t('common.difficultyShort.medium'),
      sublabel: getDiffSublabel(DIFFICULTY.MEDIUM),
      color: 'sky',
    },
    {
      value: DIFFICULTY.HARD,
      label: t('common.difficultyShort.hard'),
      sublabel: getDiffSublabel(DIFFICULTY.HARD),
      color: 'red',
    },
  ];

  return (
    <View className="mb-10 gap-12">
      {gameDef?.hasDifficulty !== false && (
        <SettingRow
          label={t('common.difficultyLabel')}
          icon={Target}
          options={difficultyOptions}
          value={difficulty}
          onChange={(v) => {
            setDifficulty(v as Difficulty);
          }}
        />
      )}

      {modes.length > 0 && !!setMode && (
        <View>
          <View className="mb-6 flex-row items-center gap-3 px-1">
            <Zap size={16} color="rgba(255,255,255,0.2)" />
            <Text
              className="text-tag font-black uppercase text-white/80"
              style={{ letterSpacing: 4 }}
            >
              {t('common.modeLabel')}
            </Text>
          </View>
          <View className="gap-4">
            {modes.map((m) => {
              const isActive = mode === m.id;
              const ModeIcon = m.icon;
              const iconBox = (
                <View
                  className={`rounded-premium-md h-14 w-14 shrink-0 items-center justify-center ${
                    isActive ? green.solid : 'bg-white/5'
                  }`}
                >
                  <ModeIcon size={28} color={isActive ? '#fff' : 'rgba(255,255,255,0.2)'} />
                </View>
              );
              const textBox = (
                <View className="min-w-0 flex-1">
                  <Text
                    className="mb-1 text-lg font-black uppercase italic text-white opacity-90"
                    style={{ letterSpacing: -0.3 }}
                  >
                    {m.name}
                  </Text>
                  <Text className="text-xs font-medium italic leading-4 text-white/60">
                    {m.description}
                  </Text>
                </View>
              );
              return (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    setMode(m.id);
                  }}
                  style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
                >
                  {isActive ? (
                    <View
                      className={`rounded-premium-lg flex-row items-center gap-6 border p-3 ${green.bg10} ${green.border40}`}
                      style={{
                        shadowColor: rgba('green', 0.4),
                        shadowOpacity: 0.5,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 5,
                      }}
                    >
                      {iconBox}
                      {textBox}
                    </View>
                  ) : (
                    <GlassCard className="rounded-premium-lg border-white/5 p-3">
                      <View className="flex-row items-center gap-6">
                        {iconBox}
                        {textBox}
                      </View>
                    </GlassCard>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {!!onSettingChange &&
        gameDef?.settings?.map((setting) => (
          <SettingRow
            key={setting.key}
            label={setting.label}
            icon={setting.icon}
            color={setting.color}
            options={setting.options}
            value={settingValues?.[setting.key] ?? setting.options[0].value}
            onChange={(v) => {
              onSettingChange(setting.key, v as GameSettingValue);
            }}
          />
        ))}
    </View>
  );
};
