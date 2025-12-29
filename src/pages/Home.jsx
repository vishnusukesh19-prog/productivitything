import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DailyPot from "../components/DailyPot";
import { useAuth } from "../contexts/AuthContext";
import { useUserData } from "../hooks/useUserData";
import { useProgress } from "../hooks/useProgress";
import {
  CheckCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesSolid } from "@heroicons/react/24/solid";

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
      icon: CheckCircleIcon,
      description: "Capture a quick todo",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Start Timer",
      to: "/timer",
      icon: ClockIcon,
      description: "25 min focus block",
      gradient: "from-orange-500 to-red-500",
    },
    {
      label: "Add Note",
      to: "/notes",
      icon: DocumentTextIcon,
      description: "Jot down ideas",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Log Habit",
      to: "/habits",
      icon: FireIcon,
      description: "Mark habit done",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  const featureTiles = [
    {
      to: "/tasks",
      icon: CheckCircleIcon,
      title: "Tasks",
      desc: "Prioritise work with points",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      to: "/calendar",
      icon: CalendarIcon,
      title: "Calendar",
      desc: "See your week at a glance",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      to: "/notes",
      icon: DocumentTextIcon,
      title: "Notes",
      desc: "Lightweight scratchpad",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      to: "/timer",
      icon: ClockIcon,
      title: "Focus Timer",
      desc: "Pomodoro cycles",
      gradient: "from-orange-500 to-red-500",
    },
    {
      to: "/habits",
      icon: FireIcon,
      title: "Habits",
      desc: "Daily streaks",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      to: "/analytics",
      icon: ChartBarIcon,
      title: "Analytics",
      desc: "Trends & insights",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      to: "/gamification",
      icon: TrophyIcon,
      title: "Achievements",
      desc: "Ranks and badges",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      to: "/study-groups",
      icon: UserGroupIcon,
      title: "Study Groups",
      desc: "Share with friends",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 particle-bg">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">
        {/* Hero Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-gradient p-6 md:p-8 relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-accent-500/5"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            
            <div className="relative z-10">
              <motion.div
                className="flex items-center gap-2 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SparklesSolid className="w-6 h-6 text-primary-500 animate-pulse" />
                <p className="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 font-bold">
                  OVERVIEW
                </p>
              </motion.div>
              
              <motion.h1
                className="text-3xl md:text-5xl font-bold mb-2 gradient-text font-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {greeting}, {displayName}! 👋
              </motion.h1>
              
              <motion.p
                className="text-base md:text-lg text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Here's your snapshot for today. Keep it light, finish the few things that matter.
              </motion.p>
            </div>
          </div>

          <DailyPot
            completed={completedToday}
            total={totalTodayGoal}
            points={progress?.points || 0}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="card p-5 md:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BoltIcon className="w-5 h-5 text-accent-500" />
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Quick Actions
            </p>
          </div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.label} variants={itemVariants}>
                  <Link
                    to={action.to}
                    className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 flex flex-col gap-2 overflow-hidden"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${action.gradient} bg-clip-text text-transparent`} />
                    </motion.div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-50">
                      {action.label}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {action.description}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          className="card p-5 md:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
                Today's Tasks
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A quick preview of what's on your plate
              </p>
            </div>
            <Link
              to="/tasks"
              className="btn-secondary text-xs px-4 py-2 font-semibold"
            >
              View All
            </Link>
          </div>

          <div className="space-y-2 mt-4">
            {activeTasks.length === 0 && (
              <motion.p
                className="text-sm text-gray-600 dark:text-gray-400 text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No active tasks yet. Add one to give yourself a small win! 🎯
              </motion.p>
            )}
            {activeTasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 group hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {task.title}
                  </span>
                  {task.description && (
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {task.description}
                    </span>
                  )}
                </div>
                <motion.span
                  className="badge-primary text-xs font-bold"
                  whileHover={{ scale: 1.1 }}
                >
                  {task.points || 10} pts
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          className="card p-5 md:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
                Weekly Productivity
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A snapshot of how things are trending
              </p>
            </div>
            <Link
              to="/analytics"
              className="btn-secondary text-xs px-4 py-2 font-semibold"
            >
              View Analytics
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: "Points", value: weeklySummary.totalPoints, icon: SparklesIcon, color: "from-primary-500 to-purple-500" },
              { label: "Completed", value: weeklySummary.completedTasks, icon: CheckCircleIcon, color: "from-accent-400 to-emerald-500" },
              { label: "Longest Streak", value: weeklySummary.longestStreak, icon: FireIcon, color: "from-orange-500 to-red-500" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 p-4 text-center group hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} mb-2`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <p className="text-xs mb-1 text-gray-600 dark:text-gray-400 font-semibold">
                    {stat.label}
                  </p>
                  <motion.p
                    className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-heading`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Feature Tiles */}
        <section className="pb-4">
          <motion.h2
            className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50 font-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Workspace Sections
          </motion.h2>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featureTiles.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.to}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    to={feature.to}
                    className="card-glow p-5 h-full flex flex-col justify-between group relative overflow-hidden"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-sm font-bold mb-1 text-gray-900 dark:text-gray-50 font-heading">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
