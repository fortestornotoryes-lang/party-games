import {Suspense} from 'react';
import {createBrowserRouter, Navigate, Outlet, ScrollRestoration} from 'react-router';

import {GameLayout} from '@/pages/game/GameLayout';
import {GamePlayRoute} from '@/pages/game/GamePlayRoute';
import {GameSetupRoute} from '@/pages/game/GameSetupRoute';
import {MenuRoute} from '@/pages/menu/MenuRoute';
import {SettingsRoute} from '@/pages/settings/SettingsRoute';

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
