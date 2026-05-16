import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
    initialTime: number;
    onTimeUp?: () => void;
    autoStart?: boolean;
}

export const useTimer = ({ initialTime, onTimeUp, autoStart = false }: UseTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(autoStart);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => setIsActive(true), []);
    const pause = useCallback(() => setIsActive(false), []);
    const reset = useCallback((newTime?: number) => {
        setIsActive(false);
        setTimeLeft(newTime ?? initialTime);
    }, [initialTime]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        pause();
                        onTimeUp?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, pause, onTimeUp]);

    return { timeLeft, isActive, start, pause, reset, setTimeLeft };
};
