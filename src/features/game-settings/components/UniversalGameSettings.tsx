import { Target, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { GAMES_REGISTRY } from '@/entities/game/registry';
import type { GameKey, GameMode, GameSettingKey, GameSettingValue } from '@/entities/game/types';
import { contentService } from '@/services/contentService';
import { getTheme } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';
import { DIFFICULTY, type Difficulty, type GameModeOption } from '@/shared/types';

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
  <div>
    <div className="mb-6 flex items-center gap-3 px-1">
      <Icon className="h-4 w-4 text-white/20" />
      <span className="text-tag font-black tracking-[0.4em] text-white/80 uppercase">{label}</span>
    </div>
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <motion.button
            key={String(opt.value)}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChange(opt.value);
            }}
            className={`rounded-premium-md flex h-14 flex-col items-center justify-center border transition-all ${
              isActive
                ? getTheme(opt.color ?? color ?? 'green').activeOption
                : 'glass-card border-white/5 text-white/75'
            }`}
          >
            <span
              className={`text-card font-black tracking-tighter uppercase italic ${isActive ? '' : 'text-white/90'}`}
            >
              {opt.label}
            </span>
            {!!opt.sublabel && (
              <span
                className={`text-micro mt-0.5 font-bold tracking-widest uppercase ${isActive ? 'opacity-80' : 'text-white/20'}`}
              >
                {opt.sublabel}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────

interface UniversalGameSettingsProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  currentGameId?: GameKey;
  mode?: GameMode['id'];
  setMode?: (m: GameMode['id']) => void;
  modes?: GameModeOption[];
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
  modes = [] as GameModeOption[],
  settingValues,
  onSettingChange,
}) => {
  const gameDef = currentGameId ? GAMES_REGISTRY[currentGameId] : undefined;

  const getDiffSublabel = (d: Difficulty): string | undefined => {
    if (!currentGameId || !gameDef?.difficultySublabel) return undefined;
    const stats = contentService.getWordStats(currentGameId, d);
    return gameDef.difficultySublabel(d, stats.total > 0 ? stats.remaining : undefined);
  };

  const difficultyOptions: SettingOption[] = [
    {
      value: DIFFICULTY.EASY,
      label: 'ЛЕГКО',
      sublabel: getDiffSublabel(DIFFICULTY.EASY),
      color: 'green',
    },
    {
      value: DIFFICULTY.MEDIUM,
      label: 'НОРМА',
      sublabel: getDiffSublabel(DIFFICULTY.MEDIUM),
      color: 'sky',
    },
    {
      value: DIFFICULTY.HARD,
      label: 'ПРОФИ',
      sublabel: getDiffSublabel(DIFFICULTY.HARD),
      color: 'red',
    },
  ];

  return (
    <div className="mb-10 space-y-12">
      {gameDef?.hasDifficulty !== false && (
        <SettingRow
          label="Сложность"
          icon={Target}
          options={difficultyOptions}
          value={difficulty}
          onChange={(v) => {
            setDifficulty(v as Difficulty);
          }}
        />
      )}

      {modes.length > 0 && !!setMode && (
        <div>
          <div className="mb-6 flex items-center gap-3 px-1">
            <Zap className="h-4 w-4 text-white/20" />
            <span className="text-tag font-black tracking-[0.4em] text-white/80 uppercase">
              Мод
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {modes.map((m) => {
              const isActive = mode === m.id;
              return (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setMode(m.id);
                  }}
                  className={`rounded-premium-lg relative flex items-center gap-6 overflow-hidden border p-3 text-left transition-all ${
                    isActive
                      ? `${getTheme('green').bg10} ${getTheme('green').border40} shadow-premium-green/20 text-white`
                      : 'glass-card border-white/5 text-white/80'
                  }`}
                >
                  <div
                    className={`rounded-premium-md flex h-14 w-14 shrink-0 items-center justify-center transition-all ${
                      isActive
                        ? `${getTheme('green').solid} shadow-premium-green/20 text-white shadow-xl`
                        : 'bg-white/5 text-white/20'
                    }`}
                  >
                    <m.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-lg font-black tracking-tight text-white uppercase italic opacity-90">
                      {m.name}
                    </div>
                    <div className="text-xs leading-tight font-medium italic opacity-60">
                      {m.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
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
    </div>
  );
};
