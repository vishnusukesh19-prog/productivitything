import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../hooks/useProgress";
import { useUserData } from "../hooks/useUserData";
import { auth } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PokerBackground from "../components/PokerBackground";

export default function Profile() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { data: tasks } = useUserData("tasks");
  const { data: habits } = useUserData("habits");
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(false);

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
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const completedTasks = tasks?.filter(t => t.done).length || 0;
  const totalTasks = tasks?.length || 0;
  const activeHabits = habits?.filter(h => !h.archived).length || 0;
  const totalBadges = progress?.badges?.length || 0;
  const longestStreak = progress?.streaks && Object.keys(progress.streaks).length > 0
    ? Math.max(...Object.values(progress.streaks))
    : 0;

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <motion.div
        className="relative z-10 max-w-4xl mx-auto p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--poker-text)' }}>
              Profile
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--poker-muted)' }}>
              Update your name and see a snapshot of your activity.
            </p>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="poker-card p-6 md:p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--poker-gold) 0%, var(--poker-accent) 100%)',
                  color: 'var(--poker-bg)'
                }}
              >
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="absolute -bottom-2 -right-2 poker-chip yellow" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>
                {progress?.points || 0}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="poker-input w-full"
                    placeholder="Display Name"
                  />
                  <div className="flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={handleUpdateProfile}
                      className="poker-button px-4 py-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(user?.displayName || "");
                      }}
                      className="poker-button secondary px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--poker-gold)' }}>
                    {user?.displayName || "Player"}
                  </h2>
                  <p className="opacity-70 mb-4">{user?.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="poker-button secondary px-4 py-2 text-sm"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="poker-card text-center p-4"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl mb-2">📋</div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--poker-gold)' }}>
              {completedTasks}/{totalTasks}
            </p>
            <p className="text-xs opacity-70">Tasks</p>
          </motion.div>
          <motion.div
            className="poker-card text-center p-4"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--poker-gold)' }}>
              {activeHabits}
            </p>
            <p className="text-xs opacity-70">Habits</p>
          </motion.div>
          <motion.div
            className="poker-card text-center p-4"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--poker-gold)' }}>
              {totalBadges}
            </p>
            <p className="text-xs opacity-70">Badges</p>
          </motion.div>
          <motion.div
            className="poker-card text-center p-4"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--poker-gold)' }}>
              {longestStreak}
            </p>
            <p className="text-xs opacity-70">Streak</p>
          </motion.div>
        </div>

        {/* Account Info */}
        <motion.div
          className="poker-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="opacity-70">User ID:</span>
              <span className="text-sm font-mono">{user?.uid?.substring(0, 20)}...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">Email Verified:</span>
              <span>{user?.emailVerified ? "✓" : "✗"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">Member Since:</span>
              <span>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="poker-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
            Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="poker-button w-full"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="poker-button secondary w-full"
            >
              View Analytics
            </button>
            <button
              onClick={handleSignOut}
              className="poker-button w-full"
              style={{ background: 'var(--poker-accent)' }}
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


