interface LogoProps {
  noiseType: 'brown' | 'white';
}

const Logo = ({ noiseType }: LogoProps) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-1000"
      >
        <defs>
          <linearGradient
            id={`logo-gradient-${noiseType}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            {noiseType === 'brown' ? (
              <>
                <stop offset="0%" stopColor="rgb(180, 83, 9)" />
                <stop offset="100%" stopColor="rgb(234, 88, 12)" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="rgb(148, 163, 184)" />
                <stop offset="100%" stopColor="rgb(165, 243, 252)" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Concentric circles representing sound waves */}
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke={`url(#logo-gradient-${noiseType})`}
          strokeWidth="1.5"
          opacity="0.3"
        />
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke={`url(#logo-gradient-${noiseType})`}
          strokeWidth="2"
          opacity="0.5"
        />
        <circle
          cx="32"
          cy="32"
          r="12"
          stroke={`url(#logo-gradient-${noiseType})`}
          strokeWidth="2.5"
          opacity="0.7"
        />
        <circle
          cx="32"
          cy="32"
          r="6"
          fill={`url(#logo-gradient-${noiseType})`}
          opacity="0.9"
        />
      </svg>

      <h1
        className={`text-2xl font-light tracking-widest uppercase transition-all duration-1000 ${
          noiseType === 'brown'
            ? 'text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-400'
            : 'text-transparent bg-clip-text bg-linear-to-r from-slate-300 to-cyan-200'
        }`}
      >
        WhiteNoise.Now
      </h1>
    </div>
  );
};

export default Logo;
