import React, { useState } from "react";
import { useUserData } from "../hooks/useUserData";
import { useProgress } from "../hooks/useProgress";
import PokerBackground from "../components/PokerBackground";

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
    <div className="min-h-screen relative flex items-center justify-center">
      <PokerBackground />
      <div className="relative z-10 text-center" style={{ color: 'var(--poker-text)' }}>
        Loading habits...
      </div>
    </div>
  );

  const habitStreaks = progress?.streaks || {};

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-6">
        <div
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--poker-text)' }}>
              Habits
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--poker-muted)' }}>
              Keep track of the small things you want to repeat.
            </p>
          </div>
        </div>

        {/* Add Habit */}
        <div className="flex mb-6 gap-2">
          <input
            type="text"
            className="poker-input flex-1 rounded-l-lg"
            placeholder="Create a new habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <button onClick={addHabit} className="poker-button rounded-r-lg px-6">
            Add Habit
          </button>
        </div>

        {/* Habit List */}
        <div className="space-y-3 mb-8">
          {habits.map((habit, index) => {
            const streak = habitStreaks[habit.id] || 0;
            return (
              <div 
                key={habit.id} 
                className="poker-card green flex justify-between items-center p-4"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={habit.done || false}
                    onChange={() => toggleDone(habit.id)}
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{ accentColor: 'var(--poker-accent)' }}
                  />
                  <div className="flex-1">
                    <span 
                      className={`font-medium text-lg ${habit.done ? "line-through opacity-50" : ""}`}
                    >
                      {habit.title}
                    </span>
                    {streak > 0 && (
                      <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--poker-muted)' }}>
                        🔥 {streak} day streak
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-400 hover:text-red-300 text-lg ml-2"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <p 
            className="text-center mt-8 text-lg"
            style={{ color: 'var(--poker-text)', opacity: 0.7 }}
          >
            No habits yet—create one above.
          </p>
        )}

        {/* Badge Gallery */}
        <div className="poker-card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
            🏆 Achievement Badges
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {progress?.badges?.map((badge, i) => (
              <motion.div 
                key={i} 
                className="px-3 py-1 text-sm rounded-full border border-white/10 bg-white/5 flex items-center gap-1"
              >
                <span>🏆</span> {badge.id}
              </motion.div>
            ))}
            {(!progress?.badges || progress.badges.length === 0) && (
              <p style={{ color: 'var(--poker-text)', opacity: 0.7 }}>
                Keep building streaks to unlock badges!
              </p>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--poker-text)', opacity: 0.8 }}>
            Total points: <span className="font-bold">{progress?.points || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
