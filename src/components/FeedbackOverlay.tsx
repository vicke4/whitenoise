import { Clock } from 'lucide-react';

interface FeedbackOverlayProps {
  showFeedback: boolean;
  feedbackText: string;
  timerDuration: number;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

const FeedbackOverlay = ({
  showFeedback,
  feedbackText,
  timerDuration,
  timeLeft,
  formatTime,
}: FeedbackOverlayProps) => {
  return (
    <div
      className={`absolute pointer-events-none flex flex-col items-center justify-center gap-2 transition-opacity duration-300 z-50 ${showFeedback ? 'opacity-100' : 'opacity-0'}`}
    >
      {feedbackText && <div className="text-4xl md:text-5xl font-bold tracking-wider text-white drop-shadow-2xl bg-slate-950/30 backdrop-blur-sm px-6 py-2 rounded-2xl border border-white/10">
        {feedbackText}
      </div>}
      {timerDuration > 0 && (
        <div className="text-sm text-teal-400 font-mono tracking-widest flex items-center gap-2 bg-slate-950/50 px-3 py-1 rounded-full">
          <Clock size={14} />
          {formatTime(timeLeft)} remaining
        </div>
      )}
    </div>
  );
};

export default FeedbackOverlay;
