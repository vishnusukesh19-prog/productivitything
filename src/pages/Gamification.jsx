import React from "react";
import { useProgress } from "../hooks/useProgress";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";

export default function Gamification() {
  const { progress, claimQuest, addPoints } = useProgress();

  const getRank = (points) => {
    if (points < 100) return { name: "Bronze", color: "text-amber-600", icon: "🥉" };
    if (points < 500) return { name: "Silver", color: "text-gray-400", icon: "🥈" };
    if (points < 1000) return { name: "Gold", color: "text-yellow-500", icon: "🥇" };
    return { name: "Platinum", color: "text-accent-500", icon: "💎" };
  };

  const rank = getRank(progress?.points || 0);
  const userBadges = progress?.badges || [];
  const claimedQuests = progress?.claimedQuests || [];

  const badges = [
    {
      id: "starter",
      name: "Starter",
      points: 50,
      icon: "⭐",
      owned: userBadges.some((b) => b.id === "starter"),
    },
    {
      id: "focus-master",
      name: "Focus Master",
      points: 100,
      icon: "🔥",
      owned: userBadges.some((b) => b.id === "focus-master"),
    },
    {
      id: "streak-king",
      name: "Streak King",
      points: 200,
      icon: "👑",
      owned: userBadges.some((b) => b.id === "streak-king"),
    },
  ];

  const quests = [
    { id: "tasks-3", name: "Complete 3 tasks today", reward: 20 },
    { id: "pomodoro-4", name: "Run 4 Pomodoros", reward: 30 },
    { id: "streak-3", name: "Any habit streak ≥ 3", reward: 50 },
  ].map((q) => ({
    ...q,
    completed: claimedQuests.includes(q.id),
  }));

  const redeemBadge = async (badge) => {
    const currentPoints = progress?.points || 0;
    if (currentPoints >= badge.points && !badge.owned) {
      try {
        await addPoints(-badge.points, `Redeemed ${badge.name}`);
        toast.success(`${badge.name} unlocked! 🎉`, {
          icon: "⭐",
        });
      } catch (error) {
        console.error("Redeem failed:", error);
        toast.error("Failed to redeem badge");
      }
    } else {
      toast.warning(
        badge.owned
          ? "Already owned"
          : `Not enough points! Need ${badge.points}, have ${currentPoints}`
      );
    }
  };

  const handleClaimQuest = async (quest) => {
    if (quest.completed) {
      toast.info("Quest already claimed!");
      return;
    }
    try {
      await claimQuest(quest.id, quest.reward);
      toast.success(`Quest completed! +${quest.reward} points 🎉`, {
        icon: "✨",
      });
    } catch (error) {
      console.error("Claim quest failed:", error);
      toast.error("Failed to claim reward");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-header">Achievements</h1>
          <p className="section-subtitle">
            Optional rewards on top of your normal work. Claim, don&apos;t grind.
          </p>
        </motion.div>

        {/* Rank Card */}
        <motion.div
          className="card-gradient p-6 mb-6 text-center"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-50">Your Rank</h3>
          <div className="text-5xl mb-2">{rank.icon}</div>
          <p className={`text-2xl font-bold ${rank.color}`}>
            {rank.name}
          </p>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Points:{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-50">
              {progress?.points || 0}
            </span>
          </p>
        </motion.div>

        {/* Badge Shop */}
        <motion.div
          className="card p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="w-6 h-6 text-accent-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Badge Shop
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                className="card-asymmetric text-center p-4"
                whileHover={{ scale: 1.05, rotate: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-bold mb-2 text-gray-900 dark:text-gray-50">{badge.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Cost: {badge.points} pts
                </p>
                <button
                  onClick={() => redeemBadge(badge)}
                  className={`btn-primary w-full text-sm ${badge.owned ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={badge.owned}
                >
                  {badge.owned ? "✓ Owned" : "Redeem"}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Quests */}
        <motion.div
          className="card p-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrophyIcon className="w-6 h-6 text-primary-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Daily Quests
            </h3>
          </div>
          <div className="space-y-3">
            {quests.map((quest, i) => (
              <motion.div
                key={quest.id}
                className="card flex justify-between items-center p-4"
                whileHover={{ scale: 1.02, x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="text-gray-900 dark:text-gray-50 font-medium">{quest.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    +{quest.reward} pts
                  </span>
                  <button
                    onClick={() => handleClaimQuest(quest)}
                    className={`btn-accent text-sm px-3 py-1 ${quest.completed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={quest.completed}
                  >
                    {quest.completed ? "✓ Claimed" : "Claim"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
