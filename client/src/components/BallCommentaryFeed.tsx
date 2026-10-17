import React from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { MessageSquare, Zap, ShieldAlert } from 'lucide-react';
import type { DeliveryOutcome } from '../types/cricket';

export const BallCommentaryFeed: React.FC = () => {
  const match = useMatchStore((state) => state.match);
  const ballFilter = useMatchStore((state) => state.ballFilter);
  const setBallFilter = useMatchStore((state) => state.setBallFilter);

  if (!match) return null;

  const deliveries = match.recentBalls || [];

  // Filter deliveries based on selected filter
  const filteredDeliveries = deliveries.filter((ball) => {
    if (ballFilter === 'boundaries') return ball.isFour || ball.isSix;
    if (ballFilter === 'wickets') return ball.isWicket;
    return true;
  });

  const getBadgeStyle = (ball: DeliveryOutcome) => {
    if (ball.isWicket) {
      return 'bg-rose-600 text-white border-rose-600 shadow-rose-200';
    }
    if (ball.isSix) {
      return 'bg-purple-600 text-white border-purple-600 shadow-purple-200';
    }
    if (ball.isFour) {
      return 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200';
    }
    if (ball.extraType === 'wide' || ball.extraType === 'no-ball') {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (ball.runs === 0) {
      return 'bg-slate-100 text-slate-600 border-slate-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getBadgeLabel = (ball: DeliveryOutcome) => {
    if (ball.isWicket) return 'W';
    if (ball.isSix) return '6';
    if (ball.isFour) return '4';
    if (ball.extraType === 'wide') return 'Wd';
    if (ball.extraType === 'no-ball') return 'Nb';
    if (ball.runs === 0) return '•';
    return String(ball.runs);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-full">
      {/* Feed Header & Filters */}
      <div className="px-4 py-3 sm:px-5 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Live Ball-by-Ball Commentary
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setBallFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              ballFilter === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setBallFilter('boundaries')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
              ballFilter === 'boundaries'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Boundaries</span>
          </button>
          <button
            onClick={() => setBallFilter('wickets')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
              ballFilter === 'wickets'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Wickets</span>
          </button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
        {filteredDeliveries.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No deliveries match the selected filter.
          </div>
        ) : (
          filteredDeliveries.map((ball, index) => {
            const isLatest = index === 0 && ballFilter === 'all';
            return (
              <div
                key={ball.id}
                className={`p-3.5 sm:p-4 hover:bg-slate-50/70 transition-all ball-enter ${
                  isLatest ? 'bg-emerald-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  
                  {/* Ball Outcome Badge */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-black border shadow-xs shrink-0 select-none ${getBadgeStyle(
                      ball
                    )}`}
                  >
                    {getBadgeLabel(ball)}
                  </div>

                  {/* Commentary Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-heading font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {ball.displayBall}
                        </span>
                        <span className="font-bold text-slate-700 truncate">
                          {ball.bowlerName} to {ball.batsmanName}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 shrink-0 pl-2">
                        <span className="font-mono font-bold text-slate-500 text-[11px]">
                          {ball.scoreAfterBall}
                        </span>
                        {isLatest && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white tracking-wider uppercase">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {ball.commentary}
                    </p>

                    {/* Win Probability Delta footer */}
                    {ball.winProbabilityAfter && (
                      <div className="mt-1.5 flex items-center space-x-2 text-[11px] text-slate-400">
                        <span>Win prob:</span>
                        <span className="font-semibold text-blue-600">
                          IND {ball.winProbabilityAfter.battingTeam}%
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-amber-600">
                          AUS {ball.winProbabilityAfter.bowlingTeam}%
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
        Live feed updates synchronously with match simulator
      </div>
    </div>
  );
};
