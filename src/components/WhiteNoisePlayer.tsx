import { useWhiteNoise } from '../hooks/useWhiteNoise';
import { formatTime } from '../utils/timer';
import styles from './WhiteNoisePlayer.module.css';

export const WhiteNoisePlayer = () => {
  const {
    isPlaying,
    volume,
    timerMinutes,
    playWhenOpened,
    timerState,
    play,
    stop,
    setVolume,
    setTimerMinutes,
    setPlayWhenOpened,
  } = useWhiteNoise();

  const handlePlayStop = () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimerMinutes(Number(e.target.value));
  };

  const handlePlayWhenOpenedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPlayWhenOpened(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.player}>
        <h1 className={styles.title}>White Noise</h1>

        <div className={styles.controls}>
          {/* Volume Control */}
          <div className={styles.controlGroup}>
            <label htmlFor="volume" className={styles.label}>
              Volume: {volume}
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.slider}
            />
          </div>

          {/* Timer Control */}
          <div className={styles.controlGroup}>
            <label htmlFor="timer" className={styles.label}>
              Timer: {timerMinutes === 0 ? 'Off' : `${timerMinutes} min`}
            </label>
            <input
              id="timer"
              type="range"
              min="0"
              max="60"
              value={timerMinutes}
              onChange={handleTimerChange}
              className={styles.slider}
            />
          </div>

          {/* Timer Display */}
          {timerState.isActive && (
            <div className={styles.timerDisplay}>
              Time remaining: {formatTime(timerState.remainingSeconds)}
            </div>
          )}

          {/* Play/Stop Button */}
          <button
            onClick={handlePlayStop}
            className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
            aria-label={isPlaying ? 'Stop' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Play When Opened Checkbox */}
          <div className={styles.checkboxGroup}>
            <label htmlFor="playWhenOpened" className={styles.checkboxLabel}>
              <input
                id="playWhenOpened"
                type="checkbox"
                checked={playWhenOpened}
                onChange={handlePlayWhenOpenedChange}
                className={styles.checkbox}
              />
              <span>Play when opened</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
