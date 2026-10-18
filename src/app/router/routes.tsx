import { MotionConfig } from 'motion/react';
import { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from 'react-router';

import { GameLayout } from '@/pages/game/GameLayout';
import { GamePlayRoute } from '@/pages/game/GamePlayRoute';
import { GameSetupRoute } from '@/pages/game/GameSetupRoute';
import { MenuRoute } from '@/pages/menu/MenuRoute';
import { SettingsRoute } from '@/pages/settings/SettingsRoute';
import { useTranslation } from '@/shared/i18n';
import { storageService } from '@/shared/services/storageService';

/** Общий каркас приложения (бывшая обёртка из App.tsx) + Suspense для lazy-игр. */
function RootLayout() {
  const { t } = useTranslation();
  // «Визуальные эффекты» выключены (или reduce motion в ОС) — motion отключает движение
  // (transform/layout), остаются только fade. Читаем на каждом рендере: каркас
  // перерисовывается при навигации, так что смена настройки подхватывается без перезагрузки.
  const reducedMotion = storageService.getSettings().visualEffects ? 'user' : 'always';
  return (
    <MotionConfig reducedMotion={reducedMotion}>
      <div className="safe-top safe-bottom flex min-h-dvh flex-col items-center">
        <div className="relative flex min-h-dvh w-full max-w-3xl flex-col bg-black/20 shadow-2xl ring-1 ring-white/5">
          <Suspense
            fallback={
              <div className="flex min-h-dvh animate-pulse items-center justify-center bg-black font-black tracking-widest text-white/50 uppercase">
                {t('common.loading')}
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
        <ScrollRestoration />
      </div>
    </MotionConfig>
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
