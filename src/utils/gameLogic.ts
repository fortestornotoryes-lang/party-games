import {FAKE_ARTIST_ROLE_IDS} from '../constants/fakeArtistContent';
import {RESISTANCE_ROLE_IDS} from '../constants/resistanceContent';

import type {Player} from '@/entities/player/types';
import {shuffle} from '@/shared/helpers/random';


export const generateId = () => Math.random().toString(36).slice(2, 11);

export const initFakeArtist = (playerNames: string[]) => {
    const spyIndex = Math.floor(Math.random() * playerNames.length);

    const players: Player[] = playerNames.map((name, index) => ({
        id: generateId(),
        name,
        role: index === spyIndex ? FAKE_ARTIST_ROLE_IDS.IMPOSTER : FAKE_ARTIST_ROLE_IDS.ARTIST,
        isSpy: index === spyIndex,
    }));

    return {players};
};

export const initResistance = (playerNames: string[]) => {
    const pCount = playerNames.length;
    let spyCount = 2;
    if (pCount >= 7) spyCount = 3;
    if (pCount >= 10) spyCount = 4;

    const indices = Array.from({length: pCount}, (_, i) => i);
    const shuffledIndices = shuffle(indices);
    const spyIndices = shuffledIndices.slice(0, spyCount);

    const players: Player[] = playerNames.map((name, index) => ({
        id: generateId(),
        name,
        role: spyIndices.includes(index) ? RESISTANCE_ROLE_IDS.SPY : RESISTANCE_ROLE_IDS.RESISTANCE,
        isSpy: spyIndices.includes(index),
    }));

    return {players};
};
