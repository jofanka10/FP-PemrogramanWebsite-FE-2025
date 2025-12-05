import { useState, useEffect } from 'react';

interface Props {
  isRunning: boolean;
  onUpdate?: (time: number) => void;
}

function Timer({ isRunning, onUpdate }: Props) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(t => {
        const newTime = t + 1;
        onUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onUpdate]);

  const mins = Math.floor(time / 60);
  const secs = time % 60;

  return (
    <div className="text-2xl font-bold text-blue-600">
      ⏱️ {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </div>
  );
}

export default Timer;