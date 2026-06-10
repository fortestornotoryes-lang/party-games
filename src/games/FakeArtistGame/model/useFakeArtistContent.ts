import {FAKE_ARTIST_DATA_BY_DIFFICULTY} from '@/constants/fakeArtistContent';
import {storageService} from '@/services/storageService';
import type {Difficulty} from '@/types';
import {GameKey} from '@/types/games';
import {pickRandom} from '@/utils/random';

export function useFakeArtistContent(difficulty: Difficulty): { word: string; category: string } {
    const staticPool = FAKE_ARTIST_DATA_BY_DIFFICULTY[difficulty];
    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const custom = [
        ...storageService.getCustomWords(GameKey.FakeArtist),
        ...storageService.getCustomWordsByKey(`${GameKey.FakeArtist}_${difficulty}`),
    ];
    const used = storageService.getUsedWords(GameKey.FakeArtist);

    const pool = [...staticPool, ...custom.map((w) => ({word: w, category: 'Своё'}))];

    let available = pool.filter((item) => !used.includes(item.word));
    if (available.length === 0) {
        storageService.resetUsedWords(GameKey.FakeArtist);
        available = pool;
    }

    const item = pickRandom(available);
    storageService.markWordAsUsed(GameKey.FakeArtist, item.word);
    return item;
}
