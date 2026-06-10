import {storageService} from './storageService';

/**
 * Стандартные вибропаттерны для единообразного UX.
 * Использовать вместо магических чисел в callsite'ах.
 */
export const VIBRATE = {
    /** Правильный ответ / угадано */
    correct: [50, 30, 50] as number[],
    /** Неправильный ответ / ошибка */
    error: 100,
    /** Победа / конец игры */
    win: [100, 50, 100] as number[],
    /** Таймер истёк */
    timeout: [80, 40, 80] as number[],
    /** Лёгкий тап / клик */
    tap: 10,
    /** Двойной импульс — конец раунда / переход */
    celebrate: [50, 30, 50, 30, 50] as number[],
} as const;

// Singleton AudioContext — браузер ограничивает их количество (~6 на страницу).
// Переиспользуем один на всё время жизни приложения.
let _audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
    if (_audioCtx && _audioCtx.state !== 'closed') return _audioCtx;
    const Ctor =
        (typeof window !== 'undefined'
            ? ((window as any)?.AudioContext ?? (window as any)?.webkitAudioContext)
            : null) ?? null;
    if (!Ctor) return null;
    _audioCtx = new Ctor() as AudioContext;
    return _audioCtx;
}

/**
 * Feedback Service for Haptics and Sound Effects
 */
export const feedbackService = {
    // Haptic Feedback (Vibration)
    vibrate: (pattern: number | number[] = 10) => {
        void storageService.getSettingsAsync().then(({vibration}) => {
            if (vibration && typeof navigator !== 'undefined' && navigator.vibrate) {
                try {
                    navigator.vibrate(pattern);
                } catch (e) {
                    // Ignore vibration errors
                }
            }
        });
    },

    // Sound Effects using Web Audio API
    playSound: (type: 'success' | 'click' | 'error' | 'start' | 'win' | 'timeout') => {
        void storageService.getSettingsAsync().then(({sounds}) => {
            if (!sounds) return;

            try {
                const ctx = getAudioCtx();
                if (!ctx) return;

                // Browsers suspend AudioContext until a user gesture; resume silently.
                if (ctx.state === 'suspended') {
                    ctx.resume().catch(() => {
                    });
                }

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                const now = ctx.currentTime;

                switch (type) {
                    case 'success':
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(440, now);
                        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                        osc.start(now);
                        osc.stop(now + 0.3);
                        break;
                    case 'click':
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(600, now);
                        gain.gain.setValueAtTime(0.05, now);
                        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                        osc.start(now);
                        osc.stop(now + 0.05);
                        break;
                    case 'error':
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(100, now);
                        osc.frequency.linearRampToValueAtTime(50, now + 0.2);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                        osc.start(now);
                        osc.stop(now + 0.2);
                        break;
                    case 'start':
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(261.63, now); // C4
                        osc.frequency.setValueAtTime(329.63, now + 0.1); // E4
                        osc.frequency.setValueAtTime(392.0, now + 0.2); // G4
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                        osc.start(now);
                        osc.stop(now + 0.5);
                        break;
                    case 'win':
                        // Восходящий аккорд — C4 → E4 → G4 → C5
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(261.63, now);
                        osc.frequency.setValueAtTime(329.63, now + 0.12);
                        osc.frequency.setValueAtTime(392.0, now + 0.24);
                        osc.frequency.setValueAtTime(523.25, now + 0.36);
                        gain.gain.setValueAtTime(0.12, now);
                        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
                        osc.start(now);
                        osc.stop(now + 0.7);
                        break;
                    case 'timeout':
                        // Нисходящий сигнал — тревога
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(440, now);
                        osc.frequency.linearRampToValueAtTime(220, now + 0.4);
                        gain.gain.setValueAtTime(0.09, now);
                        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
                        osc.start(now);
                        osc.stop(now + 0.4);
                        break;
                }
            } catch (e) {
                // Ignore audio errors
            }
        });
    },
};
