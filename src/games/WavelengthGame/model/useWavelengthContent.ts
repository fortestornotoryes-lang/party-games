import {WAVELENGTH_DATA_BY_DIFFICULTY} from '@/constants/wavelengthContent';
import {storageService} from '@/services/storageService';
import type {Difficulty} from '@/types';
import {GameKey} from '@/types/games';
import {pickRandom} from '@/utils/random';

export function useWavelengthContent(difficulty: Difficulty): string[] {
    const pool = (WAVELENGTH_DATA_BY_DIFFICULTY[difficulty] ||
        WAVELENGTH_DATA_BY_DIFFICULTY.medium);
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
