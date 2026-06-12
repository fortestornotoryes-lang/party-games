import { WAVELENGTH_DATA_BY_DIFFICULTY } from '@/constants/wavelengthContent';
import { GameKey } from '@/entities/game/types';
import { pickRandom } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useWavelengthContent(difficulty: Difficulty): string[] {
  const pool = WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] || WAVELENGTH_DATA_BY_DIFFICULTY.medium;
  // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
  const custom = [
    ...storageService.getCustomWords(GameKey.Wavelength),
    ...storageService.getCustomWordsByKey(`${GameKey.Wavelength}_${difficulty}`),
  ];
  const used = storageService.getUsedWords(GameKey.Wavelength);

  const all = [
    ...pool,
    ...custom.map((w) => (w.split(' - ').length === 2 ? w.split(' - ') : [w, '...'])),
  ];

  let available = all.filter((pair) => !used.includes(pair.join(' - ')));
  if (available.length === 0) {
    storageService.resetUsedWords(GameKey.Wavelength);
    available = all;
  }

  const pair = pickRandom(available);
  storageService.markWordAsUsed(GameKey.Wavelength, pair.join(' - '));
  return pair;
}
