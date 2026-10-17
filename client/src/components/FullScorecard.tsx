import React, { useState } from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { Users } from 'lucide-react';

export const FullScorecard: React.FC = () => {
  const match = useMatchStore((state) => state.match);
  const [activeInnings, setActiveInnings] = useState<1 | 2>(2);

  if (!match) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
      {/* Innings Selector Tabs */}
      <div className="px-4 py-3 sm:px-6 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <h3 className="font-heading font-bold text-base text-slate-900">
            Official Match Scorecard
          </h3>
        </div>

        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveInnings(2)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeInnings === 2
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            India Innings (Chasing)
          </button>
          <button
            onClick={() => setActiveInnings(1)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeInnings === 1
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Australia Innings (184/5)
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {activeInnings === 2 ? (
          /* India Innings (Live) */
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider">
                  Batting — India
                </h4>
                <span className="font-heading font-black text-slate-900 text-sm">
                  {match.runs}/{match.wickets} ({match.overs} Ov)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Batter</th>
                      <th className="py-2.5 px-3 font-semibold">Dismissal</th>
                      <th className="py-2.5 px-3 text-right font-semibold">R</th>
                      <th className="py-2.5 px-3 text-right font-semibold">B</th>
                      <th className="py-2.5 px-3 text-right font-semibold">4s</th>
                      <th className="py-2.5 px-3 text-right font-semibold">6s</th>
                      <th className="py-2.5 px-4 text-right font-semibold">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {match.batsmen.map((b) => (
                      <tr
                        key={b.id}
                        className={b.isStriker ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'}
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center space-x-1.5">
                            <span>{b.name}</span>
                            {b.isStriker && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                Strike
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-xs italic">
                          {b.isOut ? b.dismissal : b.balls > 0 ? 'not out' : 'yet to bat'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                          {b.runs}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">{b.balls}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                          {b.fours}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                          {b.sixes}
                        </td>
                        <td className="py-2.5 px-4 text-right font-semibold text-slate-700">
                          {b.strikeRate.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Australia Bowling */}
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider mb-2">
                Bowling — Australia
              </h4>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Bowler</th>
                      <th className="py-2.5 px-3 text-right font-semibold">O</th>
                      <th className="py-2.5 px-3 text-right font-semibold">M</th>
                      <th className="py-2.5 px-3 text-right font-semibold">R</th>
                      <th className="py-2.5 px-3 text-right font-semibold">W</th>
                      <th className="py-2.5 px-4 text-right font-semibold">ECON</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {match.bowlers.map((bw) => (
                      <tr
                        key={bw.id}
                        className={
                          match.currentBowler.id === bw.id ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'
                        }
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center space-x-1.5">
                            <span>{bw.name}</span>
                            {match.currentBowler.id === bw.id && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                                Active
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                          {bw.overs}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">{bw.maidens}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {bw.runs}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-rose-600">
                          {bw.wickets}
                        </td>
                        <td className="py-2.5 px-4 text-right font-semibold text-emerald-700">
                          {bw.economy.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Australia Innings (1st Innings) */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-amber-900">
              <span className="font-bold">1st Innings Summary:</span> Australia finished 184/5 in
              20.0 overs after electing to bat first. Travis Head scored 68 (41) and Glenn Maxwell
              hit 36 (18). Jasprit Bumrah led the Indian bowling with 2/24 in 4 overs.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Runs</span>
                <div className="font-heading font-black text-xl text-slate-900">184</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Wickets</span>
                <div className="font-heading font-black text-xl text-slate-900">5</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Run Rate</span>
                <div className="font-heading font-black text-xl text-slate-900">9.20</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Extras</span>
                <div className="font-heading font-black text-xl text-slate-900">8</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
