import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import { useProgress } from "../hooks/useProgress";
import PokerBackground from "../components/PokerBackground";
import TaskCard from "../components/TaskCard";
import DailyPot from "../components/DailyPot";

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
      <div className="p-6 text-center" style={{ color: "var(--poker-text)" }}>
        Loading tasks...
      </div>
    );

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--poker-text)" }}
            >
              Tasks
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--poker-muted)" }}
            >
              Capture, prioritise, and complete what matters today.
            </p>
          </div>
          <div className="flex gap-2 text-xs md:text-sm">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full border ${
                filter === "all"
                  ? "border-white/60 bg-white/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("today")}
              className={`px-3 py-1 rounded-full border ${
                filter === "today"
                  ? "border-white/60 bg-white/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-full border ${
                filter === "completed"
                  ? "border-white/60 bg-white/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="mb-2">
          <DailyPot
            completed={completedToday}
            total={totalToday}
            points={progress?.points || 0}
          />
        </div>

        <div className="poker-card p-4 md:p-5 space-y-3">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <input
              type="text"
              className="poker-input flex-1"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button
              onClick={addTask}
              className="poker-button px-5 py-3 text-sm md:text-base"
            >
              Add task
            </button>
          </div>
          <p
            className="text-xs opacity-70"
            style={{ color: "var(--poker-muted)" }}
          >
            Tip: Keep your list small. Three to five important tasks is enough
            for a focused day.
          </p>
        </div>

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

        {filteredTasks.length === 0 && (
          <p
            className="text-center mt-8 text-lg"
            style={{ color: "var(--poker-text)", opacity: 0.7 }}
          >
            No tasks in this view—switch filters or add a new one above.
          </p>
        )}
      </div>
    </div>
  );
}