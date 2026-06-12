import {DARES_BY_DIFFICULTY, TRUTHS_BY_DIFFICULTY} from '@/constants/truthOrDareContent';
import {pickRandom} from '@/shared/helpers/random';
import {storageService} from '@/shared/services/storageService';
import type {Difficulty} from '@/shared/types';
import {GameKey} from '@/types/games';

// TODO: RN — convert to async function awaiting storageService.*Async (sync return is consumed by render/handler call-sites; restructure callers first)
export function useTruthOrDareContent(type: 'truth' | 'dare', difficulty: Difficulty): string {
    const staticPool =
        type === 'truth' ? TRUTHS_BY_DIFFICULTY[difficulty] : DARES_BY_DIFFICULTY[difficulty];
    // TODO: extract to shared/lib — custom-words + used-words deduplication duplicated across game content hooks
    const custom = storageService.getCustomWordsByKey(`tod_${type}_${difficulty}`);
    const used = storageService.getUsedWords(GameKey.TruthOrDare);
    const all = [...staticPool, ...custom];

    let available = all.filter((q) => !used.includes(q));
    if (available.length === 0) {
        storageService.resetUsedWords(GameKey.TruthOrDare);
        available = all;
    }

    const question = pickRandom(available);
    storageService.markWordAsUsed(GameKey.TruthOrDare, question);
    return question;
}
