import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "../hooks/useProgress";
import { useBlocker } from "../hooks/useBlocker";
import { useUserData } from "../hooks/useUserData";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import Confetti from "react-confetti";

export default function Timer() {
  const DEFAULT_WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;
  const CYCLES_FOR_LONG = 4;

  const [workDuration, setWorkDuration] = useState(DEFAULT_WORK_TIME);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("work");
  const [cycle, setCycle] = useState(1);
  const intervalRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const { addPoints, unlockBadge } = useProgress();
  const { startBlock, stopBlock } = useBlocker();
  const { addItem: addSession } = useUserData("sessions");

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins: mins.toString().padStart(2, "0"), secs: secs.toString().padStart(2, "0") };
  };

  const getDuration = useCallback(() => {
    switch (phase) {
      case "work":
        return workDuration;
      case "short":
        return SHORT_BREAK;
      case "long":
        return LONG_BREAK;
      default:
        return workDuration;
    }
  }, [phase, workDuration]);

  const getPhaseName = () => {
    switch (phase) {
      case "work":
        return "Work Session";
      case "short":
        return "Short Break";
      case "long":
        return "Long Break";
      default:
        return "Work Session";
    }
  };

  const getPhaseColors = () => {
    switch (phase) {
      case "work":
        return {
          primary: "#6366f1",
          secondary: "#4f46e5",
          gradient: "from-primary-500 to-indigo-600",
        };
      case "short":
        return {
          primary: "#34d399",
          secondary: "#10b981",
          gradient: "from-accent-400 to-emerald-500",
        };
      case "long":
        return {
          primary: "#a78bfa",
          secondary: "#8b5cf6",
          gradient: "from-purple-500 to-indigo-600",
        };
      default:
        return {
          primary: "#6366f1",
          secondary: "#4f46e5",
          gradient: "from-primary-500 to-indigo-600",
        };
    }
  };

  const switchPhase = useCallback(
    async () => {
      let newPhase, newCycle;
      if (phase === "work") {
        await addPoints(10, "Pomodoro complete");
        if (cycle % CYCLES_FOR_LONG === 0) {
          await unlockBadge("pomodoro-marathon");
        }

        const durationMinutes = Math.round(workDuration / 60);
        const completedAt = new Date().toISOString();

        setSessions((prev) => [
          {
            id: `${Date.now()}-${prev.length}`,
            type: "Work",
            durationMinutes,
            completedAt,
          },
          ...prev.slice(0, 9),
        ]);

        try {
          await addSession({
            type: "work",
            durationMinutes,
            completedAt,
          });
        } catch (e) {
          console.error("Failed to save session:", e);
        }

        // Show confetti on work session completion
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

        newCycle = cycle;
        newPhase = cycle < CYCLES_FOR_LONG ? "short" : "long";
        if (newPhase === "long") newCycle = 1;
      } else {
        newPhase = "work";
        newCycle = phase === "long" ? 1 : cycle + 1;
      }
      setPhase(newPhase);
      setCycle(newCycle);
      const duration =
        newPhase === "work"
          ? workDuration
          : newPhase === "short"
          ? SHORT_BREAK
          : LONG_BREAK;
      setTimeLeft(duration);
    },
    [phase, cycle, workDuration, addPoints, unlockBadge, addSession]
  );

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setTimeout(() => {
              switchPhase();
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft, switchPhase]);

  useEffect(() => {
    const duration = getDuration();
    setTimeLeft(duration);
  }, [phase, getDuration]);

  const resetTimer = () => {
    stopBlock();
    setIsRunning(false);
    setPhase("work");
    setCycle(1);
    setTimeLeft(workDuration);
    setSessions([]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      startBlock();
    } else {
      stopBlock();
    }
  };

  const { mins, secs } = formatTime(timeLeft);
  const totalDuration = getDuration();
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;
  const phaseName = getPhaseName();
  const colors = getPhaseColors();
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress / 100);
  const radius = 90;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-space-dark dark:via-space-dark dark:to-space-dark py-8 particle-bg">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
          colors={["#6366f1", "#8b5cf6", "#34d399", "#a78bfa", "#ec4899"]}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 md:p-6">
        {/* Header wrapped in dark card */}
        <motion.div
          className="card-premium p-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-header font-heading text-gray-900 dark:text-gray-50">Focus Timer</h1>
          <p className="section-subtitle text-gray-600 dark:text-gray-400">
            Classic Pomodoro technique with beautiful animations
          </p>
        </motion.div>

        <div className="card-premium p-8 md:p-12 grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
          {/* Timer Circle */}
          <div className="flex flex-col items-center">
            <motion.div
              className="mb-6 flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className={`text-xs px-4 py-2 rounded-full border-2 bg-gradient-to-r ${colors.gradient} bg-opacity-10 border-current font-semibold`}
                style={{ color: colors.primary }}
              >
                {phaseName}
              </span>
              <span className="text-xs px-4 py-2 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                Cycle {cycle} / {CYCLES_FOR_LONG}
              </span>
            </motion.div>

            <div className="relative">
              <svg
                width="280"
                height="280"
                viewBox="0 0 200 200"
                className="transform -rotate-90"
              >
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.primary} />
                    <stop offset="100%" stopColor={colors.secondary} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="12"
                />

                {/* Progress circle with glow */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{
                    strokeDashoffset,
                    filter: isRunning
                      ? [
                          "drop-shadow(0 0 10px " + colors.primary + ")",
                          "drop-shadow(0 0 20px " + colors.primary + ")",
                          "drop-shadow(0 0 10px " + colors.primary + ")",
                        ]
                      : "drop-shadow(0 0 10px " + colors.primary + ")",
                  }}
                  transition={{
                    strokeDashoffset: { duration: 1, ease: "linear" },
                    filter: { duration: 2, repeat: isRunning ? Infinity : 0 },
                  }}
                />

                {/* Pulsing outer ring when running */}
                {isRunning && (
                  <motion.circle
                    cx="100"
                    cy="100"
                    r={radius + 8}
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="2"
                    opacity="0.5"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </svg>

              {/* Time display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
                >
                  <motion.div
                    className="text-6xl md:text-7xl font-bold font-mono mb-2 gradient-text font-heading"
                    key={`${mins}-${secs}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mins}:{secs}
                  </motion.div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    {Math.round(progress)}% Complete
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-6">
            {/* Phase buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "work", label: "Work", time: "25m", duration: DEFAULT_WORK_TIME },
                { id: "short", label: "Break", time: "5m", duration: SHORT_BREAK },
                { id: "long", label: "Long", time: "15m", duration: LONG_BREAK },
              ].map((btn) => {
                const isActive = phase === btn.id;
                const btnColors = getPhaseColors();
                return (
                  <motion.button
                    key={btn.id}
                    type="button"
                    onClick={() => {
                      setPhase(btn.id);
                      setTimeLeft(btn.duration);
                    }}
                    className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${btnColors.gradient} text-white border-transparent shadow-lg`
                        : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-sm font-bold">{btn.label}</div>
                    <div className="text-xs opacity-80">{btn.time}</div>
                  </motion.button>
                );
              })}
            </div>

            {/* Custom duration */}
            <div className="card p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Custom Duration
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={90}
                  value={customMinutes}
                  onChange={(e) =>
                    setCustomMinutes(Math.min(90, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className="input flex-1 text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={customSeconds}
                  onChange={(e) =>
                    setCustomSeconds(Math.min(59, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className="input flex-1 text-sm"
                  placeholder="Sec"
                />
                <motion.button
                  type="button"
                  onClick={() => {
                    const total = customMinutes * 60 + customSeconds;
                    const safeTotal = total > 0 ? total : DEFAULT_WORK_TIME;
                    setWorkDuration(safeTotal);
                    setPhase("work");
                    setTimeLeft(safeTotal);
                  }}
                  className="btn-secondary text-sm px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Set
                </motion.button>
              </div>
            </div>

            {/* Main controls */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl bg-gradient-to-br ${colors.gradient}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isRunning ? { boxShadow: [`0 0 20px ${colors.primary}`, `0 0 40px ${colors.primary}`, `0 0 20px ${colors.primary}`] } : {}}
                transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
              >
                {isRunning ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </motion.button>
              <motion.button
                onClick={resetTimer}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>

            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              💡 Points are awarded automatically when a work session completes
            </p>
          </div>
        </div>

        {/* Session history */}
        <motion.div
          className="card-premium p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 font-heading">
              Recent Sessions
            </h2>
          </div>
          <AnimatePresence>
            {sessions.length === 0 ? (
              <motion.p
                className="text-sm text-center text-gray-600 dark:text-gray-400 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Complete a focus session to see it here!
              </motion.p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s, index) => (
                  <motion.div
                    key={s.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 dark:border-primary-500/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      {s.type} · {s.durationMinutes} min
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(s.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
