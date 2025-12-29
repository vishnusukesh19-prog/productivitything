import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PokerBackground from "../components/PokerBackground";
import DailyPot from "../components/DailyPot";
import { useAuth } from "../contexts/AuthContext";
import { useUserData } from "../hooks/useUserData";
import { useProgress } from "../hooks/useProgress";

export default function Home() {
  const { user } = useAuth();
  const { data: tasks = [] } = useUserData("tasks");
  const { progress } = useProgress();

  const today = new Date();
  const displayName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "Student");

  const greeting = useMemo(() => {
    const hour = today.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, [today]);

  const completedToday =
    tasks.filter((t) => {
      if (!t.done || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate.toDateString() === today.toDateString();
    }).length || 0;

  const totalTodayGoal = 3;

  const activeTasks = tasks.filter((t) => !t.done).slice(0, 4);

  const weeklySummary = useMemo(() => {
    // Simple derived metrics – this can evolve later without breaking UI
    const totalPoints = progress?.points || 0;
    const longestStreak =
      progress?.streaks && Object.keys(progress.streaks).length > 0
        ? Math.max(...Object.values(progress.streaks))
        : 0;
    const completedTasks = tasks.filter((t) => t.done).length;

    return {
      totalPoints,
      longestStreak,
      completedTasks,
    };
  }, [progress, tasks]);

  const quickActions = [
    {
      label: "Add Task",
      to: "/tasks",
      icon: "➕",
      description: "Capture a quick todo for today.",
    },
    {
      label: "Start Timer",
      to: "/timer",
      icon: "⏱️",
      description: "Jump into a 25 minute focus block.",
    },
    {
      label: "Add Note",
      to: "/notes",
      icon: "✍️",
      description: "Jot down lecture ideas or reminders.",
    },
    {
      label: "Log Habit",
      to: "/habits",
      icon: "🔁",
      description: "Mark a habit as done today.",
    },
  ];

  const featureTiles = [
    {
      to: "/tasks",
      icon: "✅",
      title: "Tasks",
      desc: "Prioritise work with points and stars.",
      color: "green",
    },
    {
      to: "/calendar",
      icon: "📆",
      title: "Calendar",
      desc: "See your week in a single glance.",
      color: "blue",
    },
    {
      to: "/notes",
      icon: "📝",
      title: "Notes",
      desc: "Lightweight scratchpad for study ideas.",
      color: "purple",
    },
    {
      to: "/timer",
      icon: "⏳",
      title: "Focus timer",
      desc: "Pomodoro cycles that earn points.",
      color: "red",
    },
    {
      to: "/habits",
      icon: "🔥",
      title: "Habits",
      desc: "Daily streaks for the small things.",
      color: "green",
    },
    {
      to: "/analytics",
      icon: "📊",
      title: "Analytics",
      desc: "Trends for completion and focus time.",
      color: "blue",
    },
    {
      to: "/gamification",
      icon: "🏅",
      title: "Achievements",
      desc: "Ranks and badges when you stay consistent.",
      color: "purple",
    },
    {
      to: "/study-groups",
      icon: "👥",
      title: "Study groups",
      desc: "Share quick updates with friends.",
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PokerBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">
        {/* Top row: greeting + daily focus + timer preview */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 md:gap-6">
          {/* Greeting + Daily overview */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="poker-card p-5 md:p-6">
              <p
                className="text-xs uppercase tracking-[0.25em] mb-2"
                style={{ color: "var(--poker-muted)" }}
              >
                OVERVIEW
              </p>
              <h1
                className="text-2xl md:text-4xl font-bold mb-1"
                style={{ color: "var(--poker-text)" }}
              >
                {greeting}, {displayName}
              </h1>
              <p
                className="text-sm md:text-base opacity-80"
                style={{ color: "var(--poker-muted)" }}
              >
                Here&apos;s your snapshot for today. Keep it light, finish the
                few things that matter.
              </p>
            </div>

            <DailyPot
              completed={completedToday}
              total={totalTodayGoal}
              points={progress?.points || 0}
            />
          </motion.div>

          {/* Active timer preview + quick actions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="poker-card p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "var(--poker-muted)" }}
                  >
                    Active timer
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--poker-text)" }}
                  >
                    Next: 25:00 work · 5:00 break
                  </p>
                </div>
                <Link to="/timer" className="text-xs poker-button px-3 py-1">
                  Open timer
                </Link>
              </div>
              <div className="mt-3">
                <div className="poker-progress mb-2">
                  <div
                    className="poker-progress-bar"
                    style={{ width: "35%" }}
                  />
                </div>
                <p
                  className="text-xs opacity-70"
                  style={{ color: "var(--poker-muted)" }}
                >
                  You earn points for every completed focus block.
                </p>
              </div>
            </div>

            <div className="poker-card p-4 md:p-5">
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: "var(--poker-muted)" }}
              >
                Quick actions
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors flex flex-col gap-1"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--poker-text)" }}
                    >
                      {action.label}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--poker-muted)" }}
                    >
                      {action.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle row: Today’s tasks + Weekly summary */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 md:gap-6">
          {/* Today tasks snapshot */}
          <motion.div
            className="poker-card p-4 md:p-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2
                  className="text-lg md:text-xl font-bold"
                  style={{ color: "var(--poker-text)" }}
                >
                  Today&apos;s tasks
                </h2>
                <p
                  className="text-xs opacity-70"
                  style={{ color: "var(--poker-muted)" }}
                >
                  A quick preview of what&apos;s on your plate.
                </p>
              </div>
              <Link
                to="/tasks"
                className="text-xs poker-button secondary px-3 py-1"
              >
                Open tasks
              </Link>
            </div>

            <div className="space-y-2 mt-3">
              {activeTasks.length === 0 && (
                <p
                  className="text-sm opacity-70"
                  style={{ color: "var(--poker-muted)" }}
                >
                  No active tasks yet. Add one to give yourself a small win.
                </p>
              )}
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--poker-text)" }}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span
                        className="text-xs opacity-70"
                        style={{ color: "var(--poker-muted)" }}
                      >
                        {task.description}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(148,163,184,0.2)",
                      color: "var(--poker-text)",
                    }}
                  >
                    {task.points || 10} pts
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly summary */}
          <motion.div
            className="poker-card p-4 md:p-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2
                  className="text-lg md:text-xl font-bold"
                  style={{ color: "var(--poker-text)" }}
                >
                  Weekly productivity
                </h2>
                <p
                  className="text-xs opacity-70"
                  style={{ color: "var(--poker-muted)" }}
                >
                  A gentle snapshot of how things are trending.
                </p>
              </div>
              <Link
                to="/analytics"
                className="text-xs poker-button secondary px-3 py-1"
              >
                View analytics
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs mb-1" style={{ color: "var(--poker-muted)" }}>
                  Points
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--poker-gold)" }}
                >
                  {weeklySummary.totalPoints}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs mb-1" style={{ color: "var(--poker-muted)" }}>
                  Completed
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--poker-accent)" }}
                >
                  {weeklySummary.completedTasks}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs mb-1" style={{ color: "var(--poker-muted)" }}>
                  Longest streak
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--poker-text)" }}
                >
                  {weeklySummary.longestStreak}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom row: navigation tiles */}
        <section className="pb-4">
          <h2
            className="text-lg md:text-xl font-semibold mb-3"
            style={{ color: "var(--poker-text)" }}
          >
            Workspace sections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featureTiles.map((feature, index) => (
              <motion.div
                key={feature.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  to={feature.to}
                  className={`poker-card ${feature.color} p-4 h-full flex flex-col justify-between`}
                >
                  <div>
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--poker-text)" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-xs opacity-80"
                      style={{ color: "var(--poker-muted)" }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
