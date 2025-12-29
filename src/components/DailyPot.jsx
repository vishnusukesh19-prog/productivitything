import React from 'react';
import { motion } from 'framer-motion';

export default function DailyPot({ completed, total, points }) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <motion.div
      className="productivity-pot"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--poker-gold)' }}>
            Daily Pot
          </h3>
          <p className="text-sm opacity-80">
            {completed}/{total} Tasks Completed
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold" style={{ color: 'var(--poker-gold)' }}>
            {points}
          </p>
          <p className="text-xs opacity-70">Points</p>
        </div>
      </div>
      <div className="poker-progress">
        <motion.div
          className="poker-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}


