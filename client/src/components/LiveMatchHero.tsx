import React from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { Target, TrendingUp, Clock, Flame, Award } from 'lucide-react';

export const LiveMatchHero: React.FC = () => {
  const match = useMatchStore((state) => state.match);
  const ballFlash = useMatchStore((state) => state.ballFlash);
  const lastBall = useMatchStore((state) => state.lastBall);

  if (!match) return null;

  const isCompleted = match.status === 'completed';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
      {/* Top Match Context Ribbon */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            {isCompleted ? 'MATCH FINISHED' : 'LIVE ICC FINAL'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300 truncate">{match.venue}</span>
        </div>
        <div className="text-slate-400 font-medium">
          Innings 2 of 2 (T20)
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Batting Team Score Block (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Teams Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm ring-2 ring-blue-100">
                  IND
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                      {match.battingTeam.name}
                    </h2>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      Batting
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Chasing target of {match.target} runs</p>
                </div>
              </div>

              {/* Opposition summary */}
              {match.firstInningsData && (
                <div className="text-right pl-3">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {match.bowlingTeam.shortName}
                    </span>
                    <span className="font-heading font-bold text-sm text-slate-700">
                      {match.firstInningsData.runs}/{match.firstInningsData.wickets}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">({match.firstInningsData.overs} ov)</span>
                </div>
              )}
            </div>

            {/* Big Bold Score Display */}
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pt-1">
              <div
                className={`font-heading font-black tracking-tight text-4xl sm:text-6xl text-slate-900 transition-transform duration-300 ${
                  ballFlash ? 'scale-105 text-emerald-600' : ''
                }`}
              >
                <span>{match.runs}</span>
                <span className="text-slate-400 font-light text-3xl sm:text-5xl mx-0.5">/</span>
                <span className="text-rose-600">{match.wickets}</span>
              </div>

              <div className="flex items-baseline space-x-1.5 text-slate-600">
                <span className="text-lg sm:text-2xl font-bold font-heading text-slate-800">
                  {match.overs}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase">
                  / {match.maxOvers} Ov
                </span>
              </div>

              {/* Last Ball Badge */}
              {lastBall && !isCompleted && (
                <div className="ml-auto inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-medium text-slate-400">Last ball:</span>
                  <span
                    className={`px-2 py-0.5 text-xs font-black rounded-md ${
                      lastBall.isWicket
                        ? 'bg-rose-600 text-white'
                        : lastBall.isSix
                        ? 'bg-purple-600 text-white'
                        : lastBall.isFour
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {lastBall.isWicket
                      ? 'W'
                      : lastBall.isSix
                      ? '6'
                      : lastBall.isFour
                      ? '4'
                      : lastBall.runs}
                  </span>
                </div>
              )}
            </div>

            {/* Match Situation Status Pill */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-800">
                {isCompleted ? (
                  <span className="inline-flex items-center text-emerald-700">
                    <Award className="w-4 h-4 mr-1.5 text-amber-500" />
                    {match.winner || match.statusNote}
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <Flame className="w-4 h-4 mr-1.5 text-orange-500 shrink-0" />
                    {match.statusNote}
                  </span>
                )}
              </div>

              {!isCompleted && match.requiredRuns !== null && (
                <div className="inline-flex items-center space-x-2 text-xs font-medium text-slate-500">
                  <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-700 font-bold">
                    {match.ballsRemaining} balls left
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Rate Statistics & Targets Grid (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 lg:border-l lg:border-slate-200 lg:pl-6">
            
            {/* Current Run Rate (CRR) */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-white transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">CRR</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="font-heading font-black text-2xl text-slate-900">
                {match.crr.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Runs per over</span>
            </div>

            {/* Required Run Rate (RRR) */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-white transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">RRR</span>
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="font-heading font-black text-2xl text-slate-900">
                {match.rrr !== null ? match.rrr.toFixed(2) : '-'}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Required per over</span>
            </div>

            {/* Target Score */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-white transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Target</span>
                <Target className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="font-heading font-black text-2xl text-slate-900">
                {match.target ?? '-'}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">To win match</span>
            </div>

            {/* Projected Score */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-white transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Projected</span>
                <Flame className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="font-heading font-black text-2xl text-slate-900">
                {match.projectedScore}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">At current rate</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
