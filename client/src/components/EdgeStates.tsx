import React from 'react';
import { WifiOff, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { socketService } from '../services/socketService';
import { useMatchStore } from '../store/useMatchStore';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-64 bg-slate-200/70 rounded-2xl w-full"></div>

      {/* Win Probability Skeleton */}
      <div className="h-24 bg-slate-200/60 rounded-2xl w-full"></div>

      {/* Grid of Players Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-56 bg-slate-200/60 rounded-2xl w-full"></div>
        <div className="h-56 bg-slate-200/60 rounded-2xl w-full"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="h-80 bg-slate-200/50 rounded-2xl w-full"></div>
    </div>
  );
};

export const OfflineBanner: React.FC = () => {
  const connectionStatus = useMatchStore((state) => state.connectionStatus);
  const error = useMatchStore((state) => state.error);

  if (connectionStatus !== 'offline') return null;

  return (
    <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 text-rose-800 text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            {error || 'WebSocket connection lost. Live ball-by-ball updates paused.'}
          </span>
        </div>

        <button
          onClick={() => socketService.connect()}
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors shadow-2xs cursor-pointer text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Reconnection</span>
        </button>
      </div>
    </div>
  );
};

export const EmptyState: React.FC = () => {
  const restartMatch = useMatchStore((state) => state.restartMatch);

  return (
    <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-heading font-extrabold text-xl text-slate-900">
          No Match Currently Live
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Start the realistic in-memory match simulation to stream live scores, ball commentary, and win analytics.
        </p>
      </div>

      <button
        onClick={restartMatch}
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors cursor-pointer"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Launch ICC Final Simulation</span>
      </button>
    </div>
  );
};
