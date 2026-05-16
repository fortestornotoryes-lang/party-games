import React from 'react';
import { motion } from 'motion/react';
import { SectionLabel } from './UI';
import { Difficulty, GameMode, GameModeOption } from '../types';
import { Shield, Zap, Target, LucideIcon } from 'lucide-react';

// ─── universal setting row ────────────────────────────────────────────────────

const colorStyles = {
  green:  'bg-premium-green/10  border-premium-green/40  text-premium-green  shadow-[0_0_20px_rgba(0,216,138,0.12)]',
  sky:    'bg-premium-sky/10    border-premium-sky/40    text-premium-sky    shadow-[0_0_20px_rgba(31,182,255,0.12)]',
  red:    'bg-premium-red/10    border-premium-red/40    text-premium-red    shadow-[0_0_20px_rgba(255,46,77,0.12)]',
  orange: 'bg-premium-orange/10 border-premium-orange/40 text-premium-orange shadow-[0_0_20px_rgba(255,138,31,0.12)]',
  purple: 'bg-premium-purple/10 border-premium-purple/40 text-premium-purple shadow-[0_0_20px_rgba(199,123,255,0.12)]',
} as const;

type OptionColor = keyof typeof colorStyles;

interface SettingOption {
  value: string | number;
  label: string;
  sublabel?: string;
  color?: OptionColor;
}

interface SettingRowProps {
  label: string;
  icon: LucideIcon;
  options: SettingOption[];
  value: string | number;
  onChange: (v: any) => void;
  color?: OptionColor;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, icon: Icon, options, value, onChange, color = 'green' }) => (
  <div>
    <div className="flex items-center gap-3 mb-6 px-1">
      <Icon className="w-4 h-4 text-white/20" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">{label}</span>
    </div>
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center justify-center rounded-premium-md transition-all border h-14 ${
              isActive
                ? colorStyles[opt.color ?? color]
                : 'glass-card border-white/5 text-white/20 opacity-60'
            }`}
          >
            <span className={`text-[13px] font-black italic uppercase tracking-tighter ${isActive ? '' : 'text-white/80'}`}>
              {opt.label}
            </span>
            {opt.sublabel && (
              <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isActive ? 'opacity-80' : 'text-white/20'}`}>
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
  currentGameId?: string;
  mode?: GameMode;
  setMode?: (m: GameMode) => void;
  rounds?: number;
  setRounds?: (r: number) => void;
  timerSeconds?: number;
  setTimerSeconds?: (s: number) => void;
  modes?: GameModeOption[];
  difficultyLabel?: string;
  modeLabel?: string;
}

export const UniversalGameSettings: React.FC<UniversalGameSettingsProps> = ({
  difficulty,
  setDifficulty,
  currentGameId,
  mode,
  setMode,
  rounds,
  setRounds,
  timerSeconds,
  setTimerSeconds,
  modes = [],
  difficultyLabel = 'Сложность',
  modeLabel = 'Режим игры',
}) => {
  const getDiffSublabel = (d: Difficulty): string | undefined => {
    switch (currentGameId) {
      case 'telestrations': return d === 'easy' ? '90с / 45с' : d === 'medium' ? '60с / 30с' : '45с / 25с';
      case 'spy':           return d === 'easy' ? '10 мин'    : d === 'medium' ? '8 мин'     : '5 мин';
      case 'alias':         return d === 'easy' ? '90 сек'    : d === 'medium' ? '60 сек'    : '40 сек';
      default: return undefined;
    }
  };

  const difficultyOptions: SettingOption[] = [
    { value: 'easy',   label: 'ЛЕГКО', sublabel: getDiffSublabel('easy'),   color: 'green' },
    { value: 'medium', label: 'НОРМА', sublabel: getDiffSublabel('medium'), color: 'sky'   },
    { value: 'hard',   label: 'ПРОФИ', sublabel: getDiffSublabel('hard'),   color: 'red'   },
  ];

  return (
    <div className="space-y-12 mb-10">
      <SettingRow
        label={difficultyLabel}
        icon={Target}
        options={difficultyOptions}
        value={difficulty}
        onChange={setDifficulty}
      />

      {modes.length > 0 && setMode && (
        <div>
          <div className="flex items-center gap-3 mb-6 px-1">
            <Zap className="w-4 h-4 text-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">{modeLabel}</span>
          </div>
          <div className="flex flex-col gap-4">
            {modes.map((m) => {
              const isActive = mode === m.id;
              return (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode(m.id)}
                  className={`p-6 rounded-premium-lg border transition-all text-left flex items-center gap-6 relative overflow-hidden ${
                    isActive
                      ? 'bg-premium-red/10 border-premium-red/40 text-white shadow-[0_0_30px_rgba(255,46,77,0.15)]'
                      : 'glass-card border-white/5 text-white/80'
                  }`}
                >
                  <div className={`w-14 h-14 shrink-0 rounded-[18px] flex items-center justify-center transition-all ${
                    isActive ? 'bg-premium-red text-white shadow-xl shadow-premium-red/20' : 'bg-white/5 text-white/20'
                  }`}>
                    <m.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[17px] font-black italic uppercase tracking-tight mb-1 text-white opacity-90">{m.name}</div>
                    <div className="text-[12px] font-medium leading-tight opacity-60 italic">{m.desc}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {currentGameId === 'fake_artist' && setRounds && (
        <SettingRow
          label="Раунды"
          icon={Shield}
          color="green"
          value={rounds ?? 2}
          onChange={setRounds}
          options={[1, 2, 3].map(r => ({ value: r, label: `${r} ${r === 1 ? 'КРУГ' : 'КРУГА'}` }))}
        />
      )}

      {currentGameId === 'fake_artist' && setTimerSeconds && (
        <SettingRow
          label="Таймер хода"
          icon={Zap}
          color="green"
          value={timerSeconds ?? 0}
          onChange={setTimerSeconds}
          options={[
            { value: 0,  label: '∞' },
            { value: 15, label: '15 СЕК' },
            { value: 30, label: '30 СЕК' },
          ]}
        />
      )}
    </div>
  );
};
