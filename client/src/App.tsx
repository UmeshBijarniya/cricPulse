import React, { useEffect } from 'react';
import { useMatchStore } from './store/useMatchStore';
import { socketService } from './services/socketService';
import { Header } from './components/Header';
import { LiveMatchHero } from './components/LiveMatchHero';
import { WinProbabilityBar } from './components/WinProbabilityBar';
import { ActiveBatsmen } from './components/ActiveBatsmen';
import { ActiveBowler } from './components/ActiveBowler';
import { OverWormChart } from './components/OverWormChart';
import { BallCommentaryFeed } from './components/BallCommentaryFeed';
import { FullScorecard } from './components/FullScorecard';
import { SkeletonLoader, OfflineBanner, EmptyState } from './components/EdgeStates';
import { CelebrationBanner } from './components/CelebrationBanner';
import { Radio, Users, LineChart, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const match = useMatchStore((state) => state.match);
  const isLoading = useMatchStore((state) => state.isLoading);
  const activeTab = useMatchStore((state) => state.activeTab);
  const setActiveTab = useMatchStore((state) => state.setActiveTab);
  const fetchInitialMatch = useMatchStore((state) => state.fetchInitialMatch);

  useEffect(() => {
    // 1. Fetch initial match data for instant hydration
    fetchInitialMatch();

    // 2. Open real-time WebSocket connection
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, [fetchInitialMatch]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Header />

      {/* Offline Toast Banner */}
      <OfflineBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        {isLoading && !match ? (
          <SkeletonLoader />
        ) : !match ? (
          <EmptyState />
        ) : (
          <>
            {/* Match Won Celebration Banner */}
            <CelebrationBanner />

            {/* Live Match Hero Display */}
            <LiveMatchHero />

            {/* Smart Win Predictor Bar */}
            <WinProbabilityBar />

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
              <button
                onClick={() => setActiveTab('live')}
                className={`inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'live'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Live Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('scorecard')}
                className={`inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'scorecard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Full Scorecard</span>
              </button>

              <button
                onClick={() => setActiveTab('worm')}
                className={`inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'worm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>Run Rate Analytics</span>
              </button>
            </div>

            {/* Tab: Full Scorecard */}
            {activeTab === 'scorecard' && <FullScorecard />}

            {/* Tab: Run Rate Analytics Only */}
            {activeTab === 'worm' && (
              <div className="space-y-6">
                <OverWormChart />
              </div>
            )}

            {/* Tab: Primary Live Dashboard */}
            {activeTab === 'live' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left 7 Columns: Active Players & Analytics Chart */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Active Batters & Bowler in 2-col or stacked */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ActiveBatsmen />
                    <ActiveBowler />
                  </div>

                  {/* Over Worm Chart */}
                  <OverWormChart />
                </div>

                {/* Right 5 Columns: Live Ball Commentary Feed */}
                <div className="lg:col-span-5 sticky top-24">
                  <BallCommentaryFeed />
                </div>

              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-heading font-extrabold text-slate-900 text-sm">
              Cric<span className="text-emerald-600">Pulse</span>
            </span>
            <span>• Intermediate-Level Live Cricket Match Center & Smart Analytics Tracker</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Realistic In-Memory Engine</span>
            </span>
            <span>•</span>
            <span>WebSocket Live Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
