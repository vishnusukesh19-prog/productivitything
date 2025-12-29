import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useProgress } from "../hooks/useProgress";
import { useBlocker } from "../hooks/useBlocker";
import PokerBackground from "../components/PokerBackground";

export default function Timer() {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;
  const CYCLES_FOR_LONG = 4;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("work");
  const [cycle, setCycle] = useState(1);
  const intervalRef = useRef(null);
  const [sessions, setSessions] = useState([]);

  const { addPoints, unlockBadge } = useProgress();
  const { startBlock, stopBlock } = useBlocker();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins: mins.toString().padStart(2, '0'), secs: secs.toString().padStart(2, '0') };
  };

  const getDuration = useCallback(() => {
    switch (phase) {
      case "work": return WORK_TIME;
      case "short": return SHORT_BREAK;
      case "long": return LONG_BREAK;
      default: return WORK_TIME;
    }
  }, [phase]);

  const getPhaseName = () => {
    switch (phase) {
      case "work": return "Work Session";
      case "short": return "Short Break";
      case "long": return "Long Break";
      default: return "Work Session";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "work": return "var(--poker-accent)";
      case "short": return "var(--poker-gold)";
      case "long": return "#1e90ff";
      default: return "var(--poker-accent)";
    }
  };

  const switchPhase = useCallback(async () => {
    let newPhase, newCycle;
    if (phase === "work") {
      await addPoints(10, 'Pomodoro complete');
      if (cycle % CYCLES_FOR_LONG === 0) {
        await unlockBadge('pomodoro-marathon');
      }
      setSessions((prev) => [
        {
          id: `${Date.now()}-${prev.length}`,
          type: "Work",
          durationMinutes: 25,
          completedAt: new Date().toISOString(),
        },
        ...prev.slice(0, 9),
      ]);
      newCycle = cycle;
      newPhase = cycle < CYCLES_FOR_LONG ? "short" : "long";
      if (newPhase === "long") newCycle = 1;
    } else {
      newPhase = "work";
      newCycle = phase === "long" ? 1 : cycle + 1;
    }
    setPhase(newPhase);
    setCycle(newCycle);
    const duration = newPhase === "work" ? WORK_TIME : newPhase === "short" ? SHORT_BREAK : LONG_BREAK;
    setTimeLeft(duration);
  }, [phase, cycle, addPoints, unlockBadge]);

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

  // Reset timeLeft when phase changes
  useEffect(() => {
    const duration = getDuration();
    setTimeLeft(duration);
  }, [phase, getDuration]);

  const resetTimer = () => {
    stopBlock();
    setIsRunning(false);
    setPhase("work");
    setCycle(1);
    setTimeLeft(WORK_TIME);
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
  const phaseColor = getPhaseColor();
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PokerBackground />
      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 
              className="text-3xl md:text-4xl font-bold mb-2" 
              style={{ color: 'var(--poker-text)' }}
            >
              Focus timer
            </h1>
            <p className="text-sm opacity-70" style={{ color: 'var(--poker-muted)' }}>
              Classic 25 / 5 Pomodoro cycles with breaks.
            </p>
          </div>
        </div>

        <div className="poker-card p-6 md:p-8 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          {/* Timer Circle + current phase */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex gap-2">
              <span className="text-xs px-3 py-1 rounded-full border border-white/10" style={{ color: phaseColor }}>
                {phaseName}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border border-white/10" style={{ color: 'var(--poker-muted)' }}>
                Cycle {cycle} / {CYCLES_FOR_LONG}
              </span>
            </div>

            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke={phaseColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    filter: `drop-shadow(0 0 10px ${phaseColor})`,
                    transition: 'stroke-dashoffset 1s linear'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div 
                    className="text-5xl font-bold font-mono mb-1"
                    style={{ color: 'var(--poker-text)' }}
                  >
                    {mins}:{secs}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Presets and controls */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                className={`p-2 rounded-lg border ${phase === 'work' ? 'border-white/40' : 'border-white/10'}`}
                style={{ color: phase === 'work' ? phaseColor : 'var(--poker-muted)' }}
                onClick={() => { setPhase("work"); setTimeLeft(WORK_TIME); }}
              >
                Work · 25m
              </button>
              <button
                type="button"
                className={`p-2 rounded-lg border ${phase === 'short' ? 'border-white/40' : 'border-white/10'}`}
                style={{ color: phase === 'short' ? phaseColor : 'var(--poker-muted)' }}
                onClick={() => { setPhase("short"); setTimeLeft(SHORT_BREAK); }}
              >
                Short break
              </button>
              <button
                type="button"
                className={`p-2 rounded-lg border ${phase === 'long' ? 'border-white/40' : 'border-white/10'}`}
                style={{ color: phase === 'long' ? phaseColor : 'var(--poker-muted)' }}
                onClick={() => { setPhase("long"); setTimeLeft(LONG_BREAK); }}
              >
                Long break
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
              onClick={toggleTimer}
              className="w-20 h-20 rounded-full text-2xl font-bold mx-auto block transition-all duration-200 shadow-2xl transform poker-button"
              style={{ 
                background: `linear-gradient(135deg, ${phaseColor} 0%, ${phase === 'work' ? '#b91c1c' : phase === 'short' ? '#d97706' : '#2563eb'} 100%)`
              }}
            >
              {isRunning ? '⏸' : '▶'}
                </button>
                <button 
              onClick={resetTimer} 
              className="poker-button secondary px-6 py-3"
            >
              Reset
                </button>
              </div>
              <p className="text-xs" style={{ color: 'var(--poker-muted)' }}>
                Points are awarded automatically each time a work session completes.
              </p>
            </div>
          </div>
        </div>

        {/* Session history */}
        <div className="mt-6 poker-card p-4 md:p-5">
          <h2
            className="text-sm md:text-base font-semibold mb-3"
            style={{ color: "var(--poker-text)" }}
          >
            Recent sessions
          </h2>
          {sessions.length === 0 ? (
            <p
              className="text-xs opacity-70"
              style={{ color: "var(--poker-muted)" }}
            >
              Once you complete a focus block, it will appear here with a
              timestamp.
            </p>
          ) : (
            <div className="space-y-2 text-xs md:text-sm">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2"
                >
                  <span>
                    {s.type} · {s.durationMinutes} min
                  </span>
                  <span style={{ color: "var(--poker-muted)" }}>
                    {new Date(s.completedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
