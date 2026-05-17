import React, {useEffect} from 'react';
import {motion} from 'motion/react';
import {Shield, Zap, Users, Brain, Palette, RotateCcw, Pencil, Lightbulb, PartyPopper, Grid, Key} from 'lucide-react';

import {storageService} from '../services/storageService';
import {useGameSettings} from '../contexts/GameSettingsContext';
import {JUST_ONE_WORDS} from '../constants/justOneContent';
import {ALIAS_CATEGORIES} from '../constants/aliasContent';
import {LOCATIONS_DATA} from '../constants/spyHuntContent';
import {WAVELENGTH_CATEGORIES} from '../constants/wavelengthContent';
import {FAKE_ARTIST_DATA_BY_DIFFICULTY} from '../constants/fakeArtistContent';
import {GAMES_REGISTRY} from '../registry/GameRegistry';
import {GameMetadata} from '../types';

interface MainMenuProps {
    onSelectGame: (gameId: string) => void;
}

const themeConfigs = {
    'premium-red': {
        iconBg: 'bg-premium-red',
        iconShadow: 'shadow-premium-red/50',
        hoverBorder: 'hover:border-premium-red/40',
        accentBg: 'bg-premium-red/10',
        accentText: 'text-premium-red',
    },
    'premium-sky': {
        iconBg: 'bg-premium-sky',
        iconShadow: 'shadow-premium-sky/50',
        hoverBorder: 'hover:border-premium-sky/40',
        accentBg: 'bg-premium-sky/10',
        accentText: 'text-premium-sky',
    },
    'premium-green': {
        iconBg: 'bg-premium-green',
        iconShadow: 'shadow-premium-green/50',
        hoverBorder: 'hover:border-premium-green/40',
        accentBg: 'bg-premium-green/10',
        accentText: 'text-premium-green',
    },
    'premium-blue': {
        iconBg: 'bg-premium-blue',
        iconShadow: 'shadow-premium-blue/50',
        hoverBorder: 'hover:border-premium-blue/40',
        accentBg: 'bg-premium-blue/10',
        accentText: 'text-premium-blue',
    },
    'premium-orange': {
        iconBg: 'bg-premium-orange',
        iconShadow: 'shadow-premium-orange/50',
        hoverBorder: 'hover:border-premium-orange/40',
        accentBg: 'bg-premium-orange/10',
        accentText: 'text-premium-orange',
    },
    'premium-purple': {
        iconBg: 'bg-premium-purple',
        iconShadow: 'shadow-premium-purple/50',
        hoverBorder: 'hover:border-premium-purple/40',
        accentBg: 'bg-premium-purple/10',
        accentText: 'text-premium-purple',
    },
    'premium-yellow': {
        iconBg: 'bg-premium-yellow',
        iconShadow: 'shadow-premium-yellow/50',
        hoverBorder: 'hover:border-premium-yellow/40',
        accentBg: 'bg-premium-yellow/10',
        accentText: 'text-premium-yellow',
    },
} as const;

const getThemeConfig = (theme: string) => {
    const key = `premium-${theme}` as keyof typeof themeConfigs;
    return themeConfigs[key] || themeConfigs['premium-red'];
};

const GAMES = Object.values(GAMES_REGISTRY);


export const MainMenu: React.FC<MainMenuProps> = ({onSelectGame}) => {
    const {setCurrentGameId} = useGameSettings();

    useEffect(() => {
        setCurrentGameId(null);
    }, []);

    const getGameStats = (gameId: string) => {
        let total = 0;
        const custom = storageService.getCustomWords(gameId).length;
        const used = storageService.getUsedWords(gameId).length;

        switch (gameId) {
            case 'just_one':
                total = JUST_ONE_WORDS.length + custom;
                break;
            case 'alias':
                total = ALIAS_CATEGORIES.flatMap(c => c.words).length + custom;
                break;
            case 'spy':
                total = LOCATIONS_DATA.length + custom;
                break;
            case 'wavelength':
                total = WAVELENGTH_CATEGORIES.length + custom;
                break;
            case 'fake_artist':
                total = Object.values(FAKE_ARTIST_DATA_BY_DIFFICULTY).flat().length + custom;
                break;
            default:
                return null;
        }

        return {total, remaining: Math.max(0, total - used)};
    };

    return (
        <div className="min-h-screen pt-6 pb-24 px-6 relative overflow-hidden flex flex-col items-center">
            <div className="w-full max-w-md relative z-10">

                <motion.div
                    initial={{opacity: 0, y: -16}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4}}
                    className="text-center px-4"
                >
                    <h1 className="text-[58px] font-black italic tracking-tighter uppercase leading-[0.7] mb-8 select-none">
                        PARTY <span className="text-premium-red">HUB</span>
                    </h1>
                </motion.div>

                <div className="space-y-6">
                    {GAMES.map((game) => {
                        const Icon = game.icon;
                        const stats = getGameStats(game.id);
                        const themeCfg = getThemeConfig(game.theme);
                        const countDisplay = stats ? `${stats.remaining} / ${stats.total}` : (game.id === 'mafia' ? '0 / ∞' : '');

                        return (
                            <motion.button
                                key={game.id}
                                whileTap={{scale: 0.98}}
                                onClick={() => onSelectGame(game.id)}
                                className="w-full p-6 glass-card rounded-premium-lg flex items-center gap-6 text-left relative group overflow-hidden transition-all duration-500 bg-white/[0.01] backdrop-blur-3xl 0 hover:bg-white/[0.06]"
                            >
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-[24px] font-black italic uppercase tracking-tighter leading-none text-white group-hover:text-white transition-colors">{game.title}</h3>

                                    </div>

                                    <p className="text-sm text-white/60 font-medium leading-relaxed mb-5 max-w-[90%]">
                                        {game.description}
                                    </p>

                                    <div
                                        className={`inline-flex self-start items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-premium-sm  opacity-80`}>
                                        <div
                                            className={`${themeCfg.accentBg} ${themeCfg.accentText}  border border-current flex  gap-2  p-2 rounded-premium-sm`}>
                                            <Users className="w-3.5 h-3.5"/>
                                            <span>{game.players}</span>
                                        </div>
                                        {countDisplay && (
                                            <div
                                                className={`${themeCfg.accentBg} ${themeCfg.accentText}  border border-current flex  gap-2  p-2 rounded-premium-sm`}>
                                                    <span
                                                        className="text-[10px] font-black  uppercase tracking-[0.2em]">{countDisplay}</span>
                                            </div>
                                        )}

                                    </div>
                                </div>

                                <div className="relative shrink-0">
                                    <div
                                        className={`w-20 h-20 rounded-3xl ${themeCfg.iconBg} flex items-center justify-center relative overflow-hidden`}>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"/>
                                        <Icon
                                            className="w-10 h-10 text-white relative z-20 transition-transform duration-500 group-hover:scale-110"/>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
