import type {LucideIcon} from 'lucide-react';
import {Clock, Shield, Target, Zap} from 'lucide-react';
import {motion} from 'motion/react';
import React from 'react';

import {contentService} from '../services/contentService';
import {GameKey, type GameMode} from '../types/games';

import {DIFFICULTY_CONFIG as TELESTRATIONS_DIFFICULTY_CONFIG} from '@/constants/telestrationsContent';
import {ALIAS_DIFFICULTY_CONFIG} from "@/games/AliasGame/constants.ts";
import {MEMO_RISK_DIFFICULTY_CONFIG} from "@/games/MemoRiskGame/constants.ts";
import {GAME_DURATION_BY_DIFFICULTY} from "@/games/SpyHuntGame/constants.ts";
import {getTheme} from '@/shared/theme/colors';
import {DIFFICULTY, type Difficulty, type GameModeOption} from '@/shared/types';

// ─── universal setting row ────────────────────────────────────────────────────

type OptionColor = 'green' | 'sky' | 'red' | 'orange' | 'purple';

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
    onChange: (v: string | number) => void;
    color?: OptionColor;
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
        <div className="flex items-center gap-3 mb-6 px-1">
            <Icon className="w-4 h-4 text-white/20"/>
            <span className="text-tag font-black uppercase tracking-[0.4em] text-white/80">
        {label}
      </span>
        </div>
        <div className="grid gap-4" style={{gridTemplateColumns: `repeat(${options.length}, 1fr)`}}>
            {options.map((opt) => {
                const isActive = value === opt.value;
                return (
                    <motion.button
                        key={opt.value}
                        whileTap={{scale: 0.95}}
                        onClick={() => {
                            onChange(opt.value);
                        }}
                        className={`flex flex-col items-center justify-center rounded-premium-md transition-all border h-14 ${
                            isActive
                                ? getTheme(opt.color ?? color ?? 'green').activeOption
                                : 'glass-card border-white/5 text-white/75'
                        }`}
                    >
            <span
                className={`text-card font-black italic uppercase tracking-tighter ${isActive ? '' : 'text-white/90'}`}
            >
              {opt.label}
            </span>
                        {!!opt.sublabel && (
                            <span
                                className={`text-micro font-bold uppercase tracking-widest mt-0.5 ${isActive ? 'opacity-80' : 'text-white/20'}`}
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
    rounds?: number;
    setRounds?: (r: number) => void;
    timerSeconds?: number;
    setTimerSeconds?: (s: number) => void;
    countHiddenTraits?: boolean;
    setCountHiddenTraits?: (v: boolean) => void;
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
                                                                                countHiddenTraits,
                                                                                setCountHiddenTraits,
                                                                                modes = [] as GameModeOption[],
                                                                                difficultyLabel = '',
                                                                                modeLabel,
                                                                            }) => {
    const getRemainingWords = (d: Difficulty): number | undefined => {
        if (!currentGameId) return undefined;
        const stats = contentService.getWordStats(currentGameId, d);
        return stats.total > 0 ? stats.remaining : undefined;
    };

    const getDiffSublabel = (d: Difficulty): string | undefined => {
        const remaining = getRemainingWords(d);

        switch (currentGameId) {
            case GameKey.Telestrations: {
                const cfg = TELESTRATIONS_DIFFICULTY_CONFIG[d];
                const timeStr = `${cfg.drawTime}с / ${cfg.guessTime}с`;
                return remaining !== undefined ? `${timeStr} · ${remaining}` : timeStr;
            }
            case GameKey.Spy: {
                const mins = Math.floor(GAME_DURATION_BY_DIFFICULTY[d] / 60);
                return remaining !== undefined ? `${mins} мин · ${remaining}` : `${mins} мин`;
            }
            case GameKey.Alias: {
                const {roundTime} = ALIAS_DIFFICULTY_CONFIG[d];
                return remaining !== undefined ? `${roundTime} сек · ${remaining}` : `${roundTime} сек`;
            }
            case GameKey.MemoRisk: {
                const {gridSize, shapeCount} = MEMO_RISK_DIFFICULTY_CONFIG[d];
                return `${gridSize}×${gridSize} · ${shapeCount} фиг.`;
            }
            case GameKey.TruthOrDare:
            case GameKey.TabooReverse:
            case GameKey.Taboo:
                return remaining !== undefined ? `${remaining} карт` : undefined;
            case GameKey.FakeArtist:
            case GameKey.Wavelength:
            case GameKey.JustOne:
            case GameKey.Codenames:
            case GameKey.Decrypto:
                return remaining !== undefined ? `${remaining} сл` : undefined;
            default:
                return undefined;
        }
    };

    const difficultyOptions: SettingOption[] = [
        {value: DIFFICULTY.EASY, label: 'ЛЕГКО', sublabel: getDiffSublabel(DIFFICULTY.EASY), color: 'green'},
        {value: DIFFICULTY.MEDIUM, label: 'НОРМА', sublabel: getDiffSublabel(DIFFICULTY.MEDIUM), color: 'sky'},
        {value: DIFFICULTY.HARD, label: 'ПРОФИ', sublabel: getDiffSublabel(DIFFICULTY.HARD), color: 'red'},
    ];

    const hideDifficulty =
        currentGameId === GameKey.Millionaire ||
        currentGameId === GameKey.Corridor ||
        currentGameId === GameKey.ConnectFour;

    return (
        <div className="space-y-12 mb-10">
            {!hideDifficulty && (
                <SettingRow
                    label='Сложность'
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
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <Zap className="w-4 h-4 text-white/20"/>
                        <span className="text-tag font-black uppercase tracking-[0.4em] text-white/80">
             Мод
            </span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {modes.map((m) => {
                            const isActive = mode === m.id;
                            return (
                                <motion.button
                                    key={m.id}
                                    whileTap={{scale: 0.90}}
                                    onClick={() => {
                                        setMode(m.id);
                                    }}
                                    className={`p-3 rounded-premium-lg border transition-all text-left flex items-center gap-6 relative overflow-hidden ${
                                        isActive
                                            ? `${getTheme('green').bg10} ${getTheme('green').border40} text-white shadow-premium-green/20`
                                            : 'glass-card border-white/5 text-white/80'
                                    }`}
                                >
                                    <div
                                        className={`w-14 h-14 shrink-0 rounded-premium-md flex items-center justify-center transition-all ${
                                            isActive
                                                ? `${getTheme('green').solid} text-white shadow-xl shadow-premium-green/20`
                                                : 'bg-white/5 text-white/20'
                                        }`}
                                    >
                                        <m.icon className="w-7 h-7"/>
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className="text-lg font-black italic uppercase tracking-tight mb-1 text-white opacity-90">
                                            {m.name}
                                        </div>
                                        <div className="text-xs font-medium leading-tight opacity-60 italic">
                                            {m.description}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}

            {currentGameId === GameKey.Bunker && !!setRounds && (
                <SettingRow
                    label="Раунды раскрытия"
                    icon={Shield}
                    color="orange"
                    value={rounds ?? 5}
                    onChange={(v) => {
                        setRounds(v as number);
                    }}
                    options={[
                        {value: 3, label: '3 РАУНДА', sublabel: 'быстро'},
                        {value: 5, label: '5 РАУНДОВ', sublabel: 'стандарт'},
                        {value: 7, label: '7 РАУНДОВ', sublabel: 'полная'},
                    ]}
                />
            )}

            {currentGameId === GameKey.Bunker && !!setCountHiddenTraits && (
                <SettingRow
                    label="Расчёт выживания"
                    icon={Target}
                    color="orange"
                    value={countHiddenTraits ? 'all' : 'revealed'}
                    onChange={(v) => { setCountHiddenTraits(v === 'all'); }}
                    options={[
                        {value: 'all',      label: 'ВСЕ ЧЕРТЫ',   sublabel: 'включая скрытые'},
                        {value: 'revealed', label: 'РАСКРЫТЫЕ',   sublabel: 'только показанные'},
                    ]}
                />
            )}

            {currentGameId === GameKey.FakeArtist && !!setRounds && (
                <SettingRow
                    label="Раунды"
                    icon={Shield}
                    color="green"
                    value={rounds ?? 2}
                    onChange={(v) => {
                        setRounds(v as number);
                    }}
                    options={[1, 2, 3].map((r) => ({
                        value: r,
                        label: `${r} ${r === 1 ? 'КРУГ' : 'КРУГА'}`,
                    }))}
                />
            )}

            {currentGameId === GameKey.FakeArtist && !!setTimerSeconds && (
                <SettingRow
                    label="Таймер хода"
                    icon={Zap}
                    color="green"
                    value={timerSeconds ?? 0}
                    onChange={(v) => {
                        setTimerSeconds(v as number);
                    }}
                    options={[
                        {value: 0, label: '∞'},
                        {value: 15, label: '15 СЕК'},
                        {value: 30, label: '30 СЕК'},
                    ]}
                />
            )}

            {(currentGameId === GameKey.TabooReverse || currentGameId === GameKey.Taboo) && !!setTimerSeconds && (
                <SettingRow
                    label="Время раунда"
                    icon={Clock}
                    color={currentGameId === GameKey.Taboo ? 'red' : 'orange'}
                    value={timerSeconds ?? 60}
                    onChange={(v) => {
                        setTimerSeconds(v as number);
                    }}
                    options={[
                        {value: 30, label: '30 СЕК'},
                        {value: 45, label: '45 СЕК'},
                        {value: 60, label: '60 СЕК'},
                        {value: 90, label: '90 СЕК'},
                    ]}
                />
            )}
        </div>
    );
};
