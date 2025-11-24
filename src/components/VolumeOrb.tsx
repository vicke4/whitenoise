import { Pause, Play } from 'lucide-react';

interface VolumeOrbProps {
  volume: number;
  isPlaying: boolean;
  isDragging: boolean;
  showInfo: boolean;
  noiseType: 'brown' | 'white';
  onTogglePlay: () => void;
}

const VolumeOrb = ({
  volume,
  isPlaying,
  isDragging,
  showInfo,
  noiseType,
  onTogglePlay,
}: VolumeOrbProps) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center transition-all duration-1000 ease-linear
            ${isPlaying ? (noiseType === 'brown' ? 'animate-pulse-brown' : 'animate-pulse-white') : ''}
            ${showInfo ? 'blur-md opacity-20' : ''}
            ${noiseType === 'brown' ? 'bg-gradient-to-tr from-amber-700 to-orange-600 shadow-[0_0_50px_rgba(217,119,6,0.4)]' : 'bg-gradient-to-tr from-slate-400 to-cyan-100 shadow-[0_0_50px_rgba(200,200,255,0.4)]'}
          `}
      style={{
        width: `${120 + volume * 200}px`,
        height: `${120 + volume * 200}px`,
        opacity: showInfo ? 0.2 : 0.6 + volume * 0.4,
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePlay();
        }}
        className="z-20 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors pointer-events-auto"
      >
        {isPlaying ? (
          <Pause
            size={32}
            className={`opacity-90 ${noiseType === 'white' ? 'text-slate-800' : 'text-white'}`}
            fill="currentColor"
          />
        ) : (
          <Play
            size={32}
            className={`opacity-90 ml-1 ${noiseType === 'white' ? 'text-slate-800' : 'text-white'}`}
            fill="currentColor"
          />
        )}
      </button>
    </div>
  );
};

export default VolumeOrb;
