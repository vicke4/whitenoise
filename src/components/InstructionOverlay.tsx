interface InstructionOverlayProps {
  isPlaying: boolean;
  isDragging: boolean;
  showInfo: boolean;
  isTouch: boolean;
}

const InstructionOverlay = ({
  isPlaying,
  isDragging,
  showInfo,
  isTouch,
}: InstructionOverlayProps) => {
  return (
    <div
      className={`pointer-events-none transition-all duration-1000 ${!isPlaying && !isDragging && !showInfo ? 'opacity-100' : 'opacity-0'}`}
    >
      <p className="text-slate-500 text-xs md:text-sm tracking-wide text-center max-w-xl px-4 uppercase leading-relaxed">
        {isTouch
          ? 'Tap & drag vertically for volume, horizontally for timer'
          : 'Click & drag vertically for volume, horizontally for timer'}
      </p>
    </div>
  );
};

export default InstructionOverlay;
