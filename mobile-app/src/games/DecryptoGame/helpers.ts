import type { TeamColor } from './types';

import { NS } from '@/shared/i18n/keys';

export const teamLabel = (c: TeamColor, t: (k: string) => string): string =>
  t(`${NS.DECRYPTO}.${c === 'red' ? 'teamRed' : 'teamBlue'}`);
export const tText = (c: TeamColor) => (c === 'red' ? 'text-premium-red' : 'text-premium-blue');
export const tBg = (c: TeamColor) =>
  c === 'red'
    ? 'bg-premium-red/10 border-premium-red/20'
    : 'bg-premium-blue/10 border-premium-blue/20';
export const tBadge = (c: TeamColor) =>
  c === 'red' ? 'bg-premium-red/20 text-premium-red' : 'bg-premium-blue/20 text-premium-blue';
