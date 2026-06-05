import {FAKE_ARTIST_ROLE_IDS} from '../constants/fakeArtistContent';
import {RESISTANCE_ROLE_IDS} from '../constants/resistanceContent';
import {SPY_HUNT_MODES, SPY_HUNT_ROLE_IDS} from '../constants/spyHuntContent';
import {contentService} from '../services/contentService';
import type {Player} from '../types';

import {shuffle} from './random';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initSpyHunt = (
    playerNames: string[],
    difficulty = 'medium',
    mode = 'classic'
) => {
    const locationObj = contentService.getSpyHuntLocation(difficulty);

    // Mode logic
    const indices = Array.from({length: playerNames.length}, (_, i) => i);
    const shuffled = shuffle(indices);

    let spyIndices: number[] = [shuffled[0]];
    let moleIndex: number | null = null;

    if (mode === SPY_HUNT_MODES.DOUBLE_AGENT && playerNames.length >= 5) {
        spyIndices = [shuffled[0], shuffled[1]];
    } else if (mode === SPY_HUNT_MODES.MOLE && playerNames.length >= 5) {
        moleIndex = shuffled[1];
    }

    const players: Player[] = playerNames.map((name, index) => {
        let role: string = SPY_HUNT_ROLE_IDS.PLAYER;
        let isSpy = false;

        if (spyIndices.includes(index)) {
            role = SPY_HUNT_ROLE_IDS.SPY;
            isSpy = true;
        } else if (index === moleIndex) {
            role = SPY_HUNT_ROLE_IDS.TRAITOR;
            isSpy = false; // He knows the location, but is not "the" spy
        } else {
            role = locationObj.roles[index % locationObj.roles.length];
        }

        return {
            id: generateId(),
            name,
            role,
            isSpy,
        };
    });

    return {players, location: locationObj.name};
};

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
