import { useCallback, useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';
import { loadAppState, saveAppState } from '../utils/storage';
import { type TimerState, useTimer } from '../utils/timer';

interface UseWhiteNoiseReturn {
  isPlaying: boolean;
  volume: number;
  timerMinutes: number;
  playWhenOpened: boolean;
  timerState: TimerState;
  play: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  setTimerMinutes: (minutes: number) => void;
  setPlayWhenOpened: (enabled: boolean) => void;
}

const FADE_DURATION = 3000; // 3 seconds fade out

export const useWhiteNoise = (): UseWhiteNoiseReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(50);
  const [timerMinutes, setTimerMinutesState] = useState(0);
  const [playWhenOpened, setPlayWhenOpenedState] = useState(false);
  const hasAutoPlayed = useRef(false);
  const isPlayingRef = useRef(false);

  // Try to load audio with fallback support for different formats
  const [play, { sound, stop: stopSound }] = useSound(
    '/white_noise.mp3',
    {
      volume: volume / 100,
      loop: true,
      onload: () => {
        console.log('Audio loaded successfully');
      },
      onloaderror: (id, error) => {
        console.warn('Failed to load .opus, trying .m4a', error);
        // Fallback is handled by browser's audio element
      },
    },
  );

  const handleTimerEnd = useCallback(() => {
    if (sound && isPlayingRef.current) {
      // Fade out over 3 seconds
      const currentVolume = volume / 100;
      sound.fade(currentVolume, 0, FADE_DURATION);

      // Stop after fade completes
      setTimeout(() => {
        stopSound();
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (sound) {
          sound.volume(currentVolume); // Reset volume for next play
        }
      }, FADE_DURATION);
    }
  }, [sound, volume, stopSound]);

  const [timerState, startTimer, stopTimer] = useTimer(
    timerMinutes,
    handleTimerEnd,
  );

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadAppState();
    setVolumeState(savedState.volume);
    setTimerMinutesState(savedState.timer);
    setPlayWhenOpenedState(savedState.playWhenOpened);
  }, []);

  // Auto-play if playWhenOpened is enabled
  useEffect(() => {
    if (playWhenOpened && !hasAutoPlayed.current && sound) {
      hasAutoPlayed.current = true;
      handlePlay();
    }
  }, [playWhenOpened, sound]);

  const handlePlay = useCallback(() => {
    if (sound) {
      play();
      setIsPlaying(true);
      isPlayingRef.current = true;
      if (timerMinutes > 0) {
        startTimer(timerMinutes);
      }
    }
  }, [sound, play, timerMinutes, startTimer]);

  const handleStop = useCallback(() => {
    if (sound) {
      stopSound();
      setIsPlaying(false);
      isPlayingRef.current = false;
      stopTimer();
      // Reset volume if it was faded
      sound.volume(volume / 100);
    }
  }, [sound, stopSound, stopTimer, volume]);

  const setVolume = useCallback(
    (newVolume: number) => {
      setVolumeState(newVolume);
      saveAppState({ volume: newVolume });
      if (sound) {
        sound.volume(newVolume / 100);
      }
    },
    [sound],
  );

  const setTimerMinutes = useCallback(
    (minutes: number) => {
      setTimerMinutesState(minutes);
      saveAppState({ timer: minutes });

      // If playing and timer changed, restart timer
      if (isPlaying) {
        if (minutes > 0) {
          startTimer(minutes);
        } else {
          stopTimer();
        }
      }
    },
    [isPlaying, startTimer, stopTimer],
  );

  const setPlayWhenOpened = useCallback((enabled: boolean) => {
    setPlayWhenOpenedState(enabled);
    saveAppState({ playWhenOpened: enabled });
  }, []);

  return {
    isPlaying,
    volume,
    timerMinutes,
    playWhenOpened,
    timerState,
    play: handlePlay,
    stop: handleStop,
    setVolume,
    setTimerMinutes,
    setPlayWhenOpened,
  };
};
