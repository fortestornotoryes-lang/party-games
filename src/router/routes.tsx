import {Settings as SettingsIcon} from 'lucide-react';
import {Suspense} from 'react';
import {createBrowserRouter, Navigate, Outlet, ScrollRestoration, useNavigate} from 'react-router';

import {MainMenu} from '../components/MainMenu';
import {Settings} from '../components/Settings';
import {useGameSettings} from '../contexts/GameSettingsContext';
import type {GameKey} from '../types/games';

import {GameLayout} from './GameLayout';
import {GamePlayRoute} from './GamePlayRoute';
import {GameSetupRoute} from './GameSetupRoute';

/** Общий каркас приложения (бывшая обёртка из App.tsx) + Suspense для lazy-игр. */
function RootLayout() {
    return (
        <div className="min-h-screen safe-top safe-bottom flex flex-col items-center">
            <div
                className="w-full max-w-3xl min-h-screen relative flex flex-col shadow-2xl bg-black/20 ring-1 ring-white/5">
                <Suspense
                    fallback={
                        <div
                            className="min-h-screen bg-black flex items-center justify-center text-white/50 font-black uppercase tracking-widest animate-pulse">
                            Загрузка...
                        </div>
                    }
                >
                    <Outlet/>
                </Suspense>
            </div>
            <ScrollRestoration/>
        </div>
    );
}

function MenuRoute() {
    const navigate = useNavigate();
    const {setCurrentGameId} = useGameSettings();

    const handleSelectGame = (gameId: GameKey) => {
        // Ставим id до навигации, чтобы Setup сразу отрендерился с нужным конфигом
        setCurrentGameId(gameId);
        void navigate(`/game/${gameId}/setup`);
    };

    return (
        <div className="relative">
            <MainMenu onSelectGame={handleSelectGame}/>
            <button
                onClick={() => void navigate('/settings')}
                className="fixed bottom-6 right-6 w-14 h-14 glass-card rounded-premium-md flex items-center justify-center text-white/30 active:scale-95 transition-all z-50 hover:text-white/60"
            >
                <SettingsIcon className="w-5 h-5"/>
            </button>
        </div>
    );
}

function SettingsRoute() {
    const navigate = useNavigate();
    return <Settings onBack={() => void navigate('/')}/>;
}

export const router = createBrowserRouter(
    [
        {
            element: <RootLayout/>,
            children: [
                {index: true, element: <MenuRoute/>},
                {path: 'settings', element: <SettingsRoute/>},
                {
                    path: 'game/:gameKey',
                    element: <GameLayout/>,
                    children: [
                        {index: true, element: <Navigate to="setup" replace/>},
                        {path: 'setup', element: <GameSetupRoute/>},
                        {path: 'play', element: <GamePlayRoute/>},
                    ],
                },
                {path: '*', element: <Navigate to="/" replace/>},
            ],
        },
    ],
    // Приложение живёт под base '/party-games/' (vite.config.ts)
    {basename: import.meta.env.BASE_URL.replace(/\/$/, '')},
);
