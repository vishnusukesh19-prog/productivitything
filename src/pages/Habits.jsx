import React, { useState } from "react";
import { useUserData } from "../hooks/useUserData";
import { useProgress } from "../hooks/useProgress";
import { motion } from "framer-motion";

export default function Habits() {
  const { data: habits, loading, addItem, updateItem, deleteItem } = useUserData("habits");
  const { updateStreak, progress, addPoints } = useProgress();
  const [newHabit, setNewHabit] = useState("");

  const toggleDone = async (id) => {
    try {
      const habit = habits.find((h) => h.id === id);
      const wasDone = habit.done;
      await updateItem(id, { done: !habit.done });
      
      if (!wasDone) {
        // Marking as done
        await updateStreak(id, true);
        await addPoints(10, 'Habit completed');
      } else {
        // Unmarking - reset streak
        await updateStreak(id, false);
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed');
    }
  };

  const addHabit = async () => {
    if (newHabit.trim() === "") return;
    try {
      await addItem({ 
        title: newHabit.trim(), 
        done: false, 
        streak: 0,
        createdAt: new Date().toISOString()
      });
      setNewHabit("");
    } catch (error) {
      console.error('Add failed:', error);
      alert('Add failed');
    }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm('Delete this habit?')) return;
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-space-dark dark:via-gray-900 dark:to-space-dark flex items-center justify-center">
      <div className="text-center text-gray-600 dark:text-gray-300">
        Loading habits...
      </div>
    </div>
  );

  const habitStreaks = progress?.streaks || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-space-dark dark:via-gray-900 dark:to-space-dark py-8">
      <div className="max-w-4xl mx-auto px-4 md:p-6">
        {/* Header Card */}
        <div className="card-premium p-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 font-heading mb-2">
            Habits
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Keep track of the small things you want to repeat.
          </p>
        </div>

        {/* Add Habit */}
        <div className="card p-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1 rounded-l-lg"
              placeholder="Create a new habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <button onClick={addHabit} className="btn-primary rounded-r-lg px-6">
              Add Habit
            </button>
          </div>
        </div>

        {/* Habit List */}
        <div className="space-y-3 mb-8">
          {habits.map((habit, index) => {
            const streak = habitStreaks[habit.id] || 0;
            return (
              <motion.div 
                key={habit.id} 
                className="card border-accent-500/30 dark:border-accent-500/30 flex justify-between items-center p-4 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={habit.done || false}
                    onChange={() => toggleDone(habit.id)}
                    className="w-5 h-5 rounded cursor-pointer accent-primary-500"
                  />
                  <div className="flex-1">
                    <span 
                      className={`font-medium text-lg text-gray-900 dark:text-gray-50 ${habit.done ? "line-through opacity-50" : ""}`}
                    >
                      {habit.title}
                    </span>
                    {streak > 0 && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-accent-500 dark:text-accent-400 font-semibold">
                        🔥 {streak} day streak
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-400 hover:text-red-300 dark:text-red-500 dark:hover:text-red-400 text-lg ml-2 transition-colors"
                >
                  🗑️
                </button>
              </motion.div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
              No habits yet—create one above.
            </p>
          </div>
        )}

        {/* Badge Gallery */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-50 font-heading">
            🏆 Achievement Badges
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {progress?.badges?.map((badge, i) => (
              <motion.div 
                key={i} 
                className="px-3 py-1 text-sm rounded-full border border-primary-500/30 dark:border-primary-500/30 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 flex items-center gap-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <span>🏆</span> {badge.id}
              </motion.div>
            ))}
            {(!progress?.badges || progress.badges.length === 0) && (
              <p className="text-gray-600 dark:text-gray-300">
                Keep building streaks to unlock badges!
              </p>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Total points: <span className="font-bold text-primary-500 dark:text-primary-400">{progress?.points || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
