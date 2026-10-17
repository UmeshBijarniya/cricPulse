import React from 'react';
import { useMatchStore } from '../store/useMatchStore';
import { Play, Pause, RotateCcw, FastForward, Activity, Wifi, WifiOff } from 'lucide-react';
import { socketService } from '../services/socketService';

export const Header: React.FC = () => {
  const match = useMatchStore((state) => state.match);
  const connectionStatus = useMatchStore((state) => state.connectionStatus);
  const togglePlay = useMatchStore((state) => state.togglePlay);
  const restartMatch = useMatchStore((state) => state.restartMatch);
  const setSpeed = useMatchStore((state) => state.setSpeed);
  const stepNextBall = useMatchStore((state) => state.stepNextBall);

  const isSimulating = match?.isSimulating ?? false;
  const currentSpeed = match?.speedMs ?? 3200;

  const handleSpeedToggle = () => {
    // Cycle between 3200ms (1x), 1500ms (2x), 5000ms (0.6x)
    if (currentSpeed === 3200) {
      setSpeed(1500);
    } else if (currentSpeed === 1500) {
      setSpeed(5000);
    } else {
      setSpeed(3200);
    }
  };

  const getSpeedLabel = () => {
    if (currentSpeed <= 1600) return '2.0x Fast';
    if (currentSpeed >= 4500) return '0.6x Slow';
    return '1.0x Normal';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Match Branding */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-extrabold text-xl tracking-tight">
              <span className="translate-y-px">CP</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  Cric<span className="text-emerald-600">Pulse</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  T20 Final
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate max-w-xs md:max-w-md">
                {match ? match.title : 'Live Cricket Match Center'}
              </p>
            </div>
          </div>

          {/* Center Connection Status Badge */}
          <div className="hidden lg:flex items-center space-x-2">
            {connectionStatus === 'connected' && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 pulse-ring"></span>
                <Activity className="w-3.5 h-3.5 mr-1" />
                LIVE SYNC
              </div>
            )}
            {connectionStatus === 'reconnecting' && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <Wifi className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                RECONNECTING...
              </div>
            )}
            {connectionStatus === 'offline' && (
              <button
                onClick={() => socketService.connect()}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <WifiOff className="w-3.5 h-3.5 mr-1.5" />
                OFFLINE (Retry)
              </button>
            )}
            {connectionStatus === 'connecting' && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Activity className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                CONNECTING...
              </div>
            )}
          </div>

          {/* Right Action & Simulation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Speed toggle */}
            <button
              onClick={handleSpeedToggle}
              title="Change Simulation Speed"
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer hidden sm:flex items-center space-x-1"
            >
              <FastForward className="w-3.5 h-3.5 text-slate-500" />
              <span>{getSpeedLabel()}</span>
            </button>

            {/* Step 1 Ball */}
            <button
              onClick={stepNextBall}
              title="Step Next Delivery"
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer hidden md:inline-flex items-center"
            >
              +1 Ball
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer ${
                isSimulating
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4 mr-1.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5 fill-current" />
                  <span>Live Match</span>
                </>
              )}
            </button>

            {/* Restart Match */}
            <button
              onClick={restartMatch}
              title="Restart Match Simulation"
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
