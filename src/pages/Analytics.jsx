import React from "react";
import { useProgress } from "../hooks/useProgress";
import { useUserData } from "../hooks/useUserData";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PokerBackground from "../components/PokerBackground";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { progress, loading: progressLoading } = useProgress();
  const { data: tasks, loading: tasksLoading } = useUserData("tasks");
  const { data: habits, loading: habitsLoading } = useUserData("habits");

  const loading = progressLoading || tasksLoading || habitsLoading;

  // Calculate weekly points (mock data for now)
  const weeklyPoints = [65, 59, 80, 81, 56, 55, 40];

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Points Earned',
        data: weeklyPoints,
        borderColor: 'var(--poker-accent)',
        backgroundColor: 'rgba(220, 20, 60, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ['Badges', 'Streaks', 'Points'],
    datasets: [
      {
        data: [
          progress?.badges?.length || 0, 
          (progress?.streaks && Object.keys(progress.streaks).length > 0) 
            ? Math.max(...Object.values(progress.streaks)) 
            : 0, 
          progress?.points || 0
        ],
        backgroundColor: [
          'var(--poker-accent)',
          'var(--poker-gold)',
          '#1e90ff'
        ],
      },
    ],
  };

  const taskCompletionData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          tasks?.filter(t => t.done).length || 0,
          tasks?.filter(t => !t.done).length || 0
        ],
        backgroundColor: ['#22c55e', 'var(--poker-accent)'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        labels: { 
          color: 'var(--poker-text)',
          font: { size: 12 }
        } 
      }
    },
    scales: {
      x: { 
        ticks: { color: 'var(--poker-text)' }, 
        grid: { color: 'rgba(255,255,255,0.1)' } 
      },
      y: { 
        ticks: { color: 'var(--poker-text)' }, 
        grid: { color: 'rgba(255,255,255,0.1)' } 
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <PokerBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p style={{ color: 'var(--poker-text)' }}>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <div 
        className="relative z-10 max-w-6xl mx-auto p-4 md:p-6" 
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--poker-text)' }}>
              Analytics
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--poker-muted)' }}>
              High-level view of your points, badges and completion.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="poker-card text-center p-6">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-3xl font-bold mb-2">
              {progress?.points || 0}
            </p>
            <p className="text-sm opacity-70">Total points</p>
          </div>
          <div className="poker-card text-center p-6">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-3xl font-bold mb-2" style={{ color: 'var(--poker-gold)' }}>
              {progress?.badges?.length || 0}
            </p>
            <p className="text-sm opacity-70">Badges</p>
          </div>
          <div className="poker-card text-center p-6">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-3xl font-bold mb-2" style={{ color: 'var(--poker-accent)' }}>
              {(progress?.streaks && Object.keys(progress.streaks).length > 0) 
                ? Math.max(...Object.values(progress.streaks)) 
                : 0}
            </p>
            <p className="text-sm opacity-70">Longest Streak</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="poker-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
              Weekly Points Trend
            </h3>
            <div style={{ height: '250px' }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
          <div className="poker-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
              Achievement Distribution
            </h3>
            <div style={{ height: '250px' }}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Task Stats */}
        <div className="poker-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
            Task Completion
          </h3>
          <div style={{ height: '200px' }}>
            <Bar data={taskCompletionData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
