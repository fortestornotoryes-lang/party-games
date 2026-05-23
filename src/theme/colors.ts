import type { GameTheme } from '../types';

// RGB channel strings — single source of truth matching @theme tokens in index.css
// If a hex changes in index.css, update the corresponding entry here.
export const PREMIUM_RGB = {
  red:    '255,46,77',
  green:  '0,216,138',
  sky:    '31,182,255',
  blue:   '63,123,255',
  orange: '255,138,31',
  yellow: '255,204,31',
  purple: '199,123,255',
  pink:   '255,46,180',
  cyan:   '0,229,255',
} as const satisfies Record<GameTheme, string>;

// Helper for inline style props (boxShadow, filter, background) — not for className
export const rgba = (color: GameTheme, alpha: number): string =>
  `rgba(${PREMIUM_RGB[color]},${alpha})`;

// ─── Theme token map ───────────────────────────────────────────────────────────
// Replaces themeConfigs (MainMenu), themes (InstructionsModal),
// colorConfig (Setup), and colorStyles (UniversalGameSettings).
//
// All values are literal strings so Tailwind JIT can detect them during scan.

export interface ThemeTokens {
  // Single-class utilities
  text: string;
  solid: string;
  bg5: string;
  bg10: string;
  bg20: string;
  border20: string;
  border30: string;
  border40: string;
  // Compound class groups
  indexBg: string;       // player index badge
  activeOption: string;  // active setting button (UniversalGameSettings)
  button: string;        // primary action button
  gradient: string;      // radial ambient gradient
  focus: string;         // input focus ring
  addHover: string;      // add-player button hover
  closeHover: string;    // close/remove button hover
  glow: string;          // shadow glow (InstructionsModal)
  headerTheme: string;   // GameHeader icon border + text
}

