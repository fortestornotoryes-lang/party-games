import { storageService } from './storageService';

/**
 * Feedback Service for Haptics and Sound Effects
 */
export const feedbackService = {
    // Haptic Feedback (Vibration)
    vibrate: (pattern: number | number[] = 10) => {
        const { vibration } = storageService.getSettings();
        if (vibration && typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore vibration errors
            }
        }
    },

    // Sound Effects using Web Audio API
    playSound: (type: 'success' | 'click' | 'error' | 'start') => {
        const { sounds } = storageService.getSettings();
        if (!sounds) return;

        try {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;

            const ctx = new AudioContextClass();
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
                    osc.frequency.setValueAtTime(392.00, now + 0.2); // G4
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
            }
        } catch (e) {
            // Ignore audio errors
        }
    }
};
