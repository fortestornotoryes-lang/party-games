import React, {useEffect} from 'react';
import {motion} from 'motion/react';
import {Users, ChevronRight} from 'lucide-react';

import {storageService} from '../services/storageService';
import {useGameSettings} from '../contexts/GameSettingsContext';
import {JUST_ONE_WORDS} from '../constants/justOneContent';
import {ALIAS_CATEGORIES} from '../constants/aliasContent';
import {LOCATIONS_DATA} from '../constants/spyHuntContent';
import {WAVELENGTH_CATEGORIES} from '../constants/wavelengthContent';
import {FAKE_ARTIST_DATA_BY_DIFFICULTY} from '../constants/fakeArtistContent';
import {GAMES_REGISTRY} from '../registry/GameRegistry';

interface MainMenuProps {
    onSelectGame: (gameId: string) => void;
}

const themeConfigs = {
    'premium-red': {
        iconBg: 'bg-premium-red',
        accentBg: 'bg-premium-red/10',
        accentText: 'text-premium-red',
        barColor: 'bg-premium-red',
    },
    'premium-sky': {
        iconBg: 'bg-premium-sky',
        accentBg: 'bg-premium-sky/10',
        accentText: 'text-premium-sky',
        barColor: 'bg-premium-sky',
    },
    'premium-green': {
        iconBg: 'bg-premium-green',
        accentBg: 'bg-premium-green/10',
        accentText: 'text-premium-green',
        barColor: 'bg-premium-green',
    },
    'premium-blue': {
        iconBg: 'bg-premium-blue',
        accentBg: 'bg-premium-blue/10',
        accentText: 'text-premium-blue',
        barColor: 'bg-premium-blue',
    },
    'premium-orange': {
        iconBg: 'bg-premium-orange',
        accentBg: 'bg-premium-orange/10',
        accentText: 'text-premium-orange',
        barColor: 'bg-premium-orange',
    },
    'premium-purple': {
        iconBg: 'bg-premium-purple',
        accentBg: 'bg-premium-purple/10',
        accentText: 'text-premium-purple',
        barColor: 'bg-premium-purple',
    },
    'premium-yellow': {
        iconBg: 'bg-premium-yellow',
        accentBg: 'bg-premium-yellow/10',
        accentText: 'text-premium-yellow',
        barColor: 'bg-premium-yellow',
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
        <div className="min-h-screen pt-6 pb-28 px-5 relative flex flex-col items-center">
            <div className="w-full max-w-md relative z-10">

                {/* Logo */}
                <motion.div
                    initial={{opacity: 0, y: -14}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.35, ease: [0.25, 0.1, 0.25, 1]}}
                    className="text-center px-4 mb-10"
                >
                    <h1 className="text-[56px] font-black italic tracking-tighter uppercase leading-[0.72] mb-3 select-none font-display">
                        PARTY{' '}
                        <span
                            className="text-premium-red"
                            style={{textShadow: '0 0 32px rgba(255,46,77,0.45)'}}
                        >
                            HUB
                        </span>
                    </h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">
                        {GAMES.length} ИГР · ВЕЧЕРИНКА НАЧИНАЕТСЯ
                    </p>
                </motion.div>

                {/* Game List */}
                <div className="space-y-3">
                    {GAMES.map((game, index) => {
                        const Icon = game.icon;
                        const stats = getGameStats(game.id);
                        const themeCfg = getThemeConfig(game.theme);
                        const countDisplay = stats ? `${stats.remaining} / ${stats.total}` : null;

                        return (
                            <motion.button
                                key={game.id}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{
                                    delay: 0.08 + index * 0.04,
                                    duration: 0.28,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                                whileTap={{scale: 0.975}}
                                onClick={() => onSelectGame(game.id)}
                                className="w-full p-4 rounded-[20px] flex items-center gap-4 text-left relative overflow-hidden
                                    transition-all duration-300 group
                                    bg-white/[0.035] border border-white/[0.07]
                                    hover:bg-white/[0.06] hover:border-white/[0.12]"
                                style={{boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'}}
                            >
                                {/* Left color accent bar */}
                                <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${themeCfg.barColor} opacity-75`} />

                                {/* Icon */}
                                <div className={`w-[52px] h-[52px] rounded-[16px] ${themeCfg.iconBg} flex items-center justify-center relative overflow-hidden shrink-0 ml-2.5`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/25" />
                                    <Icon className="w-[22px] h-[22px] text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[17px] font-black italic uppercase tracking-tight leading-none mb-1.5 text-white">
                                        {game.title}
                                    </h3>
                                    <p className="text-[12px] text-white/45 font-medium leading-snug mb-2.5 pr-1">
                                        {game.subtitle}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[8px] ${themeCfg.accentBg} ${themeCfg.accentText} border border-current/25 text-[9px] font-black uppercase tracking-[0.15em]`}>
                                            <Users className="w-[10px] h-[10px]" />
                                            {game.players}
                                        </span>
                                        {countDisplay && (
                                            <span className="inline-flex items-center px-2.5 py-[5px] rounded-[8px] bg-white/[0.04] text-white/25 border border-white/[0.06] text-[9px] font-black uppercase tracking-[0.12em]">
                                                {countDisplay}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <ChevronRight className="w-[14px] h-[14px] text-white/15 shrink-0 transition-all duration-300 group-hover:text-white/35 group-hover:translate-x-0.5" />
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