export const THEME_TOKENS: Record<GameTheme, ThemeTokens> = {
  red: {
    text:         'text-premium-red',
    solid:        'bg-premium-red',
    bg5:          'bg-premium-red/5',
    bg10:         'bg-premium-red/10',
    bg20:         'bg-premium-red/20',
    border20:     'border-premium-red/20',
    border30:     'border-premium-red/30',
    border40:     'border-premium-red/40',
    indexBg:      'bg-premium-red/20 text-premium-red border-premium-red/30',
    activeOption: 'bg-premium-red/10 border-premium-red/40 text-premium-red shadow-[0_0_20px_rgba(255,46,77,0.12)]',
    button:       'bg-premium-red hover:bg-[#ff4d6a] active:scale-95 shadow-[0_20px_50px_rgba(255,46,77,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(255,46,77,0.15),transparent_70%)]',
    focus:        'focus:border-premium-red/50',
    addHover:     'hover:bg-premium-red/5 hover:text-white/80 hover:border-premium-red/20',
    closeHover:   'hover:bg-premium-red/10 hover:text-premium-red',
    glow:         'shadow-premium-red/20',
    headerTheme:  'border-premium-red/50 text-premium-red',
  },
  green: {
    text:         'text-premium-green',
    solid:        'bg-premium-green',
    bg5:          'bg-premium-green/5',
    bg10:         'bg-premium-green/10',
    bg20:         'bg-premium-green/20',
    border20:     'border-premium-green/20',
    border30:     'border-premium-green/30',
    border40:     'border-premium-green/40',
    indexBg:      'bg-premium-green/20 text-premium-green border-premium-green/30',
    activeOption: 'bg-premium-green/10 border-premium-green/40 text-premium-green shadow-[0_0_20px_rgba(0,216,138,0.12)]',
    button:       'bg-premium-green hover:bg-[#1ae599] active:scale-95 shadow-[0_20px_50px_rgba(0,216,138,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(0,216,138,0.15),transparent_70%)]',
    focus:        'focus:border-premium-green/50',
    addHover:     'hover:bg-premium-green/5 hover:text-white/80 hover:border-premium-green/20',
    closeHover:   'hover:bg-premium-green/10 hover:text-premium-green',
    glow:         'shadow-premium-green/20',
    headerTheme:  'border-premium-green/50 text-premium-green',
  },
  sky: {
    text:         'text-premium-sky',
    solid:        'bg-premium-sky',
    bg5:          'bg-premium-sky/5',
    bg10:         'bg-premium-sky/10',
    bg20:         'bg-premium-sky/20',
    border20:     'border-premium-sky/20',
    border30:     'border-premium-sky/30',
    border40:     'border-premium-sky/40',
    indexBg:      'bg-premium-sky/20 text-premium-sky border-premium-sky/30',
    activeOption: 'bg-premium-sky/10 border-premium-sky/40 text-premium-sky shadow-[0_0_20px_rgba(31,182,255,0.12)]',
    button:       'bg-premium-sky hover:bg-[#3ac1ff] active:scale-95 shadow-[0_20px_50px_rgba(31,182,255,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(31,182,255,0.15),transparent_70%)]',
    focus:        'focus:border-premium-sky/50',
    addHover:     'hover:bg-premium-sky/5 hover:text-white/80 hover:border-premium-sky/20',
    closeHover:   'hover:bg-premium-sky/10 hover:text-premium-sky',
    glow:         'shadow-premium-sky/20',
    headerTheme:  'border-premium-sky/50 text-premium-sky',
  },
  blue: {
    text:         'text-premium-blue',
    solid:        'bg-premium-blue',
    bg5:          'bg-premium-blue/5',
    bg10:         'bg-premium-blue/10',
    bg20:         'bg-premium-blue/20',
    border20:     'border-premium-blue/20',
    border30:     'border-premium-blue/30',
    border40:     'border-premium-blue/40',
    indexBg:      'bg-premium-blue/20 text-premium-blue border-premium-blue/30',
    activeOption: 'bg-premium-blue/10 border-premium-blue/40 text-premium-blue shadow-[0_0_20px_rgba(63,123,255,0.12)]',
    button:       'bg-premium-blue hover:bg-[#6699ff] active:scale-95 shadow-[0_20px_50px_rgba(63,123,255,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(63,123,255,0.15),transparent_70%)]',
    focus:        'focus:border-premium-blue/50',
    addHover:     'hover:bg-premium-blue/5 hover:text-white/80 hover:border-premium-blue/20',
    closeHover:   'hover:bg-premium-blue/10 hover:text-premium-blue',
    glow:         'shadow-premium-blue/20',
    headerTheme:  'border-premium-blue/50 text-premium-blue',
  },
  orange: {
    text:         'text-premium-orange',
    solid:        'bg-premium-orange',
    bg5:          'bg-premium-orange/5',
    bg10:         'bg-premium-orange/10',
    bg20:         'bg-premium-orange/20',
    border20:     'border-premium-orange/20',
    border30:     'border-premium-orange/30',
    border40:     'border-premium-orange/40',
    indexBg:      'bg-premium-orange/20 text-premium-orange border-premium-orange/30',
    activeOption: 'bg-premium-orange/10 border-premium-orange/40 text-premium-orange shadow-[0_0_20px_rgba(255,138,31,0.12)]',
    button:       'bg-premium-orange hover:bg-[#ffa14d] active:scale-95 shadow-[0_20px_50px_rgba(255,138,31,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(255,138,31,0.15),transparent_70%)]',
    focus:        'focus:border-premium-orange/50',
    addHover:     'hover:bg-premium-orange/5 hover:text-white/80 hover:border-premium-orange/20',
    closeHover:   'hover:bg-premium-orange/10 hover:text-premium-orange',
    glow:         'shadow-premium-orange/20',
    headerTheme:  'border-premium-orange/50 text-premium-orange',
  },
  yellow: {
    text:         'text-premium-yellow',
    solid:        'bg-premium-yellow',
    bg5:          'bg-premium-yellow/5',
    bg10:         'bg-premium-yellow/10',
    bg20:         'bg-premium-yellow/20',
    border20:     'border-premium-yellow/20',
    border30:     'border-premium-yellow/30',
    border40:     'border-premium-yellow/40',
    indexBg:      'bg-premium-yellow/20 text-premium-yellow border-premium-yellow/30',
    activeOption: 'bg-premium-yellow/10 border-premium-yellow/40 text-premium-yellow shadow-[0_0_20px_rgba(255,204,31,0.12)]',
    button:       'bg-premium-yellow hover:bg-[#ffd14d] active:scale-95 shadow-[0_20px_50px_rgba(255,204,31,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(255,204,31,0.15),transparent_70%)]',
    focus:        'focus:border-premium-yellow/50',
    addHover:     'hover:bg-premium-yellow/5 hover:text-white/80 hover:border-premium-yellow/20',
    closeHover:   'hover:bg-premium-yellow/10 hover:text-premium-yellow',
    glow:         'shadow-premium-yellow/20',
    headerTheme:  'border-premium-yellow/50 text-premium-yellow',
  },
  purple: {
    text:         'text-premium-purple',
    solid:        'bg-premium-purple',
    bg5:          'bg-premium-purple/5',
    bg10:         'bg-premium-purple/10',
    bg20:         'bg-premium-purple/20',
    border20:     'border-premium-purple/20',
    border30:     'border-premium-purple/30',
    border40:     'border-premium-purple/40',
    indexBg:      'bg-premium-purple/20 text-premium-purple border-premium-purple/30',
    activeOption: 'bg-premium-purple/10 border-premium-purple/40 text-premium-purple shadow-[0_0_20px_rgba(199,123,255,0.12)]',
    button:       'bg-premium-purple hover:bg-[#d499ff] active:scale-95 shadow-[0_20px_50px_rgba(199,123,255,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(199,123,255,0.15),transparent_70%)]',
    focus:        'focus:border-premium-purple/50',
    addHover:     'hover:bg-premium-purple/5 hover:text-white/80 hover:border-premium-purple/20',
    closeHover:   'hover:bg-premium-purple/10 hover:text-premium-purple',
    glow:         'shadow-premium-purple/20',
    headerTheme:  'border-premium-purple/50 text-premium-purple',
  },
  pink: {
    text:         'text-premium-pink',
    solid:        'bg-premium-pink',
    bg5:          'bg-premium-pink/5',
    bg10:         'bg-premium-pink/10',
    bg20:         'bg-premium-pink/20',
    border20:     'border-premium-pink/20',
    border30:     'border-premium-pink/30',
    border40:     'border-premium-pink/40',
    indexBg:      'bg-premium-pink/20 text-premium-pink border-premium-pink/30',
    activeOption: 'bg-premium-pink/10 border-premium-pink/40 text-premium-pink shadow-[0_0_20px_rgba(255,46,180,0.12)]',
    button:       'bg-premium-pink hover:bg-[#ff4dc4] active:scale-95 shadow-[0_20px_50px_rgba(255,46,180,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(255,46,180,0.15),transparent_70%)]',
    focus:        'focus:border-premium-pink/50',
    addHover:     'hover:bg-premium-pink/5 hover:text-white/80 hover:border-premium-pink/20',
    closeHover:   'hover:bg-premium-pink/10 hover:text-premium-pink',
    glow:         'shadow-premium-pink/20',
    headerTheme:  'border-premium-pink/50 text-premium-pink',
  },
  cyan: {
    text:         'text-premium-cyan',
    solid:        'bg-premium-cyan',
    bg5:          'bg-premium-cyan/5',
    bg10:         'bg-premium-cyan/10',
    bg20:         'bg-premium-cyan/20',
    border20:     'border-premium-cyan/20',
    border30:     'border-premium-cyan/30',
    border40:     'border-premium-cyan/40',
    indexBg:      'bg-premium-cyan/20 text-premium-cyan border-premium-cyan/30',
    activeOption: 'bg-premium-cyan/10 border-premium-cyan/40 text-premium-cyan shadow-[0_0_20px_rgba(0,229,255,0.12)]',
    button:       'bg-premium-cyan hover:bg-[#33eaff] active:scale-95 shadow-[0_20px_50px_rgba(0,229,255,0.3)]',
    gradient:     'bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.15),transparent_70%)]',
    focus:        'focus:border-premium-cyan/50',
    addHover:     'hover:bg-premium-cyan/5 hover:text-white/80 hover:border-premium-cyan/20',
    closeHover:   'hover:bg-premium-cyan/10 hover:text-premium-cyan',
    glow:         'shadow-premium-cyan/20',
    headerTheme:  'border-premium-cyan/50 text-premium-cyan',
  },
};

