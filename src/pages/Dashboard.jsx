import React from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import { useUserData } from "../hooks/useUserData";
import { motion } from "framer-motion";
import PokerBackground from "../components/PokerBackground";
import DailyPot from "../components/DailyPot";

export default function Dashboard() {
  const { progress } = useProgress();
  const { data: tasks } = useUserData("tasks");
  
  const completedToday = tasks?.filter(t => {
    if (!t.done) return false;
    const completedDate = t.completedAt ? new Date(t.completedAt) : null;
    const today = new Date();
    return completedDate && 
           completedDate.getDate() === today.getDate() &&
           completedDate.getMonth() === today.getMonth() &&
           completedDate.getFullYear() === today.getFullYear();
  }).length || 0;
  
  const totalToday = 3; // Daily goal
  const dailyPoints = progress?.points || 0;

  const features = [
    { to: "/tasks", icon: "✅", title: "Tasks", desc: "Prioritise and finish faster", color: "green" },
    { to: "/calendar", icon: "📆", title: "Calendar", desc: "Plan your week in one view", color: "red" },
    { to: "/notes", icon: "✍️", title: "Notes", desc: "Capture ideas beside your work", color: "blue" },
    { to: "/timer", icon: "⏱️", title: "Focus timer", desc: "Stay present with sessions", color: "purple" },
    { to: "/habits", icon: "🔁", title: "Habits", desc: "Keep streaks without stress", color: "green" },
    { to: "/gamification", icon: "🏅", title: "Milestones", desc: "Celebrate healthy progress", color: "red" },
    { to: "/study-groups", icon: "👥", title: "Study Groups", desc: "Co-work with peers", color: "blue" },
    { to: "/analytics", icon: "📊", title: "Analytics", desc: "See trends at a glance", color: "purple" },
  ];

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--poker-text)' }}>
              Today
            </h1>
            <p className="text-sm opacity-70" style={{ color: 'var(--poker-muted)' }}>
              Overview of tasks, focus points and shortcuts.
            </p>
          </div>
        </motion.div>

        {/* Daily Pot and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="lg:col-span-2">
            <DailyPot completed={completedToday} total={totalToday} points={dailyPoints} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="poker-card p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl mb-2">📈</div>
              <p className="text-2xl font-bold mb-1">
                {progress?.points || 0}
              </p>
              <p className="text-xs opacity-70">Total points</p>
            </motion.div>
            <motion.div
              className="poker-card p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--poker-accent)' }}>
                {Math.max(...Object.values(progress?.streaks || {})) || 0}
              </p>
              <p className="text-xs opacity-70">Streak</p>
            </motion.div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link to={feature.to} className={`poker-card ${feature.color} p-6 text-center block h-full`}>
                <motion.div
                  className="text-5xl mb-3"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--poker-text)' }}>
                  {feature.title}
                </h3>
                <p className="text-xs opacity-70">{feature.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
