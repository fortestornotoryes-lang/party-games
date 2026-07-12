import { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from 'react-router';

import { GameLayout } from '@/pages/game/GameLayout';
import { GamePlayRoute } from '@/pages/game/GamePlayRoute';
import { GameSetupRoute } from '@/pages/game/GameSetupRoute';
import { MenuRoute } from '@/pages/menu/MenuRoute';
import { SettingsRoute } from '@/pages/settings/SettingsRoute';
import { useTranslation } from '@/shared/i18n';

/** Общий каркас приложения (бывшая обёртка из App.tsx) + Suspense для lazy-игр. */
function RootLayout() {
  const { t } = useTranslation();
  return (
    <div className="safe-top safe-bottom flex min-h-screen flex-col items-center">
      <div className="relative flex min-h-screen w-full max-w-3xl flex-col bg-black/20 shadow-2xl ring-1 ring-white/5">
        <Suspense
          fallback={
            <div className="flex min-h-screen animate-pulse items-center justify-center bg-black font-black tracking-widest text-white/50 uppercase">
              {t('common.loading')}
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
      <ScrollRestoration />
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { index: true, element: <MenuRoute /> },
        { path: 'settings', element: <SettingsRoute /> },
        {
          path: 'game/:gameKey',
          element: <GameLayout />,
          children: [
            { index: true, element: <Navigate to="setup" replace /> },
            { path: 'setup', element: <GameSetupRoute /> },
            { path: 'play', element: <GamePlayRoute /> },
          ],
        },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  // Приложение живёт под base '/party-games/' (vite.config.ts)
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') }
);
