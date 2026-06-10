import {useSpyHuntContent} from './useSpyHuntContent';

import {SPY_HUNT_MODES, SPY_HUNT_ROLE_IDS} from '@/constants/spyHuntContent';
import type {Player} from '@/types';
import {generateId} from '@/utils/gameLogic';
import {shuffle} from '@/utils/random';

export const initSpyHunt = (
    playerNames: string[],
    difficulty = 'medium',
    mode = 'classic'
) => {
    const locationObj = useSpyHuntContent(difficulty);

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
