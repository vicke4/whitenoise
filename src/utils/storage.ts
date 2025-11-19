export interface AppState {
  volume: number;
  timer: number;
  playWhenOpened: boolean;
}

const STORAGE_KEY = 'whitenoise-app-state';

const defaultState: AppState = {
  volume: 50,
  timer: 0,
  playWhenOpened: false,
};

export const saveAppState = (state: Partial<AppState>): void => {
  try {
    const currentState = loadAppState();
    const newState = { ...currentState, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
};

export const loadAppState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load app state:', error);
  }
  return defaultState;
};
