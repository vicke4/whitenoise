# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**White Noise Now** is a browser-based white noise and brown noise generator built with Astro, React, and Tailwind CSS. The app generates continuous, loop-free audio using the Web Audio API and features an interactive gesture-based UI for controlling volume and timers.

## Development Commands

All commands use `pnpm`:

- `pnpm install` - Install dependencies
- `pnpm dev` - Start dev server at `localhost:4321`
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview production build locally
- `pnpm astro ...` - Run Astro CLI commands (e.g., `pnpm astro check`)

## Tech Stack

- **Framework**: Astro 5 with React integration (`@astrojs/react`)
- **UI Library**: React 19 with hooks (functional components only)
- **Styling**: Tailwind CSS 4 via Vite plugin (`@tailwindcss/vite`)
- **Icons**: `lucide-react`
- **TypeScript**: Configured with `astro/tsconfigs/strict`, JSX set to `react-jsx`

## Architecture

### Entry Point
- `src/pages/index.astro` - Main page that imports and renders the React app with `client:load` directive
- Imports global CSS from `src/styles/global.css` (which loads Tailwind)

### Core Application
- `src/components/app.tsx` - Entry point of the app
  - Uses Web Audio API for real-time noise generation (brown and white noise)
  - Implements custom drag interaction system for volume and timer control
  - No state management library - uses React hooks (useState, useEffect, useRef, useCallback)
  - All audio processing happens client-side in browser

### Layout
- `src/layouts/Layout.astro` - Base HTML layout template with minimal styling

### Styling
- Tailwind CSS 4 configured via Vite plugin (no separate config file needed)
- Global styles in `src/styles/global.css`
- Component styles use Tailwind utility classes
- Custom animations defined inline with `<style>` tags in components

## Key Implementation Details

### Audio System
The app generates noise programmatically rather than playing audio files:
- `createNoiseBuffer()` generates white or brown noise buffers using Web Audio API
- Audio context (`AudioContext`) with gain node for volume control
- Buffer source nodes loop continuously for seamless playback
- Switching noise types recreates the buffer source on-the-fly

### Interaction Model
- **Vertical drag**: Adjusts volume (0-100%)
- **Horizontal drag**: Sets sleep timer (0-120 minutes, snaps to 5-minute increments)
- Mouse and touch events handled separately for cross-device support
- Feedback overlay shows current values during drag

### Timer Behavior
- Fades out volume during last 5 seconds
- Auto-stops playback when timer expires
- Interval cleared and reset when playback stops or timer is set to 0

## Build Output
- Production build outputs to `dist/` directory
- Static site generation (SSG) via Astro
- React components hydrated client-side with `client:load`

## Important Conventions

### Component Structure
- The app mounts from `app.tsx` and imports several other components
- Use functional components with hooks, no class components

### State Management
- All state lives in the main component using React hooks
- Audio references stored in `useRef` to persist across renders without triggering updates

### Styling Approach
- Use Tailwind utility classes directly in JSX
- Responsive variants (e.g., `md:text-sm`) for mobile-first design
- Dynamic styles via `style` prop for values that change frequently (volume, dimensions, opacity)

### TypeScript
- Strict mode enabled via Astro config
- No explicit prop types defined (relying on inference)
- Event handlers typed implicitly via React event types
