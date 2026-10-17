import { create } from 'zustand';
import type {
  MatchState,
  DeliveryOutcome,
  ConnectionStatus,
  OverSummary,
} from '../types/cricket';

interface MatchStoreState {
  match: MatchState | null;
  connectionStatus: ConnectionStatus;
  error: string | null;
  isLoading: boolean;
  lastBall: DeliveryOutcome | null;
  ballFlash: boolean;
  activeTab: 'live' | 'worm' | 'scorecard' | 'commentary';
  ballFilter: 'all' | 'boundaries' | 'wickets';
  
  // Actions
  setMatch: (match: MatchState) => void;
  onBallUpdate: (ball: DeliveryOutcome, match: MatchState) => void;
  onOverCompleted: (overNumber: number, overSummary: OverSummary, match: MatchState) => void;
  onWicketFall: (payload: any) => void;
  onMatchCompleted: (winner: string, match: MatchState) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: 'live' | 'worm' | 'scorecard' | 'commentary') => void;
  setBallFilter: (filter: 'all' | 'boundaries' | 'wickets') => void;
  fetchInitialMatch: () => Promise<void>;
  togglePlay: () => Promise<void>;
  restartMatch: () => Promise<void>;
  setSpeed: (speedMs: number) => Promise<void>;
  stepNextBall: () => Promise<void>;
}

const getApiBase = () => {
  const envApi = import.meta.env.VITE_API_URL;
  if (envApi) return envApi.replace(/\/$/, '');
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocalDev && window.location.port !== '4000') {
    return 'http://localhost:4000';
  }
  return '';
};

export const useMatchStore = create<MatchStoreState>((set, get) => ({
  match: null,
  connectionStatus: 'connecting',
  error: null,
  isLoading: true,
  lastBall: null,
  ballFlash: false,
  activeTab: 'live',
  ballFilter: 'all',

  setMatch: (match) => {
    set({
      match,
      isLoading: false,
      lastBall: match.recentBalls && match.recentBalls.length > 0 ? match.recentBalls[0] : null,
      error: null,
    });
  },

  onBallUpdate: (ball, match) => {
    set({
      match,
      lastBall: ball,
      ballFlash: true,
      error: null,
    });
    setTimeout(() => {
      set({ ballFlash: false });
    }, 800);
  },

  onOverCompleted: (_overNumber, _overSummary, match) => {
    set({ match });
  },

  onWicketFall: (_payload) => {
    // Can trigger custom visual alert if needed
  },

  onMatchCompleted: (_winner, match) => {
    set({ match });
  },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },

  setError: (error) => {
    set({ error });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setBallFilter: (filter) => {
    set({ ballFilter: filter });
  },

  fetchInitialMatch: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`${getApiBase()}/api/match/current`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        set({
          match: json.data,
          isLoading: false,
          lastBall: json.data.recentBalls && json.data.recentBalls.length > 0 ? json.data.recentBalls[0] : null,
          error: null,
        });
      } else {
        throw new Error('Failed to parse match data');
      }
    } catch (err: any) {
      console.warn('Initial REST hydration error, will retry via WebSocket:', err.message);
      set({ isLoading: false });
    }
  },

  togglePlay: async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/match/toggle`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        set({ match: json.data });
      }
    } catch (err: any) {
      console.error('Error toggling play state:', err);
    }
  },

  restartMatch: async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/match/restart`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        set({ match: json.data, lastBall: null });
      }
    } catch (err: any) {
      console.error('Error restarting match:', err);
    }
  },

  setSpeed: async (speedMs: number) => {
    try {
      await fetch(`${getApiBase()}/api/match/speed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speedMs }),
      });
      const current = get().match;
      if (current) {
        set({ match: { ...current, speedMs } });
      }
    } catch (err: any) {
      console.error('Error updating speed:', err);
    }
  },

  stepNextBall: async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/match/next-ball`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        const last = json.data.recentBalls && json.data.recentBalls.length > 0 ? json.data.recentBalls[0] : null;
        set({ match: json.data, lastBall: last, ballFlash: true });
        setTimeout(() => set({ ballFlash: false }), 800);
      }
    } catch (err: any) {
      console.error('Error stepping ball:', err);
    }
  },
}));
