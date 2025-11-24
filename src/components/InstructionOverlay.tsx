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
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 md:mt-40 pointer-events-none transition-all duration-1000 ${!isPlaying && !isDragging && !showInfo ? 'opacity-100' : 'opacity-0'}`}
    >
      <p className="text-slate-500 text-xs md:text-sm tracking-[0.2em] uppercase text-center whitespace-nowrap">
        {isTouch ? 'Tap & Drag Vertically' : 'Click & Drag Vertically'}
      </p>
    </div>
  );
};

export default InstructionOverlay;
