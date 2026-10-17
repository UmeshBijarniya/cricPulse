import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useMatchStore } from '../store/useMatchStore';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';

export const CelebrationBanner: React.FC = () => {
  const match = useMatchStore((state) => state.match);
  const restartMatch = useMatchStore((state) => state.restartMatch);

  useEffect(() => {
    if (match?.status === 'completed') {
      try {
        // Fire celebration confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16A34A', '#2563EB', '#F59E0B', '#EF4444'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [match?.status]);

  if (match?.status !== 'completed') return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-700/20 mb-6 relative overflow-hidden">
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-15 pointer-events-none">
        <Trophy className="w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            <Trophy className="w-8 h-8 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-white/20 uppercase tracking-widest text-emerald-100">
                MATCH CONCLUDED
              </span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight mt-0.5">
              {match.winner || match.statusNote}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
              What an electrifying finish to the ICC T20 World Cup Final!
            </p>
          </div>
        </div>

        <button
          onClick={restartMatch}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition-colors shadow-sm shrink-0 cursor-pointer text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Another Match</span>
        </button>
      </div>
    </div>
  );
};
