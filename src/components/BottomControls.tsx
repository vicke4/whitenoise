import { Clock, Info, Volume2, VolumeX, Waves, Zap } from 'lucide-react';

interface BottomControlsProps {
  volume: number;
  noiseType: 'brown' | 'white';
  timerDuration: number;
  timeLeft: number;
  showFeedback: boolean;
  onToggleNoiseType: (e: React.MouseEvent) => void;
  onToggleInfo: () => void;
  formatTime: (seconds: number) => string;
}

const BottomControls = ({
  volume,
  noiseType,
  timerDuration,
  timeLeft,
  showFeedback,
  onToggleNoiseType,
  onToggleInfo,
  formatTime,
}: BottomControlsProps) => {
  return (
    <div
      className={`absolute bottom-12 w-full flex justify-between px-12 pointer-events-auto transition-all duration-500 ${showFeedback ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
    >
      {/* Left: Volume Stats */}
      <div className="flex flex-col items-center gap-1 w-12">
        {volume === 0 ? (
          <VolumeX size={20} className="text-slate-500" />
        ) : (
          <Volume2 size={20} className="text-slate-500" />
        )}
        <span className="text-xs tracking-widest text-slate-600">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* CENTER: Control Group */}
      <div className="flex items-center gap-6 -mt-2 z-50">
        {/* Noise Type Toggle */}
        <button
          onClick={onToggleNoiseType}
          className="group flex flex-col items-center gap-2"
          title="Switch Noise Type"
        >
          <div
            className={`p-3 rounded-full border transition-all duration-300 shadow-lg active:scale-95 ${noiseType === 'brown' ? 'bg-amber-900/40 border-amber-700 hover:border-amber-500' : 'bg-cyan-900/30 border-cyan-700 hover:border-cyan-500'}`}
          >
            {noiseType === 'brown' ? (
              <Waves
                size={20}
                className="text-amber-400 group-hover:text-amber-200 transition-colors"
              />
            ) : (
              <Zap
                size={20}
                className="text-cyan-400 group-hover:text-cyan-200 transition-colors"
              />
            )}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
            {noiseType === 'brown' ? 'Brown' : 'White'}
          </span>
        </button>

        {/* Info Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleInfo();
          }}
          className="group flex flex-col items-center gap-2"
        >
          <div className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 hover:border-teal-500/50 transition-all duration-300 shadow-lg active:scale-95">
            <Info
              size={20}
              className="text-slate-400 group-hover:text-teal-300 transition-colors"
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
            Info
          </span>
        </button>
      </div>

      {/* Right: Timer Stats */}
      <div className="flex flex-col items-center gap-1 w-12">
        <Clock
          size={20}
          className={timerDuration > 0 ? 'text-teal-500' : 'text-slate-500'}
        />
        <span
          className={`text-xs tracking-widest ${timerDuration > 0 ? 'text-teal-500' : 'text-slate-600'}`}
        >
          {timerDuration === 0 ? '--' : formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};

export default BottomControls;
