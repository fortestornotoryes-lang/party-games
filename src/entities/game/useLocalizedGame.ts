import { useMemo } from 'react';

import { GAMES_REGISTRY } from './registry';
import type { GameKey, GameMetadata, GameMetadataDef } from './types';

import { useLanguage } from '@/shared/i18n';
import type { TranslateFn } from '@/shared/i18n/types';

// Опциональный ключ: t() возвращает путь, если перевода нет (sublabel есть не у всех опций)
function tOptional(t: TranslateFn, path: string): string | undefined {
  const value = t(path);
  return value === path ? undefined : value;
}

/** Дополняет структурную запись реестра текстами из словарей registry.games.<id> */
export function localizeGameMeta(def: GameMetadataDef, t: TranslateFn): GameMetadata {
  const base = `registry.games.${def.id}`;
  return {
    ...def,
    title: t(`${base}.title`),
    subtitle: t(`${base}.subtitle`),
    placeholder: t(`${base}.placeholder`),
    description: t(`${base}.description`),
    modes: def.modes?.map((m) => ({
      ...m,
      name: t(`${base}.modes.${m.id}.name`),
      description: t(`${base}.modes.${m.id}.description`),
    })),
    settings: def.settings?.map((s) => ({
      ...s,
      label: t(`${base}.settings.${s.key}.label`),
      options: s.options.map((o) => {
        const optBase = `${base}.settings.${s.key}.options.${String(o.value)}`;
        return {
          ...o,
          label: t(`${optBase}.label`),
          sublabel: tOptional(t, `${optBase}.sublabel`),
        };
      }),
    })),
  };
}

/** Локализованные метаданные одной игры (пересчитываются при смене языка) */
export function useLocalizedGame(gameKey: GameKey | undefined): GameMetadata | undefined {
  const { t, lang } = useLanguage();
  return useMemo(
    () => (gameKey ? localizeGameMeta(GAMES_REGISTRY[gameKey], t) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameKey, lang]
  );
}

/** Локализованные метаданные всех игр — для списка в меню */
export function useLocalizedGames(): GameMetadata[] {
  const { t, lang } = useLanguage();
  return useMemo(
    () => Object.values(GAMES_REGISTRY).map((def) => localizeGameMeta(def, t)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );
}
