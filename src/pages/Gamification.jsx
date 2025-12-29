import React from "react";
import { useProgress } from "../hooks/useProgress";
import { motion } from "framer-motion";
import PokerBackground from "../components/PokerBackground";

export default function Gamification() {
  const { progress, addPoints } = useProgress();

  const getRank = (points) => {
    if (points < 100) return { name: 'Bronze', color: '#cd7f32', icon: '🥉' };
    if (points < 500) return { name: 'Silver', color: '#c0c0c0', icon: '🥈' };
    if (points < 1000) return { name: 'Gold', color: '#ffd700', icon: '🥇' };
    return { name: 'Platinum', color: '#e5e4e2', icon: '💎' };
  };

  const rank = getRank(progress?.points || 0);
  const userBadges = progress?.badges || [];

  const badges = [
    { id: 'starter', name: 'Starter', points: 50, icon: '⭐', owned: userBadges.some(b => b.id === 'starter') },
    { id: 'focus-master', name: 'Focus Master', points: 100, icon: '🔥', owned: userBadges.some(b => b.id === 'focus-master') },
    { id: 'streak-king', name: 'Streak King', points: 200, icon: '👑', owned: userBadges.some(b => b.id === 'streak-king') },
  ];

  const quests = [
    { name: 'Complete 3 tasks', reward: 20, completed: false },
    { name: 'Run 4 Pomodoros', reward: 30, completed: false },
    { name: 'Daily streak x3', reward: 50, completed: false },
  ];

  const redeemBadge = async (badge) => {
    const currentPoints = progress?.points || 0;
    if (currentPoints >= badge.points && !badge.owned) {
      try {
        await addPoints(-badge.points, `Redeemed ${badge.name}`);
        alert(`${badge.name} unlocked!`);
      } catch (error) {
        console.error('Redeem failed:', error);
        alert('Failed to redeem badge');
      }
    } else {
      alert(badge.owned ? 'Already owned' : `Not enough points! Need ${badge.points}, have ${currentPoints}`);
    }
  };

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto p-4 md:p-6" 
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
              Achievements
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--poker-muted)' }}>
              Optional rewards layer on top of your normal work.
            </p>
          </div>
        </motion.div>

        {/* Rank Card */}
        <motion.div 
          className="poker-card p-6 mb-6 text-center" 
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-4">Your Rank</h3>
          <div className="text-5xl mb-2">{rank.icon}</div>
          <p className="text-2xl font-bold" style={{ color: rank.color }}>{rank.name}</p>
          <p className="text-sm mt-2 opacity-70">
            Points: <span className="font-semibold">{progress?.points || 0}</span>
          </p>
        </motion.div>

        {/* Badge Shop */}
        <motion.div 
          className="poker-card p-6 mb-6" 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
            🌟 Badge Shop
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <motion.div 
                key={i} 
                className="poker-card text-center p-4" 
                whileHover={{ scale: 1.05, rotate: 2 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-bold mb-2">{badge.name}</h4>
                <p className="text-sm opacity-70 mb-4">Cost: {badge.points} pts</p>
                <button 
                  onClick={() => redeemBadge(badge)} 
                  className="poker-button text-sm px-4 py-2"
                  disabled={badge.owned}
                  style={{ opacity: badge.owned ? 0.5 : 1, cursor: badge.owned ? 'not-allowed' : 'pointer' }}
                >
                  {badge.owned ? '✓ Owned' : 'Redeem'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Quests */}
        <motion.div 
          className="poker-card p-6" 
          initial={{ y: 40, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
            🎯 Daily Quests
          </h3>
          <div className="space-y-3">
            {quests.map((quest, i) => (
              <motion.div 
                key={i} 
                className="poker-card flex justify-between items-center p-4" 
                whileHover={{ scale: 1.02, x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span>{quest.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-70">+{quest.reward} pts</span>
                  <button 
                    className="poker-button secondary text-sm px-3 py-1"
                    disabled={quest.completed}
                    style={{ opacity: quest.completed ? 0.5 : 1 }}
                  >
                    {quest.completed ? '✓ Done' : 'Claim'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}