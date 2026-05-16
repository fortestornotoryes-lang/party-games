export function useCountdown(active: boolean, initial = 0): [number, (s: number) => void] {
  const [timeLeft, setTimeLeft] = React.useState(initial);

  React.useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(t);
  }, [active, timeLeft]);

  return [timeLeft, setTimeLeft];
}
import React from 'react';
