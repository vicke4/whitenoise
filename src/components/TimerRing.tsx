interface TimerRingProps {
  volume: number;
  timerDuration: number;
  timeLeft: number;
  showInfo: boolean;
  noiseType: 'brown' | 'white';
}

const TimerRing = ({
  volume,
  timerDuration,
  timeLeft,
  showInfo,
  noiseType,
}: TimerRingProps) => {
  return (
    <div
      className="absolute pointer-events-none transition-all duration-500 ease-out"
      style={{
        width: `${300 + volume * 100}px`,
        height: `${300 + volume * 100}px`,
        opacity: timerDuration > 0 && !showInfo ? 1 : 0.1,
      }}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-slate-800"
        />
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all duration-300 ${noiseType === 'white' ? 'text-cyan-200' : 'text-teal-400'}`}
          strokeDasharray="301.59"
          strokeDashoffset={
            timerDuration > 0
              ? 301.59 - (timeLeft / (timerDuration * 60)) * 301.59
              : 301.59
          }
        />
      </svg>
    </div>
  );
};

export default TimerRing;
