import React from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { Sparkles, TrendingUp } from 'lucide-react';

export const WinProbabilityBar: React.FC = () => {
  const match = useMatchStore((state) => state.match);

  if (!match) return null;

  const { winProbability, battingTeam, bowlingTeam } = match;
  const batPct = winProbability.battingTeam;
  const bowlPct = winProbability.bowlingTeam;

  const isBattingFavored = batPct >= 50;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-heading font-bold text-sm text-slate-900">
            Smart Win Predictor
          </span>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Real-Time AI Model
          </span>
        </div>

        <div className="flex items-center space-x-1 text-xs font-semibold text-slate-600">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isBattingFavored
              ? `${battingTeam.shortName} favored by ${batPct}%`
              : `${bowlingTeam.shortName} favored by ${bowlPct}%`}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        <div className="h-5 sm:h-6 w-full bg-amber-400 rounded-full overflow-hidden flex shadow-inner">
          {/* Batting Team portion (e.g. India Blue) */}
          <div
            style={{ width: `${batPct}%` }}
            className="h-full bg-gradient-to-r from-blue-700 to-blue-500 transition-all duration-700 ease-out flex items-center justify-start pl-3 text-white text-[11px] font-bold overflow-hidden select-none whitespace-nowrap"
          >
            {batPct >= 20 && `${battingTeam.shortName} ${batPct}%`}
          </div>

          {/* Bowling Team portion (e.g. Australia Gold) */}
          <div
            style={{ width: `${bowlPct}%` }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700 ease-out flex items-center justify-end pr-3 text-amber-950 text-[11px] font-bold overflow-hidden select-none whitespace-nowrap"
          >
            {bowlPct >= 20 && `${bowlPct}% ${bowlingTeam.shortName}`}
          </div>
        </div>

        {/* 50% Equilibrium Center Pin */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/70 pointer-events-none -translate-x-1/2 shadow-xs"></div>
      </div>

      {/* Team Probabilities Legend Footer */}
      <div className="flex items-center justify-between mt-3 text-xs font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
          <span className="font-semibold text-slate-800">{battingTeam.name}</span>
          <span className="font-extrabold text-blue-600 text-sm">{batPct}%</span>
        </div>

        <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
          Recalculated on every ball delivery
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-amber-600 text-sm">{bowlPct}%</span>
          <span className="font-semibold text-slate-800">{bowlingTeam.name}</span>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
        </div>
      </div>
    </div>
  );
};
