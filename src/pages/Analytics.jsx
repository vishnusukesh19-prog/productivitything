import React, { useMemo } from "react";
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
} from "chart.js";

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
  const { data: tasks = [], loading: tasksLoading } = useUserData("tasks");
  const { data: habits = [], loading: habitsLoading } = useUserData("habits");
  const { data: sessions = [], loading: sessionsLoading } =
    useUserData("sessions");

  const loading =
    progressLoading || tasksLoading || habitsLoading || sessionsLoading;

  // Build last 7 days labels + study minutes from Timer sessions
  const { labels, studyMinutes, tasksCompleted } = useMemo(() => {
    const today = new Date();
    const days = [];
    const minutes = [];
    const completed = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push(d.toLocaleDateString(undefined, { weekday: "short" }));

      const minutesForDay = sessions
        .filter((s) => {
          const date = s.completedAt || s.createdAt;
          if (!date) return false;
          return new Date(date).toISOString().startsWith(key);
        })
        .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

      const tasksForDay = tasks.filter((t) => {
        if (!t.completedAt || !t.done) return false;
        return new Date(t.completedAt).toISOString().startsWith(key);
      }).length;

      minutes.push(minutesForDay);
      completed.push(tasksForDay);
    }

    return { labels: days, studyMinutes: minutes, tasksCompleted: completed };
  }, [sessions, tasks]);

  const lineData = {
    labels,
    datasets: [
      {
        label: "Study minutes",
        data: studyMinutes,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.15)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ["Badges", "Longest streak", "Points"],
    datasets: [
      {
        data: [
          progress?.badges?.length || 0,
          progress?.streaks && Object.keys(progress.streaks).length > 0
            ? Math.max(...Object.values(progress.streaks))
            : 0,
          progress?.points || 0,
        ],
        backgroundColor: [
          "#0ea5e9",
          "#f59e0b",
          "#06b6d4",
        ],
      },
    ],
  };

  const taskCompletionData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Tasks",
        data: [
          tasks.filter((t) => t.done).length || 0,
          tasks.filter((t) => !t.done).length || 0,
        ],
        backgroundColor: ["#10b981", "#0ea5e9"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#1e293b",
          font: { size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--poker-text)" }}
            >
              Analytics
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--poker-muted)" }}
            >
              Study minutes, completed tasks, and streaks at a glance.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="poker-card text-center p-6">
            <div className="text-4xl mb-2">⏱️</div>
            <p className="text-3xl font-bold mb-2">
              {studyMinutes.reduce((s, v) => s + v, 0)}
            </p>
            <p className="text-sm opacity-70">Study minutes (7 days)</p>
          </div>
          <div className="poker-card text-center p-6">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-3xl font-bold mb-2">
              {tasks.filter((t) => t.done).length}
            </p>
            <p className="text-sm opacity-70">Tasks completed</p>
          </div>
          <div className="poker-card text-center p-6">
            <div className="text-4xl mb-2">🔥</div>
            <p
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--poker-accent)" }}
            >
              {progress?.streaks && Object.keys(progress.streaks).length > 0
                ? Math.max(...Object.values(progress.streaks))
                : 0}
            </p>
            <p className="text-sm opacity-70">Longest habit streak</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="poker-card p-6">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--poker-gold)" }}
            >
              Weekly Study Time
            </h3>
            <div style={{ height: "250px" }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
          <div className="poker-card p-6">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--poker-gold)" }}
            >
              Progress Snapshot
            </h3>
            <div style={{ height: "250px" }}>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Task Stats */}
        <div className="poker-card p-6">
          <h3
            className="text-xl font-bold mb-4"
            style={{ color: "var(--poker-gold)" }}
          >
            Task Completion
          </h3>
          <div style={{ height: "200px" }}>
            <Bar data={taskCompletionData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
