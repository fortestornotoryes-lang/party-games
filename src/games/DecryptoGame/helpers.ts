import { TeamColor } from './types';

export const tLabel = (c: TeamColor) => c === 'red' ? 'Красных' : 'Синих';
export const tText  = (c: TeamColor) => c === 'red' ? 'text-premium-red' : 'text-premium-blue';
export const tBg    = (c: TeamColor) => c === 'red'
    ? 'bg-premium-red/10 border-premium-red/20'
    : 'bg-premium-blue/10 border-premium-blue/20';
export const tBadge = (c: TeamColor) => c === 'red'
    ? 'bg-premium-red/20 text-premium-red'
    : 'bg-premium-blue/20 text-premium-blue';
export const tFocus = (c: TeamColor) => c === 'red'
    ? 'focus:border-premium-red/50'
    : 'focus:border-premium-blue/50';
export const tGlow  = (c: TeamColor) => c === 'red'
    ? 'drop-shadow-[0_0_15px_rgba(255,46,77,0.5)]'
    : 'drop-shadow-[0_0_15px_rgba(63,123,255,0.5)]';
