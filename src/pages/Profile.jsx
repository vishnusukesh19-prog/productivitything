import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../hooks/useProgress";
import { useUserData } from "../hooks/useUserData";
import { auth } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  User,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Settings,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react";
import Confetti from "react-confetti";

const motivationalQuotes = [
  "You're crushing it! 🚀",
  "Keep up the amazing work! 💪",
  "You're on fire today! 🔥",
  "Every step counts! ✨",
  "You're unstoppable! 🌟",
  "Progress, not perfection! 📈",
];

export default function Profile() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { data: tasks } = useUserData("tasks");
  const { data: habits } = useUserData("habits");
  const { data: sessions } = useUserData("sessions");
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [randomQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Calculate stats
  const completedTasks = tasks?.filter((t) => t.done).length || 0;
  const totalTasks = tasks?.length || 0;
  const activeHabits = habits?.filter((h) => !h.archived).length || 0;
  const totalBadges = progress?.badges?.length || 0;
  const longestStreak =
    progress?.streaks && Object.keys(progress.streaks).length > 0
      ? Math.max(...Object.values(progress.streaks))
      : 0;
  
  // Calculate total focus time
  const totalFocusMinutes = sessions?.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) || 0;
  const totalFocusHours = Math.floor(totalFocusMinutes / 60);
  const totalFocusMins = totalFocusMinutes % 60;

  // Level system (based on points)
  const totalPoints = progress?.points || 0;
  const calculateLevel = (points) => {
    return Math.floor(points / 100) + 1;
  };
  const currentLevel = calculateLevel(totalPoints);
  const pointsInCurrentLevel = totalPoints % 100;
  const pointsToNextLevel = 100 - pointsInCurrentLevel;
  const levelProgress = (pointsInCurrentLevel / 100) * 100;

  const levelNames = [
    "Beginner",
    "Rising Star",
    "Focused",
    "Dedicated",
    "Consistent",
    "Disciplined",
    "Master",
    "Elite",
    "Legendary",
    "Unstoppable",
  ];
  const levelName = levelNames[Math.min(currentLevel - 1, levelNames.length - 1)] || "Champion";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (user && displayName.trim()) {
        await updateProfile(user, { displayName: displayName.trim() });
        setIsEditing(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  // Recent activity
  const recentActivity = [
    ...(sessions?.slice(0, 3).map((s) => ({
      type: "session",
      icon: Clock,
      text: `Completed ${s.durationMinutes || 0} min focus session`,
      time: s.completedAt || s.createdAt,
      color: "text-primary-500",
    })) || []),
    ...(tasks?.filter((t) => t.done && t.completedAt)
      .slice(0, 2)
      .map((t) => ({
        type: "task",
        icon: CheckCircle2,
        text: `Completed task: ${t.title}`,
        time: t.completedAt,
        color: "text-accent-500",
      })) || []),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  const achievements = [
    { id: "starter", name: "Starter", icon: "⭐", unlocked: totalPoints >= 50 },
    { id: "focus-master", name: "Focus Master", icon: "🔥", unlocked: totalFocusMinutes >= 500 },
    { id: "streak-king", name: "Streak King", icon: "👑", unlocked: longestStreak >= 7 },
    { id: "task-completer", name: "Task Completer", icon: "✅", unlocked: completedTasks >= 50 },
    { id: "habit-hero", name: "Habit Hero", icon: "🔄", unlocked: activeHabits >= 5 },
    { id: "level-up", name: "Level Up", icon: "📈", unlocked: currentLevel >= 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-space-dark dark:via-space-dark dark:to-space-dark py-8 particle-bg">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 md:p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          className="card-premium p-8 md:p-10 relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-accent-500/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 via-purple-600 to-accent-500 p-1 animate-pulse-glow"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full bg-space-dark flex items-center justify-center text-4xl md:text-5xl font-bold text-white">
                    {user?.displayName?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "?"}
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-gradient-to-br from-accent-400 to-emerald-500 rounded-full p-2 shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-premium w-full md:w-auto"
                    placeholder="Display Name"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-center md:justify-start">
                    <motion.button
                      onClick={handleUpdateProfile}
                      className="btn-primary flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(user?.displayName || "");
                      }}
                      className="btn-secondary flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold mb-2 gradient-text font-heading"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {user?.displayName || "Student"}
                  </motion.h1>
                  <motion.p
                    className="text-gray-600 dark:text-gray-400 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {user?.email}
                  </motion.p>
                  <motion.div
                    className="flex flex-wrap items-center gap-4 justify-center md:justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20">
                      <Trophy className="w-5 h-5 text-primary-500" />
                      <span className="font-bold text-primary-500">{totalPoints}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-500/10 to-emerald-500/10 border border-accent-500/20">
                      <Flame className="w-5 h-5 text-accent-500" />
                      <span className="font-bold text-accent-500">{longestStreak}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Day Streak</span>
                    </div>
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </motion.button>
                  </motion.div>
                  <motion.p
                    className="mt-4 text-lg font-semibold gradient-text-accent animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {randomQuote}
                  </motion.p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Level System */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
                Level {currentLevel} – {levelName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pointsToNextLevel} points until Level {currentLevel + 1}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text font-heading">
                {currentLevel}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Level</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 via-purple-600 to-accent-500 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            {
              icon: Clock,
              label: "Focus Time",
              value: `${totalFocusHours}h ${totalFocusMins}m`,
              color: "from-primary-500 to-indigo-600",
              bgColor: "from-primary-500/10 to-indigo-600/10",
            },
            {
              icon: CheckCircle2,
              label: "Tasks",
              value: `${completedTasks}/${totalTasks}`,
              color: "from-accent-400 to-emerald-500",
              bgColor: "from-accent-500/10 to-emerald-500/10",
            },
            {
              icon: Flame,
              label: "Habits",
              value: activeHabits,
              color: "from-orange-500 to-red-500",
              bgColor: "from-orange-500/10 to-red-500/10",
            },
            {
              icon: Trophy,
              label: "Achievements",
              value: totalBadges,
              color: "from-yellow-500 to-orange-500",
              bgColor: "from-yellow-500/10 to-orange-500/10",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`card-glow p-6 text-center bg-gradient-to-br ${stat.bgColor} border-0`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Achievements Showcase */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
              Achievements
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  achievement.unlocked
                    ? "border-accent-500/50 bg-gradient-to-br from-accent-500/10 to-emerald-500/10"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-50"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: achievement.unlocked ? 1.1 : 1,
                  rotate: achievement.unlocked ? [0, -5, 5, -5, 0] : 0,
                }}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p
                  className={`font-semibold ${
                    achievement.unlocked
                      ? "text-gray-900 dark:text-gray-50"
                      : "text-gray-500 dark:text-gray-500"
                  }`}
                >
                  {achievement.name}
                </p>
                {achievement.unlocked && (
                  <motion.div
                    className="mt-2 text-xs text-accent-500 font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✓ Unlocked
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${activity.color} bg-opacity-10`}
                    >
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No recent activity yet. Start completing tasks and sessions to see your progress!
              </p>
            )}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
              Account Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-50">User ID</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {user?.uid?.substring(0, 20)}...
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-50">Email Verified</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.emailVerified ? "✓ Verified" : "✗ Not verified"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-50">Member Since</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={() => navigate("/dashboard")}
                className="btn-primary flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Dashboard
              </motion.button>
              <motion.button
                onClick={() => navigate("/analytics")}
                className="btn-secondary flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Analytics
              </motion.button>
              <motion.button
                onClick={handleSignOut}
                className="btn-accent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
