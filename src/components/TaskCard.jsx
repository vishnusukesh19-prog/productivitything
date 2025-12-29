import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function TaskCard({ task, onToggle, onDelete, onStartTimer, index = 0 }) {
  const cardColor = task.priority === 'high' 
    ? 'from-red-500 to-pink-500' 
    : task.priority === 'medium' 
    ? 'from-blue-500 to-cyan-500' 
    : task.category === 'study' 
    ? 'from-green-500 to-emerald-500' 
    : 'from-purple-500 to-indigo-500';
  
  const points = task.points || 10;
  const bonus = task.bonus || 0;
  const totalPoints = points + bonus;

  return (
    <motion.div
      className={`card-glow p-4 mb-4 relative overflow-hidden ${
        task.done ? 'opacity-75' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      layout
    >
      {/* Gradient background on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${cardColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start gap-4 flex-1">
          <motion.button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 mt-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {task.done ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircleSolid className="w-6 h-6 text-accent-500" />
              </motion.div>
            ) : (
              <CheckCircleIcon className="w-6 h-6 text-gray-400 hover:text-primary-500 transition-colors" />
            )}
          </motion.button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <motion.h3
                className={`font-bold text-lg ${
                  task.done
                    ? 'line-through opacity-50 text-gray-500'
                    : 'text-gray-900 dark:text-gray-50'
                }`}
                initial={false}
                animate={{
                  opacity: task.done ? 0.5 : 1,
                }}
              >
                {task.title}
              </motion.h3>
              {task.dueDate && (
                <motion.span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background:
                      task.dueDate === 'Today'
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                        : 'rgba(148, 163, 184, 0.2)',
                    color:
                      task.dueDate === 'Today'
                        ? 'rgb(99, 102, 241)'
                        : 'rgb(100, 116, 139)',
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Due {task.dueDate}
                </motion.span>
              )}
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              <motion.div
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                {[...Array(5)].map((_, i) => {
                  const filled = i < Math.floor(totalPoints / 5);
                  return (
                    <motion.span
                      key={i}
                      className={`text-sm ${
                        filled ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      ★
                    </motion.span>
                  );
                })}
              </motion.div>
              <motion.span
                className="badge-primary text-xs font-bold px-3 py-1"
                whileHover={{ scale: 1.1 }}
              >
                {totalPoints} pts
              </motion.span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {!task.done && onStartTimer && (
            <motion.button
              onClick={() => onStartTimer(task)}
              className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-600 dark:text-orange-400 hover:from-orange-200 hover:to-red-200 dark:hover:from-orange-800/50 dark:hover:to-red-800/50 transition-all"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              title="Start timer"
            >
              <ClockIcon className="w-5 h-5" />
            </motion.button>
          )}
          <motion.button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-600 dark:text-red-400 hover:from-red-200 hover:to-pink-200 dark:hover:from-red-800/50 dark:hover:to-pink-800/50 transition-all"
            whileHover={{ scale: 1.1, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            title="Delete task"
          >
            <TrashIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Completion animation overlay */}
      {task.done && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-emerald-500/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
