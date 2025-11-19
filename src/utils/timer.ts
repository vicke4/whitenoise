import React from 'react';

export interface TimerState {
  remainingSeconds: number;
  isActive: boolean;
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

export const useTimer = (
  initialMinutes: number,
  onTimerEnd: () => void,
): [TimerState, (minutes: number) => void, () => void] => {
  const [timerState, setTimerState] = React.useState<TimerState>({
    remainingSeconds: minutesToSeconds(initialMinutes),
    isActive: false,
  });
  const intervalRef = React.useRef<number | null>(null);

  const startTimer = (minutes: number) => {
    const seconds = minutesToSeconds(minutes);
    setTimerState({ remainingSeconds: seconds, isActive: minutes > 0 });

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (minutes > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimerState((prev) => {
          if (prev.remainingSeconds <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            onTimerEnd();
            return { remainingSeconds: 0, isActive: false };
          }
          return {
            remainingSeconds: prev.remainingSeconds - 1,
            isActive: true,
          };
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerState({ remainingSeconds: 0, isActive: false });
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return [timerState, startTimer, stopTimer];
};
