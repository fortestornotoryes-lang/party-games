import React from 'react';

export function useCountdown(
    active: boolean,
    initial = 0,
    onExpire?: () => void,
): [number, (s: number) => void] {
    const [timeLeft, setTimeLeft] = React.useState(initial);
    const onExpireRef = React.useRef(onExpire);
    onExpireRef.current = onExpire;

    React.useEffect(() => {
        if (!active || timeLeft <= 0) return;
        const t = setTimeout(() => {
            const next = Math.max(0, timeLeft - 1);
            setTimeLeft(next);
            if (next === 0) onExpireRef.current?.();
        }, 1000);
        return () => { clearTimeout(t); };
    }, [active, timeLeft]);

    return [timeLeft, setTimeLeft];
}