export const getTheme = (color: GameTheme): ThemeTokens => THEME_TOKENS[color];

// ─── Role tokens ───────────────────────────────────────────────────────────────
// Semantic role colors for RoleDistribution/FakeArtistDistribution.
// These are NOT game theme colors — they are fixed per role identity.
// Values go into style={{}} props (not className), so template literals are safe here.

export const ROLE_TOKENS = {
  spy: {
    cardBorder:  `1.5px solid rgba(${PREMIUM_RGB.red},0.45)`,
    cardShadow:  `0 0 80px rgba(${PREMIUM_RGB.red},0.22), 0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(${PREMIUM_RGB.red},0.12)`,
    topGlow:     `rgba(${PREMIUM_RGB.red},0.3)`,
    iconFilter:  `drop-shadow(0 0 20px rgba(${PREMIUM_RGB.red},0.5))`,
    textShadow:  `0 0 48px rgba(${PREMIUM_RGB.red},0.45)`,
    btnShadow:   `0 8px 32px rgba(${PREMIUM_RGB.red},0.35)`,
  },
  traitor: {
    cardBorder:  `1.5px solid rgba(${PREMIUM_RGB.orange},0.4)`,
    cardShadow:  `0 0 70px rgba(${PREMIUM_RGB.orange},0.15), 0 32px 64px rgba(0,0,0,0.55)`,
    topGlow:     `rgba(${PREMIUM_RGB.orange},0.22)`,
    iconFilter:  `drop-shadow(0 0 16px rgba(${PREMIUM_RGB.orange},0.45))`,
    btnShadow:   `0 8px 32px rgba(${PREMIUM_RGB.orange},0.25)`,
  },
  agent: {
    cardBorder:  `1.5px solid rgba(${PREMIUM_RGB.green},0.32)`,
    cardShadow:  `0 0 70px rgba(${PREMIUM_RGB.green},0.12), 0 32px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(${PREMIUM_RGB.green},0.08)`,
    topGlow:     `rgba(${PREMIUM_RGB.green},0.18)`,
    iconFilter:  `drop-shadow(0 0 16px rgba(${PREMIUM_RGB.green},0.4))`,
    textShadow:  `0 0 32px rgba(${PREMIUM_RGB.green},0.22)`,
    btnShadow:   `0 8px 32px rgba(${PREMIUM_RGB.green},0.22)`,
  },
} as const;
