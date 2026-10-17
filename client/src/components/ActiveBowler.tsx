import React from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { Target } from 'lucide-react';

export const ActiveBowler: React.FC = () => {
  const match = useMatchStore((state) => state.match);

  if (!match) return null;

  const { currentBowler, overSummaries } = match;

  // Get current over balls
  const currentOverNumber = match.completedOvers + (match.ballsInCurrentOver > 0 ? 1 : 0);
  const currentOverSummary = overSummaries.find((o) => o.overNumber === currentOverNumber);
  const currentOverBalls = currentOverSummary ? currentOverSummary.balls : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="px-4 py-3 sm:px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-blue-600" />
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Active Bowler
          </h3>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Spell: <span className="font-semibold text-slate-700">{currentBowler.overs} ov</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Bowler Name & Key Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-bold text-base text-slate-900">
              {currentBowler.name}
            </h4>
            <span className="text-xs text-slate-500 font-medium">Right-arm fast bowler</span>
          </div>

          <div className="flex items-center space-x-4 text-right">
            <div>
              <div className="font-heading font-black text-xl text-slate-900">
                {currentBowler.wickets}<span className="text-slate-400 font-light text-base">/</span>{currentBowler.runs}
              </div>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">W/R</span>
            </div>
            <div>
              <div className="font-heading font-bold text-lg text-emerald-700">
                {currentBowler.economy.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Econ</span>
            </div>
          </div>
        </div>

        {/* Current Over Deliveries Visual Sequence */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              This Over ({currentOverBalls.length}/6)
            </span>
            <span className="text-xs font-bold text-slate-700">
              {currentOverSummary ? `${currentOverSummary.runsInOver} runs` : '0 runs'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {Array.from({ length: 6 }).map((_, idx) => {
              const ballVal = currentOverBalls[idx];
              const isFilled = ballVal !== undefined;

              let ballBadgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              if (ballVal === 'W') {
                ballBadgeStyle = 'bg-rose-600 text-white border-rose-600 font-black animate-bounce';
              } else if (ballVal === '6') {
                ballBadgeStyle = 'bg-purple-600 text-white border-purple-600 font-black';
              } else if (ballVal === '4') {
                ballBadgeStyle = 'bg-emerald-600 text-white border-emerald-600 font-black';
              } else if (ballVal === 'Wd' || ballVal === 'Nb') {
                ballBadgeStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
              } else if (ballVal === '•' || ballVal === '0') {
                ballBadgeStyle = 'bg-slate-200 text-slate-700 font-semibold';
              } else if (isFilled) {
                ballBadgeStyle = 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
              }

              return (
                <div
                  key={idx}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs border transition-all ${ballBadgeStyle} ${
                    isFilled ? 'shadow-2xs' : 'border-dashed'
                  }`}
                >
                  {isFilled ? ballVal : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
