# White Noise Player App

## Overview
A Progressive Web App (PWA) built with Astro and React that plays white noise with customizable volume and timer controls.

## Tech Stack
- **Framework**: Astro 5.x with React 19
- **Language**: TypeScript
- **Audio Library**: use-sound (built on Howler.js)
- **Styling**: CSS Modules
- **State Persistence**: localStorage

## Project Structure

```
src/
├── components/
│   ├── WhiteNoisePlayer.tsx        # Main player component (~120 lines)
│   └── WhiteNoisePlayer.module.css # Dark mode styling (~200 lines)
├── hooks/
│   └── useWhiteNoise.ts            # Audio player logic (~140 lines)
├── utils/
│   ├── storage.ts                  # localStorage management (~35 lines)
│   └── timer.ts                    # Timer hook and utilities (~70 lines)
├── layouts/
│   └── Layout.astro                # Global layout with dark mode
└── pages/
    └── index.astro                 # Entry point

public/
├── whitenoise.opus                 # Smallest, modern browsers
├── whitenoise.m4a                  # Apple devices fallback
└── whitenoise.mp3                  # Universal fallback
```

## Key Features

### Audio Playback
- **Format Support**: Primary opus format with m4a and mp3 fallbacks for browser compatibility
- **Library**: use-sound hook provides declarative API with access to Howler.js instance
- **Looping**: Audio loops continuously until stopped
- **Fade Out**: 3-second fade when timer expires (using Howler's fade method)

### Controls
1. **Play/Stop Button**: Toggles audio playback with visual state indication
2. **Volume Control**: Range input (0-100, default 50) with real-time adjustment
3. **Timer**: Range input (0-60 minutes) with countdown display in MM:SS format
4. **Auto-play**: "Play when opened" checkbox enables automatic playback on load

### State Persistence
- **Storage**: localStorage for simplicity and PWA compatibility
- **Saved State**: Volume, timer setting, and auto-play preference
- **Load on Mount**: Restores previous settings automatically

## Implementation Details

### Audio Format Strategy
The app attempts to load audio in this order:
1. `.opus` - Smallest file size, supported by modern browsers
2. `.m4a` - Fallback for Apple devices
3. `.mp3` - Universal fallback

### Timer Behavior
- When timer is set and playing, countdown begins
- Changing timer value while playing restarts the countdown
- Setting timer to 0 disables the timer
- Timer expiration triggers 3-second fade out before stopping

### Auto-play Logic
- Uses `hasAutoPlayed` ref to prevent multiple auto-play attempts
- Only triggers once when component mounts
- Respects saved volume and timer settings

## Development Commands
```bash
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

## Dependencies
- `use-sound`: React hook for audio playback
- `@types/howler`: TypeScript types for Howler.js
- Audio files stored in `/public` directory

## Design
- **Color Scheme**: Dark mode with gradient backgrounds (#1a1a2e to #16213e)
- **Accent Color**: Purple (#6c63ff) for controls and highlights
- **Responsive**: Mobile-first design with breakpoints at 480px
- **Glassmorphism**: Translucent player card with backdrop blur
