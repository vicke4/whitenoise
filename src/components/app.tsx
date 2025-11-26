import { useCallback, useEffect, useRef, useState } from 'react';
import BottomControls from './BottomControls';
import FeedbackModal from './FeedbackModal';
import FeedbackOverlay from './FeedbackOverlay';
import InfoModal from './InfoModal';
import InstructionOverlay from './InstructionOverlay';
import Logo from './Logo';
import TimerRing from './TimerRing';
import VolumeOrb from './VolumeOrb';

const WhiteNoiseNowApp = () => {
  // --- Audio State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // 0.0 to 1.0
  const [noiseType, setNoiseType] = useState<'brown' | 'white'>('white');
  const [timerDuration, setTimerDuration] = useState(0); // in minutes
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  // --- Refs for Audio Context ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioMonitorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dragNotificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstVolumeRender = useRef(true);
  const isFirstTimerRender = useRef(true);
  const isFirstNoiseRender = useRef(true);
  const isFirstTimerEffectRender = useRef(true);

  // --- Interaction State ---
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDragValues, setInitialDragValues] = useState({
    vol: 0.5,
    time: 0,
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // --- UI State ---
  const [showInfo, setShowInfo] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // --- Constants ---
  const MAX_TIMER_MINUTES = 120;
  const SENSITIVITY = 0.005; // Sensitivity of drag
  const VOLUME_INCREMENT = 0.01; // 1% volume change per arrow key press
  const TIMER_INCREMENT = 1; // 1 minute change per arrow key press
  const MAX_GAIN = 0.3; // Cap maximum volume to prevent ear damage (30% of full gain)

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('whiteNoise_volume');
    const savedTimer = localStorage.getItem('whiteNoise_timer');
    const savedNoiseType = localStorage.getItem('whiteNoise_noiseType');

    if (savedVolume) setVolume(Number.parseFloat(savedVolume));
    if (savedTimer) {
      const timerValue = Number.parseInt(savedTimer, 10);
      setTimerDuration(timerValue);
      setTimeLeft(timerValue * 60);
    }
    if (
      savedNoiseType &&
      (savedNoiseType === 'white' || savedNoiseType === 'brown')
    ) {
      setNoiseType(savedNoiseType);
    }

    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Save preferences to localStorage (skip first render to avoid overwriting loaded values)
  useEffect(() => {
    if (isFirstVolumeRender.current) {
      isFirstVolumeRender.current = false;
      return;
    }
    localStorage.setItem('whiteNoise_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    if (isFirstTimerRender.current) {
      isFirstTimerRender.current = false;
      return;
    }
    localStorage.setItem('whiteNoise_timer', timerDuration.toString());
  }, [timerDuration]);

  useEffect(() => {
    if (isFirstNoiseRender.current) {
      isFirstNoiseRender.current = false;
      return;
    }
    localStorage.setItem('whiteNoise_noiseType', noiseType);
  }, [noiseType]);

  // --- Buffer Generation Helper ---
  const createNoiseBuffer = (
    ctx: AudioContext,
    type: 'brown' | 'white',
  ): AudioBuffer => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      // White Noise: Random values between -1.0 and 1.0
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
        output[i] *= 0.15; // Lower base volume for white noise as it's perceived louder
      }
    } else {
      // Brown Noise: Leaky integrator
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    }
    return buffer;
  };

  // --- Create and Start Noise Source Helper ---
  const createAndStartNoiseSource = (
    ctx: AudioContext,
    gainNode: GainNode,
  ): AudioBufferSourceNode => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, noiseType);
    noise.loop = true;
    noise.connect(gainNode);
    noise.start(0);
    return noise;
  };

  // --- Recreate Noise Node Helper ---
  const recreateNoiseNode = useCallback(() => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;

    // Stop existing node if any
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
      } catch (e) {
        // Already stopped/disconnected - ignore
      }
    }

    // Create new buffer source
    noiseNodeRef.current = createAndStartNoiseSource(
      audioCtxRef.current,
      gainNodeRef.current,
    );

    console.log('[Monitor] Recreated noise node');
  }, [noiseType]);

  // --- Switch Noise Type Live ---
  useEffect(() => {
    // Only switch if context exists and we have a gain node to connect to
    if (!audioCtxRef.current || !gainNodeRef.current) return;

    // Stop existing node
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
    }

    noiseNodeRef.current = createAndStartNoiseSource(
      audioCtxRef.current,
      gainNodeRef.current,
    );
  }, [noiseType]);

  // --- Audio Initialization ---
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Create Gain (Volume)
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNodeRef.current = gainNode;
    gainNode.connect(ctx.destination);

    // Initial Noise Node
    noiseNodeRef.current = createAndStartNoiseSource(ctx, gainNode);
  };

  const togglePlay = useCallback(() => {
    if (!audioCtxRef.current) {
      console.log('[Audio] Initializing audio context');
      initAudio();
    }

    if (audioCtxRef.current?.state === 'suspended') {
      console.log('[Audio] Resuming suspended context');
      audioCtxRef.current.resume();
    }

    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    console.log(`[Audio] ${newIsPlaying ? 'Starting' : 'Stopping'} playback`);

    if (gainNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.setValueAtTime(
        gainNodeRef.current.gain.value,
        now,
      );

      if (newIsPlaying) {
        gainNodeRef.current.gain.linearRampToValueAtTime(
          volume * MAX_GAIN,
          now + 1,
        );
      } else {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.5);
      }
    }
  }, [isPlaying, volume]);

  const toggleNoiseType = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newType = noiseType === 'brown' ? 'white' : 'brown';
    setNoiseType(newType);
    setFeedbackText(newType === 'brown' ? 'Brown Noise' : 'White Noise');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1500);
  };

  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      gainNodeRef.current.gain.setTargetAtTime(volume * MAX_GAIN, now, 0.1);
    }
  }, [volume, isPlaying]);

  // Timer Logic
  useEffect(() => {
    // Skip first render to allow localStorage values to load
    if (isFirstTimerEffectRender.current) {
      isFirstTimerEffectRender.current = false;
      return;
    }

    if (timerDuration > 0 && isPlaying) {
      if (timeLeft === 0 || !timerIntervalRef.current)
        setTimeLeft(timerDuration * 60);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current)
              clearInterval(timerIntervalRef.current);
            togglePlay();
            setTimerDuration(0);
            return 0;
          }
          if (prev <= 5 && gainNodeRef.current && audioCtxRef.current) {
            const now = audioCtxRef.current.currentTime;
            const remainingRatio = prev / 5;
            gainNodeRef.current.gain.setTargetAtTime(
              volume * MAX_GAIN * remainingRatio,
              now,
              0.1,
            );
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isPlaying || timerDuration === 0) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (timerDuration === 0) setTimeLeft(0);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerDuration, isPlaying]);

  // --- Keyboard Controls ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if info modal is open or if user is typing in an input
      if (
        showInfo ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          togglePlay();
          break;

        case 'ArrowUp':
          e.preventDefault();
          setVolume((prev) => {
            const newVol = Math.min(1, prev + VOLUME_INCREMENT);
            setFeedbackText(`Volume ${Math.round(newVol * 100)}%`);
            setShowFeedback(true);
            if (dragNotificationTimeoutRef.current) {
              clearTimeout(dragNotificationTimeoutRef.current);
            }
            dragNotificationTimeoutRef.current = setTimeout(
              () => setShowFeedback(false),
              1000,
            );
            return newVol;
          });
          break;

        case 'ArrowDown':
          e.preventDefault();
          setVolume((prev) => {
            const newVol = Math.max(0, prev - VOLUME_INCREMENT);
            setFeedbackText(`Volume ${Math.round(newVol * 100)}%`);
            setShowFeedback(true);
            if (dragNotificationTimeoutRef.current) {
              clearTimeout(dragNotificationTimeoutRef.current);
            }
            dragNotificationTimeoutRef.current = setTimeout(
              () => setShowFeedback(false),
              1000,
            );
            return newVol;
          });
          break;

        case 'ArrowRight':
          e.preventDefault();
          setTimerDuration((prev) => {
            const newTime = Math.min(MAX_TIMER_MINUTES, prev + TIMER_INCREMENT);
            setTimeLeft(newTime * 60);
            setFeedbackText(newTime === 0 ? 'Timer Off' : `${newTime} min`);
            setShowFeedback(true);
            if (dragNotificationTimeoutRef.current) {
              clearTimeout(dragNotificationTimeoutRef.current);
            }
            dragNotificationTimeoutRef.current = setTimeout(
              () => setShowFeedback(false),
              1000,
            );
            return newTime;
          });
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setTimerDuration((prev) => {
            const newTime = Math.max(0, prev - TIMER_INCREMENT);
            setTimeLeft(newTime * 60);
            setFeedbackText(newTime === 0 ? 'Timer Off' : `${newTime} min`);
            setShowFeedback(true);
            if (dragNotificationTimeoutRef.current) {
              clearTimeout(dragNotificationTimeoutRef.current);
            }
            dragNotificationTimeoutRef.current = setTimeout(
              () => setShowFeedback(false),
              1000,
            );
            return newTime;
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInfo, togglePlay]);

  // --- Page Visibility & Lifecycle Handlers ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[Visibility] Page hidden');
      } else {
        console.log('[Visibility] Page visible - restoring audio');

        // Resume AudioContext if suspended and we're supposed to be playing
        if (isPlaying && audioCtxRef.current) {
          if (audioCtxRef.current.state === 'suspended') {
            console.log('[Visibility] Resuming suspended AudioContext');
            audioCtxRef.current.resume().catch((err) => {
              console.error('[Visibility] Failed to resume:', err);
            });
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && isPlaying && audioCtxRef.current) {
        // Page was restored from bfcache (back/forward cache)
        console.log('[Lifecycle] Page restored from bfcache');
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      }
    };

    const handleResume = () => {
      console.log('[Lifecycle] Page resumed from freeze');
      if (isPlaying && audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('resume', handleResume);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('resume', handleResume);
    };
  }, [isPlaying]);

  // --- AudioContext State Monitoring ---
  useEffect(() => {
    if (isPlaying) {
      // Monitor AudioContext state every 3 seconds
      audioMonitorIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;

        const state = audioCtxRef.current.state;

        if (state === 'suspended') {
          console.log('[Monitor] AudioContext suspended - attempting resume');
          audioCtxRef.current.resume().catch((err) => {
            console.error('[Monitor] Failed to resume:', err);
          });
        } else if (state === 'closed') {
          console.error('[Monitor] AudioContext closed unexpectedly');
          // Audio context is dead - would need full re-initialization
          // For now just log it
        }

        // Verify buffer source is still valid by checking if it's connected
        if (noiseNodeRef.current) {
          try {
            // Access a property to verify it's still valid
            const _ = noiseNodeRef.current.loop;
          } catch (e) {
            console.log('[Monitor] Buffer source disconnected - recreating');
            recreateNoiseNode();
          }
        }
      }, 3000); // Check every 3 seconds
    } else {
      // Stop monitoring when not playing
      if (audioMonitorIntervalRef.current) {
        clearInterval(audioMonitorIntervalRef.current);
        audioMonitorIntervalRef.current = null;
      }
    }

    return () => {
      if (audioMonitorIntervalRef.current) {
        clearInterval(audioMonitorIntervalRef.current);
      }
    };
  }, [isPlaying, recreateNoiseNode]);

  // --- Media Session API Integration ---
  useEffect(() => {
    if ('mediaSession' in navigator) {
      if (isPlaying) {
        // Set metadata
        navigator.mediaSession.metadata = new MediaMetadata({
          title: noiseType === 'white' ? 'White Noise' : 'Brown Noise',
          artist: 'White Noise Now',
          album: 'Focus & Relaxation',
          artwork: [
            { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml' },
          ],
        });

        // Set action handlers
        navigator.mediaSession.setActionHandler('play', () => {
          console.log('[MediaSession] Play action');
          if (!isPlaying) togglePlay();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          console.log('[MediaSession] Pause action');
          if (isPlaying) togglePlay();
        });

        // Set playback state
        navigator.mediaSession.playbackState = 'playing';
        console.log('[MediaSession] Set to playing state');
      } else {
        // Set playback state to paused
        navigator.mediaSession.playbackState = 'paused';
        console.log('[MediaSession] Set to paused state');
      }
    }
  }, [isPlaying, noiseType, togglePlay]);

  // --- Audio Session API (Experimental) ---
  useEffect(() => {
    // Type guard for experimental Audio Session API
    const audioSession = (navigator as any).audioSession;

    if (audioSession && typeof audioSession.type !== 'undefined') {
      const requestAudioSession = async () => {
        try {
          if (isPlaying) {
            // Request 'playback' session type for continuous audio
            audioSession.type = 'playback';
            console.log('[AudioSession] Set session type to playback');
          } else {
            // Reset to default when not playing
            if (audioSession.type === 'playback') {
              audioSession.type = 'auto';
              console.log('[AudioSession] Reset session type to auto');
            }
          }
        } catch (err) {
          console.warn('[AudioSession] Failed to set audio session type:', err);
        }
      };

      requestAudioSession();
    } else {
      // Only log once on mount if not supported
      if (isPlaying) {
        console.log('[AudioSession] API not supported on this device');
      }
    }
  }, [isPlaying]);

  // --- Interaction Logic ---
  const handleStart = (clientX: number, clientY: number) => {
    if (showInfo) return;

    if (dragNotificationTimeoutRef.current) {
      clearTimeout(dragNotificationTimeoutRef.current);
      dragNotificationTimeoutRef.current = null;
    }

    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialDragValues({ vol: volume, time: timerDuration });
    setShowFeedback(true);
  };

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const deltaY = dragStart.y - clientY;
      const deltaX = clientX - dragStart.x;

      // Volume (Vertical)
      let newVol = initialDragValues.vol + deltaY * SENSITIVITY;
      newVol = Math.max(0, Math.min(1, newVol));
      setVolume(newVol);

      // Timer (Horizontal)
      const timeDelta = Math.round(deltaX / 10);
      let newTime = initialDragValues.time + timeDelta;
      if (Math.abs(newTime % 5) < 1) newTime = Math.round(newTime / 5) * 5;
      newTime = Math.max(0, Math.min(MAX_TIMER_MINUTES, newTime));

      if (newTime !== timerDuration) {
        setTimerDuration(newTime);
        setTimeLeft(newTime * 60);
      }

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        setFeedbackText(`Volume ${Math.round(newVol * 100)}%`);
      } else {
        setFeedbackText(newTime === 0 ? 'Timer Off' : `${newTime} min`);
      }
    },
    [isDragging, dragStart, initialDragValues, timerDuration],
  );

  const handleEnd = () => {
    setIsDragging(false);
    // setShowFeedback(false)
    dragNotificationTimeoutRef.current = setTimeout(
      () => setShowFeedback(false),
      1500,
    );
  };

  // Event Listeners
  const onMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('.no-drag')
    )
      return;
    handleStart(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const onMouseUp = handleEnd;

  const onTouchStart = (e: React.TouchEvent) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('.no-drag')
    )
      return;
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  const onTouchEnd = handleEnd;

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="relative w-full h-dvh overflow-hidden bg-slate-950 text-slate-100 select-none touch-none font-sans"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className={`absolute top-0 left-0 w-full h-full transition-colors duration-1000 ${noiseType === 'brown' ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.3),transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(94,234,212,0.15),transparent_70%)]'}`}
        ></div>
      </div>

      {/* Main Display Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
        {/* Logo and Title */}
        <div
          className={`absolute top-8 z-10 transition-all duration-300 flex flex-col items-center gap-4 ${
            showInfo ? 'opacity-20 blur-md' : 'opacity-100'
          }`}
        >
          <Logo noiseType={noiseType} />
          <InstructionOverlay
            isPlaying={isPlaying}
            isDragging={isDragging}
            showInfo={showInfo}
            isTouch={isTouch}
          />
        </div>

        <TimerRing
          volume={volume}
          timerDuration={timerDuration}
          timeLeft={timeLeft}
          showInfo={showInfo}
          noiseType={noiseType}
        />

        <VolumeOrb
          volume={volume}
          isPlaying={isPlaying}
          isDragging={isDragging}
          showInfo={showInfo}
          noiseType={noiseType}
          onTogglePlay={togglePlay}
        />

        <FeedbackOverlay
          showFeedback={showFeedback}
          feedbackText={feedbackText}
          timerDuration={timerDuration}
          timeLeft={timeLeft}
          formatTime={formatTime}
        />

        <InfoModal
          showInfo={showInfo}
          onClose={() => setShowInfo(false)}
          onOpenFeedback={() => {
            setShowInfo(false);
            setShowFeedbackModal(true);
          }}
        />

        <FeedbackModal
          showFeedback={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      </div>

      <BottomControls
        volume={volume}
        noiseType={noiseType}
        timerDuration={timerDuration}
        timeLeft={timeLeft}
        showFeedback={showFeedback}
        onToggleNoiseType={toggleNoiseType}
        onToggleInfo={() => setShowInfo(!showInfo)}
        formatTime={formatTime}
      />

      <style>{`
        @keyframes pulse-brown {
          0%, 100% { box-shadow: 0 0 40px rgba(217, 119, 6, 0.4); }
          50% { box-shadow: 0 0 80px rgba(217, 119, 6, 0.7); }
        }
        @keyframes pulse-white {
          0%, 100% { box-shadow: 0 0 40px rgba(200, 200, 255, 0.4); }
          50% { box-shadow: 0 0 80px rgba(200, 200, 255, 0.7); }
        }
        .animate-pulse-brown {
          animation: pulse-brown 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-white {
          animation: pulse-white 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default WhiteNoiseNowApp;
