import React from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { Shield } from 'lucide-react';

export const ActiveBatsmen: React.FC = () => {
  const match = useMatchStore((state) => state.match);

  if (!match) return null;

  const { striker, nonStriker } = match;
  const currentPartnershipRuns = striker.runs + nonStriker.runs;
  const currentPartnershipBalls = striker.balls + nonStriker.balls;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="px-4 py-3 sm:px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Current Batters
          </h3>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Partnership: <span className="font-bold text-slate-800">{currentPartnershipRuns}</span> runs ({currentPartnershipBalls}b)
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-2.5 px-4 sm:px-5 font-semibold">Batter</th>
              <th className="py-2.5 px-3 text-right font-semibold">R</th>
              <th className="py-2.5 px-3 text-right font-semibold">B</th>
              <th className="py-2.5 px-3 text-right font-semibold">4s</th>
              <th className="py-2.5 px-3 text-right font-semibold">6s</th>
              <th className="py-2.5 px-4 sm:px-5 text-right font-semibold">SR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Striker */}
            <tr className="bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors">
              <td className="py-3 px-4 sm:px-5 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="text-sm select-none" title="On Strike">🏏</span>
                  <span className="font-bold text-slate-900">{striker.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                </div>
              </td>
              <td className="py-3 px-3 text-right font-extrabold text-slate-900 text-base">
                {striker.runs}
              </td>
              <td className="py-3 px-3 text-right text-slate-500 font-medium">
                {striker.balls}
              </td>
              <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                {striker.fours}
              </td>
              <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                {striker.sixes}
              </td>
              <td className="py-3 px-4 sm:px-5 text-right font-bold text-emerald-700">
                {striker.strikeRate.toFixed(1)}
              </td>
            </tr>

            {/* Non-Striker */}
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-4 sm:px-5 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="w-4 inline-block text-center text-slate-300">•</span>
                  <span className="font-semibold text-slate-700">{nonStriker.name}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-right font-bold text-slate-800 text-base">
                {nonStriker.runs}
              </td>
              <td className="py-3 px-3 text-right text-slate-500 font-medium">
                {nonStriker.balls}
              </td>
              <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                {nonStriker.fours}
              </td>
              <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                {nonStriker.sixes}
              </td>
              <td className="py-3 px-4 sm:px-5 text-right font-bold text-slate-700">
                {nonStriker.strikeRate.toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
