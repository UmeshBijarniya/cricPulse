import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useMatchStore } from '../store/useMatchStore';
import { TrendingUp, BarChart2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const OverWormChart: React.FC = () => {
  const match = useMatchStore((state) => state.match);
  const [chartMode, setChartMode] = useState<'worm' | 'manhattan'>('worm');

  if (!match) return null;

  const maxOvers = match.maxOvers || 20;
  const labels = Array.from({ length: maxOvers }, (_, i) => `${i + 1}`);

  // Australia (1st Innings) data
  const ausOverSummaries = match.firstInningsData?.overSummaries || [];
  const ausCumulativeRuns = labels.map((_, idx) => {
    const overNum = idx + 1;
    const item = ausOverSummaries.find((o) => o.overNumber === overNum);
    return item ? item.cumulativeRuns : null;
  });

  const ausPerOverRuns = labels.map((_, idx) => {
    const overNum = idx + 1;
    const item = ausOverSummaries.find((o) => o.overNumber === overNum);
    return item ? item.runsInOver : 0;
  });

  // India (2nd Innings) data
  const indOverSummaries = match.overSummaries || [];
  const indCumulativeRuns = labels.map((_, idx) => {
    const overNum = idx + 1;
    const item = indOverSummaries.find((o) => o.overNumber === overNum);
    return item ? item.cumulativeRuns : null;
  });

  const indPerOverRuns = labels.map((_, idx) => {
    const overNum = idx + 1;
    const item = indOverSummaries.find((o) => o.overNumber === overNum);
    return item ? item.runsInOver : 0;
  });

  // Wickets for India: red dots
  const indPointBackgroundColors = labels.map((_, idx) => {
    const overNum = idx + 1;
    const item = indOverSummaries.find((o) => o.overNumber === overNum);
    if (item && item.wicketsInOver > 0) {
      return '#EF4444'; // Red wicket
    }
    return '#2563EB'; // India Blue
  });

  const indPointRadius = labels.map((_, idx) => {
    const overNum = idx + 1;
    const item = indOverSummaries.find((o) => o.overNumber === overNum);
    if (item && item.wicketsInOver > 0) {
      return 6; // Bigger red dot for wickets
    }
    return 3;
  });

  // Worm Chart Data (Line)
  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'India (IND)',
        data: indCumulativeRuns,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: indPointBackgroundColors,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: indPointRadius,
        pointHoverRadius: 8,
      },
      {
        label: 'Australia (AUS - 184/5)',
        data: ausCumulativeRuns,
        borderColor: '#D97706',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.25,
        pointBackgroundColor: '#D97706',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: 2.5,
        pointHoverRadius: 6,
      },
    ],
  };

  // Manhattan Chart Data (Bars)
  const barChartData = {
    labels,
    datasets: [
      {
        label: 'India (IND)',
        data: indPerOverRuns,
        backgroundColor: '#2563EB',
        borderRadius: 4,
      },
      {
        label: 'Australia (AUS)',
        data: ausPerOverRuns,
        backgroundColor: '#F59E0B',
        borderRadius: 4,
      },
    ],
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 },
          color: '#334155',
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Outfit', size: 13, weight: 700 },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          title: (items) => `End of Over ${items[0].label}`,
          afterBody: (items) => {
            const overNum = Number(items[0].label);
            const indItem = indOverSummaries.find((o) => o.overNumber === overNum);
            if (indItem && indItem.wicketsInOver > 0) {
              return `⚠️ ${indItem.wicketsInOver} WICKET(S) FELL IN THIS OVER!`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Overs',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
          color: '#64748B',
        },
        ticks: { font: { size: 11 }, color: '#64748B' },
      },
      y: {
        beginAtZero: true,
        max: 200,
        grid: { color: '#F1F5F9' },
        title: {
          display: true,
          text: 'Cumulative Runs',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
          color: '#64748B',
        },
        ticks: { stepSize: 40, font: { size: 11 }, color: '#64748B' },
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 },
          color: '#334155',
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Outfit', size: 13, weight: 700 },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          title: (items) => `Over ${items[0].label}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Over Number',
          font: { size: 11, weight: 600 },
          color: '#64748B',
        },
        ticks: { font: { size: 11 }, color: '#64748B' },
      },
      y: {
        beginAtZero: true,
        max: 25,
        grid: { color: '#F1F5F9' },
        title: {
          display: true,
          text: 'Runs in Over',
          font: { size: 11, weight: 600 },
          color: '#64748B',
        },
        ticks: { font: { size: 11 }, color: '#64748B' },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Run Rate & Worm Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Over-by-over chase trajectory with wicket fall indicators
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setChartMode('worm')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              chartMode === 'worm'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Worm Curve</span>
          </button>
          <button
            onClick={() => setChartMode('manhattan')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              chartMode === 'manhattan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Manhattan (Per Over)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-80 w-full pt-2">
        {chartMode === 'worm' ? (
          <Line data={lineChartData} options={lineOptions} />
        ) : (
          <Bar data={barChartData} options={barOptions} />
        )}
      </div>

      {/* Legend Note */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200"></span>
            <span className="font-medium text-slate-600">Red Dot = Wicket Fallen</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-amber-500"></span>
            <span className="font-medium text-slate-600">Dashed Line = Target Trajectory</span>
          </div>
        </div>
        <span className="hidden sm:inline font-medium">Hover on points for over stats</span>
      </div>
    </div>
  );
};
