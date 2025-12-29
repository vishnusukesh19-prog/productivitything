import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, FireIcon } from '@heroicons/react/24/solid';

export default function DailyPot({ completed, total, points }) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference * (1 - progress / 100);
  
  return (
    <motion.div
      className="card-gradient p-6 md:p-8 relative overflow-hidden particle-bg"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-accent-500/10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Progress Circle */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32">
            <svg
              width="128"
              height="128"
              viewBox="0 0 128 128"
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="rgba(99, 102, 241, 0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold gradient-text font-heading"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  {completed}/{total}
                </motion.div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
                  Tasks
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          <div className="text-center md:text-left">
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SparklesIcon className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
                Daily Progress
              </h3>
            </motion.div>
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {completed === total
                ? "🎉 Amazing! You've completed all tasks today!"
                : `${total - completed} more task${total - completed !== 1 ? 's' : ''} to go!`}
            </motion.p>
          </div>

          <motion.div
            className="text-center px-6 py-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-200/50 dark:border-primary-800/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="flex items-center gap-2 justify-center mb-1"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FireIcon className="w-6 h-6 text-accent-500" />
            </motion.div>
            <motion.div
              className="text-4xl font-bold gradient-text font-heading"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {points}
            </motion.div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
              Total Points
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="mt-6 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
