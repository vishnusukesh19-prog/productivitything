import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserData } from "../hooks/useUserData";
import { useProgress } from "../hooks/useProgress";
import TaskCard from "../components/TaskCard";
import DailyPot from "../components/DailyPot";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function Tasks() {
  const {
    data: tasks = [],
    loading,
    addItem,
    updateItem,
    deleteItem,
  } = useUserData("tasks");
  const { addPoints, progress } = useProgress();
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const toggleDone = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const basePoints = task.points || 10;
      const bonus = task.bonus || 0;
      const now = new Date();
      await updateItem(id, {
        done: !task.done,
        completedAt: !task.done ? now.toISOString() : null,
      });
      if (!task.done) {
        addPoints(basePoints + bonus, "Task completed");
      }
    } catch (error) {
      alert("Update failed");
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const points = 10 + Math.floor(Math.random() * 5);
      await addItem({
        title: newTask.trim(),
        done: false,
        pomodoros: 0,
        points,
        bonus: 0,
        priority: "medium",
        category: "general",
      });
      setNewTask("");
    } catch (error) {
      alert("Add failed");
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteItem(id);
    } catch (error) {
      alert("Delete failed");
    }
  };

  const startPomodoro = (task) => {
    navigate("/timer", { state: { task } });
  };

  const today = new Date();
  const completedToday =
    tasks.filter(
      (t) =>
        t.done &&
        t.completedAt &&
        new Date(t.completedAt).toDateString() === today.toDateString()
    ).length || 0;
  const totalToday = 3;

  const filteredTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => t.done);
    if (filter === "today") {
      return tasks.filter(
        (t) =>
          t.completedAt &&
          new Date(t.completedAt).toDateString() === today.toDateString()
      );
    }
    return tasks;
  }, [tasks, filter, today]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-4xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⏳
          </motion.div>
          <div className="text-gray-600 dark:text-gray-400">Loading tasks...</div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 particle-bg">
      <div className="max-w-5xl mx-auto px-4 md:p-6 space-y-6">
        <motion.div
          className="flex items-center justify-between gap-4 flex-wrap"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="section-header font-heading">Tasks</h1>
            <p className="section-subtitle">
              Capture, prioritise, and complete what matters today.
            </p>
          </div>
        </motion.div>

        <DailyPot
          completed={completedToday}
          total={totalToday}
          points={progress?.points || 0}
        />

        {/* Filter Buttons */}
        <motion.div
          className="flex gap-2 text-xs md:text-sm flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { id: "all", label: "All" },
            { id: "today", label: "Today" },
            { id: "completed", label: "Completed" },
          ].map((f) => (
            <motion.button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full border-2 font-semibold transition-all duration-300 ${
                filter === f.id
                  ? "border-primary-500 bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Add Task Form */}
        <motion.div
          className="card p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              className="input flex-1"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <motion.button
              onClick={addTask}
              className="btn-primary px-6 py-3 text-sm md:text-base font-bold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusIcon className="w-5 h-5" />
              Add Task
            </motion.button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 Tip: Keep your list small. Three to five important tasks is enough
            for a focused day.
          </p>
        </motion.div>

        {/* Task List */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onToggle={toggleDone}
                onDelete={deleteTask}
                onStartTimer={startPomodoro}
              />
            ))}
          </div>
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            className="text-center mt-12 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              📝
            </motion.div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-semibold">
              No tasks in this view—switch filters or add a new one above.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
