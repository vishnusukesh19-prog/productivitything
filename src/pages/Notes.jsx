import React, { useEffect, useMemo, useState } from "react";

// LocalStorage keys and helpers
const CUSTOM_FILES_KEY = "custom-files-list";
const todayStr = new Date().toISOString().split("T")[0];

function getTasksForDate(date) {
  try {
    return JSON.parse(localStorage.getItem(`tasks-${date}`) || "[]");
  } catch {
    return [];
  }
}

function saveTasks(date, tasks) {
  localStorage.setItem(`tasks-${date}`, JSON.stringify(tasks));
}

function getAllTaskEntries() {
  const entries = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("tasks-")) {
      const date = key.slice(6);
      const tasks = JSON.parse(localStorage.getItem(key) || "[]");
      tasks.forEach((task) => entries.push({ task, date }));
    }
  }
  return entries;
}

function getCustomFilesList() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_FILES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCustomFilesList(list) {
  localStorage.setItem(CUSTOM_FILES_KEY, JSON.stringify(list));
}

function formatDateLabel(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateOnly(str) {
  return new Date(str).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDeadline(str) {
  if (!str) return "";
  const d = new Date(str.replace(" ", "T"));
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Notes() {
  // Mode and date
  const [mode, setMode] = useState("daily"); // 'daily' | 'custom'
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [currentView, setCurrentView] = useState("day"); // 'day' | 'unfinishedAll' | 'completedAll'
  const [dayFilter, setDayFilter] = useState("all");

  // Notes
  const [noteText, setNoteText] = useState("");
  const [statusHint, setStatusHint] = useState("");

  // Tasks and points
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(
    () => parseInt(localStorage.getItem("points") || "0", 10) || 0
  );

  // New task
  const [newTaskText, setNewTaskText] = useState("");

  // Custom files
  const [customFiles, setCustomFiles] = useState(() => getCustomFilesList());
  const [activeCustomFile, setActiveCustomFile] = useState(null);
  const [customMeta, setCustomMeta] = useState("");

  // Task info modal
  const [taskInfoOpen, setTaskInfoOpen] = useState(false);
  const [taskInfoContent, setTaskInfoContent] = useState("");

  // Deadline modal
  const [deadlineOpen, setDeadlineOpen] = useState(false);
  const [deadlineValue, setDeadlineValue] = useState("");
  const [activeDeadlineIndex, setActiveDeadlineIndex] = useState(null); // number | 'new'
  const [pendingNewTaskDeadline, setPendingNewTaskDeadline] = useState(null);

  // Derived flags
  const canEditToday =
    mode === "daily" &&
    currentView === "day" &&
    selectedDate === todayStr;

  // Initial load
  useEffect(() => {
    if (mode === "daily") {
      loadDaily(selectedDate);
    }
  }, [mode, selectedDate]);

  useEffect(() => {
    if (mode === "custom") {
      ensureCustomFile();
      const list = getCustomFilesList();
      setCustomFiles(list);
      const first = activeCustomFile || list[0]?.name;
      if (first) {
        selectCustomFile(first);
      }
    }
  }, [mode]);

  // Sync tasks when view changes (for global views)
  useEffect(() => {
    if (currentView === "day") {
      setTasks(getTasksForDate(selectedDate));
    }
  }, [currentView, selectedDate]);

  function loadDaily(date) {
    const isToday = date === todayStr;
    const savedNote = localStorage.getItem(`note-${date}`) || "";
    setNoteText(savedNote);
    setTasks(getTasksForDate(date));
    setStatusHint(
      isToday ? "You are editing today" : "Viewing past day — read only"
    );
  }

  function handleNoteChange(e) {
    const text = e.target.value;
    setNoteText(text);
    if (mode !== "daily" || selectedDate !== todayStr) return;
    localStorage.setItem(`note-${selectedDate}`, text);
  }

  // Custom files
  function ensureCustomFile() {
    const list = getCustomFilesList();
    if (list.length === 0) {
      createCustomFile("My Notes");
    }
  }

  function createCustomFile(name) {
    const sanitized =
      name.replace(/[^a-zA-Z0-9._-\s]/g, "").trim() || "Untitled";
    let list = getCustomFilesList();
    let finalName = sanitized;
    let i = 1;
    while (list.some((f) => f.name === finalName)) {
      finalName = `${sanitized} (${++i})`;
    }
    list.push({ name: finalName, updatedAt: new Date().toISOString() });
    saveCustomFilesList(list);
    localStorage.setItem(`custom-${finalName}`, "");
    setCustomFiles(list);
    selectCustomFile(finalName);
  }

  function selectCustomFile(name) {
    setActiveCustomFile(name);
    const content = localStorage.getItem(`custom-${name}`) || "";
    setNoteText(content);
    const list = getCustomFilesList();
    const file = list.find((f) => f.name === name);
    if (file) {
      setCustomMeta(
        `Updated: ${new Date(file.updatedAt).toLocaleString()}`
      );
    } else {
      setCustomMeta("");
    }
    setStatusHint("Custom file — always editable");
  }

  function deleteCustomFile(name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const list = getCustomFilesList();
    const filtered = list.filter((f) => f.name !== name);
    saveCustomFilesList(filtered);
    localStorage.removeItem(`custom-${name}`);
    setCustomFiles(filtered);
    if (activeCustomFile === name) {
      if (filtered.length > 0) {
        selectCustomFile(filtered[0].name);
      } else {
        setActiveCustomFile(null);
        setNoteText("");
        setCustomMeta("");
      }
    }
  }

  function handleCustomNoteChange(e) {
    const text = e.target.value;
    setNoteText(text);
    if (!activeCustomFile) return;
    localStorage.setItem(`custom-${activeCustomFile}`, text);
    const list = getCustomFilesList();
    const file = list.find((f) => f.name === activeCustomFile);
    if (file) {
      file.updatedAt = new Date().toISOString();
      saveCustomFilesList(list);
      setCustomFiles(list);
      setCustomMeta(`Updated: ${new Date().toLocaleString()}`);
    }
  }

  // Tasks
  function handleAddTask() {
    if (!canEditToday) return;
    const text = newTaskText.trim();
    if (!text) return;
    const current = getTasksForDate(selectedDate);
    current.push({
      text,
      completed: false,
      deadline: pendingNewTaskDeadline,
      locked: false,
      createdAt: new Date().toISOString(),
    });
    saveTasks(selectedDate, current);
    setTasks(current);
    setNewTaskText("");
    setPendingNewTaskDeadline(null);
  }

  function toggleTaskCompleted(index, date = selectedDate) {
    if (date !== todayStr || currentView !== "day" || mode !== "daily") return;
    const current = getTasksForDate(date);
    const task = current[index];
    if (!task) return;
    task.completed = !task.completed;
    if (task.completed && !task.completedAt) {
      task.completedAt = new Date().toISOString();
      const gained = task.deadline ? 20 : 10;
      const newPoints = points + gained;
      setPoints(newPoints);
      localStorage.setItem("points", String(newPoints));
    }
    saveTasks(date, current);
    setTasks(current);
  }

  // Global lists
  const unfinishedGlobal = useMemo(() => {
    const all = getAllTaskEntries().filter((e) => !e.task.completed);
    if (dayFilter === "all") return all;
    return all.filter((e) => e.date === dayFilter);
  }, [dayFilter, tasks, currentView]);

  const completedGlobal = useMemo(() => {
    const all = getAllTaskEntries().filter((e) => e.task.completed);
    if (dayFilter === "all") return all;
    return all.filter((e) => e.date === dayFilter);
  }, [dayFilter, tasks, currentView]);

  const dayFilterOptions = useMemo(() => {
    const dates = [
      ...new Set(
        Array.from({ length: localStorage.length }, (_, i) =>
          localStorage.key(i)
        )
          .filter((k) => k && k.startsWith("tasks-"))
          .map((k) => k.slice(6))
      ),
    ].sort((a, b) => (a < b ? 1 : -1));
    return dates;
  }, [tasks, currentView]);

  // Deadline handling
  function openDeadlineForNew() {
    if (selectedDate !== todayStr) {
      alert("Deadlines only for today's tasks");
      return;
    }
    setActiveDeadlineIndex("new");
    setDeadlineValue(pendingNewTaskDeadline || "");
    setDeadlineOpen(true);
  }

  function openDeadlineForTask(index) {
    if (selectedDate !== todayStr || currentView !== "day") return;
    setActiveDeadlineIndex(index);
    const current = getTasksForDate(selectedDate);
    const task = current[index];
    setDeadlineValue(task?.deadline || "");
    setDeadlineOpen(true);
  }

  function saveDeadlineValue() {
    const value = deadlineValue;
    const date = selectedDate;
    if (activeDeadlineIndex === "new") {
      setPendingNewTaskDeadline(value || null);
    } else if (date === todayStr) {
      const current = getTasksForDate(date);
      if (!current[activeDeadlineIndex]) return;
      current[activeDeadlineIndex].deadline = value || null;
      saveTasks(date, current);
      setTasks(current);
    }
    setDeadlineOpen(false);
    setActiveDeadlineIndex(null);
  }

  // Task info
  function showTaskInfo(index) {
    const current = getTasksForDate(selectedDate);
    const task = current[index];
    if (!task?.completed) return;
    let html = `<strong>Created:</strong> ${new Date(
      task.createdAt
    ).toLocaleString()}<br/>`;
    if (task.completedAt) {
      html += `<strong>Completed:</strong> ${new Date(
        task.completedAt
      ).toLocaleString()}<br/>`;
    }
    if (task.deadline) {
      const diff =
        new Date(task.completedAt || Date.now()) -
        new Date(task.deadline);
      const late = diff > 0;
      const hrs = Math.abs(Math.floor(diff / 3600000));
      const min = Math.abs(Math.round((diff % 3600000) / 60000));
      html += `<strong style="color:${
        late ? "#e74c3c" : "#27ae60"
      }">${late ? "Late" : "Early"} by: ${hrs}h ${min}m</strong>`;
    }
    setTaskInfoContent(html);
    setTaskInfoOpen(true);
  }

  // View toggles
  function toggleUnfinishedView() {
    setCurrentView((prev) => (prev === "unfinishedAll" ? "day" : "unfinishedAll"));
  }

  function toggleCompletedView() {
    setCurrentView((prev) => (prev === "completedAll" ? "day" : "completedAll"));
  }

  // Render helpers
  const visibleIncomplete =
    currentView === "day"
      ? tasks.filter((t) => !t.completed)
      : [];
  const visibleCompleted =
    currentView === "day"
      ? tasks.filter((t) => t.completed)
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-space-dark dark:via-gray-900 dark:to-space-dark py-8">
      <div className="max-w-6xl mx-auto px-4 md:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left: Notes */}
        <div
          className="flex-1 flex flex-col rounded-2xl card p-4 md:p-6 min-h-[60vh]"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-gray-50 font-heading">Notes</h1>

          {/* Mode switch */}
          <div className="flex gap-2 mb-3">
            <button
              className={`px-3 py-2 rounded-xl text-xs md:text-sm border transition-colors ${
                mode === "daily"
                  ? "bg-primary-500 text-white border-primary-400"
                  : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setMode("daily");
                loadDaily(selectedDate);
              }}
            >
              Daily Notes
            </button>
            <button
              className={`px-3 py-2 rounded-xl text-xs md:text-sm border transition-colors ${
                mode === "custom"
                  ? "bg-primary-500 text-white border-primary-400"
                  : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setMode("custom")}
            >
              My Files
            </button>
          </div>

          {/* Date picker (daily mode) */}
          {mode === "daily" && (
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="date"
                className="input w-full sm:w-auto"
                value={selectedDate}
                onChange={(e) => {
                  const d = e.target.value;
                  setSelectedDate(d);
                  loadDaily(d);
                }}
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {formatDateLabel(selectedDate)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {statusHint}
                </div>
              </div>
            </div>
          )}

          {/* Custom files bar */}
          {mode === "custom" && (
            <div className="mb-3 space-y-2">
              <div className="flex gap-2">
                <input
                  id="new-file-name-input"
                  type="text"
                  className="input flex-1"
                  placeholder="New file name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        createCustomFile(val);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <button
                  className="btn-primary text-xs px-4"
                  onClick={() => {
                    const input = document.getElementById("new-file-name-input");
                    if (input && input.value.trim()) {
                      createCustomFile(input.value.trim());
                      input.value = "";
                    }
                  }}
                >
                  Create
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {customFiles.map((f) => (
                  <div
                    key={f.name}
                    className={`group relative px-3 py-1 rounded-lg text-xs border transition-colors flex items-center gap-2 ${
                      f.name === activeCustomFile
                        ? "bg-primary-500 text-white border-primary-400"
                        : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <button
                      onClick={() => selectCustomFile(f.name)}
                      className="flex-1 text-left"
                    >
                      {f.name}
                    </button>
                    <button
                      onClick={() => deleteCustomFile(f.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete file"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {customMeta && (
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  {customMeta}
                </p>
              )}
            </div>
          )}

          {/* Note textarea */}
          <textarea
            className="flex-1 mt-2 input resize-none min-h-[260px]"
            placeholder={
              mode === "daily"
                ? "Write your notes here...\n\n• Use lines for ideas and tasks\n• Your notes for each day stay separate"
                : "Write in this custom file..."
            }
            value={noteText}
            onChange={mode === "daily" ? handleNoteChange : handleCustomNoteChange}
            disabled={mode === "daily" && selectedDate !== todayStr}
          />
        </div>

        {/* Right: Tasks & points */}
        <div className="w-full lg:w-[360px] xl:w-[380px] rounded-2xl card flex flex-col p-4 md:p-5 max-h-[80vh]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 font-heading">Tasks & Plans</h2>
            <div className="text-sm font-bold text-primary-500 dark:text-primary-400">
              Points: {points}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-3">
            <button
              className={`flex-1 text-xs sm:text-sm rounded-lg px-2 py-2 border transition-colors ${
                currentView === "unfinishedAll"
                  ? "bg-primary-500 text-white border-primary-400"
                  : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={toggleUnfinishedView}
            >
              {currentView === "unfinishedAll" ? "Back to Today" : "Show Unfinished"}
            </button>
            <button
              className={`flex-1 text-xs sm:text-sm rounded-lg px-2 py-2 border transition-colors ${
                currentView === "completedAll"
                  ? "bg-primary-500 text-white border-primary-400"
                  : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={toggleCompletedView}
            >
              {currentView === "completedAll" ? "Back to Today" : "Show Completed"}
            </button>
          </div>

          {/* Day filter for global views */}
          {currentView !== "day" && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-600 dark:text-gray-400">
              <span>Day:</span>
              <select
                className="input rounded-md px-2 py-1 text-xs"
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
              >
                <option value="all">All days</option>
                {dayFilterOptions.map((d) => (
                  <option key={d} value={d}>
                    {new Date(d).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* New task row */}
          {currentView === "day" && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="input flex-1 text-xs sm:text-sm"
                  placeholder="Add a new task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddTask()
                  }
                  disabled={!canEditToday}
                />
                <button
                  className="text-lg text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  onClick={openDeadlineForNew}
                  title={
                    pendingNewTaskDeadline
                      ? formatDeadline(pendingNewTaskDeadline)
                      : "Set deadline"
                  }
                >
                  ⏰
                </button>
              </div>
              <button
                className="w-full btn-primary text-xs sm:text-sm"
                onClick={handleAddTask}
                disabled={!canEditToday}
              >
                + Add Task
              </button>
            </div>
          )}

          {/* Task lists */}
          <div className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4">
            {currentView === "day" && (
              <>
                {/* Incomplete */}
                <div>
                  {visibleIncomplete.length === 0 && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      No pending tasks today.
                    </div>
                  )}
                  {visibleIncomplete.map((task, i) => (
                    <div
                      key={`${task.text}-${i}`}
                      className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 py-2 text-xs sm:text-sm"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary-500"
                        checked={task.completed}
                        onChange={() => toggleTaskCompleted(i)}
                        disabled={!canEditToday}
                      />
                      <div className="flex-1">
                        {task.deadline && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            {formatDeadline(task.deadline)}
                          </div>
                        )}
                        <div className="text-gray-900 dark:text-gray-100">{task.text}</div>
                      </div>
                      <button
                        className="text-[11px] text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                        onClick={() => openDeadlineForTask(i)}
                      >
                        Timer
                      </button>
                    </div>
                  ))}
                </div>

                {/* Completed */}
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="text-xs font-semibold mb-1 text-primary-500 dark:text-primary-400">
                    Completed Tasks
                  </div>
                  {visibleCompleted.length === 0 && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      No completed tasks yet.
                    </div>
                  )}
                  {visibleCompleted.map((task, i) => (
                    <div
                      key={`done-${task.text}-${i}`}
                      className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 py-2 text-xs sm:text-sm opacity-70"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary-500"
                        checked={task.completed}
                        onChange={() => toggleTaskCompleted(i)}
                        disabled={!canEditToday}
                      />
                      <div className="flex-1">
                        {task.deadline && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            {formatDeadline(task.deadline)}
                          </div>
                        )}
                        <div className="line-through text-gray-700 dark:text-gray-300">{task.text}</div>
                      </div>
                      <button
                        className="text-[11px] text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                        onClick={() => showTaskInfo(i)}
                      >
                        Info
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentView === "unfinishedAll" && (
              <div className="space-y-2">
                {                  unfinishedGlobal.length === 0 ? (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      No unfinished tasks.
                    </div>
                  ) : (
                    unfinishedGlobal.map(({ task, date }, idx) => (
                      <div
                        key={`${date}-${task.text}-${idx}`}
                        className="flex flex-col border-b border-gray-200 dark:border-gray-700 py-2 text-xs"
                      >
                        <div className="text-[11px] text-gray-600 dark:text-gray-400">
                          {formatDateOnly(date)}
                        </div>
                        {task.deadline && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            {formatDeadline(task.deadline)}
                          </div>
                        )}
                      <div className="text-gray-900 dark:text-gray-100">{task.text}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentView === "completedAll" && (
              <div className="space-y-2">
                {completedGlobal.length === 0 ? (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    No completed tasks.
                  </div>
                ) : (
                  completedGlobal.map(({ task, date }, idx) => (
                    <div
                      key={`${date}-${task.text}-${idx}`}
                      className="flex flex-col border-b border-gray-200 dark:border-gray-700 py-2 text-xs opacity-75"
                    >
                      <div className="text-[11px] text-gray-600 dark:text-gray-400">
                        Added: {formatDateOnly(task.createdAt || date)}
                      </div>
                      <div className="text-[11px] text-gray-600 dark:text-gray-400">
                        Done: {formatDateOnly(task.completedAt || date)}
                      </div>
                      <div className="line-through text-gray-700 dark:text-gray-300">{task.text}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

      {/* Deadline Modal */}
      {deadlineOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="card p-4 w-80 max-w-[90vw] space-y-3 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 font-heading">
              Set Deadline
            </h3>
            <input
              type="datetime-local"
              className="input w-full text-sm"
              value={deadlineValue}
              onChange={(e) => setDeadlineValue(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-sm">
              <button
                className="btn-secondary px-3 py-2"
                onClick={() => {
                  setDeadlineOpen(false);
                  setActiveDeadlineIndex(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-3 py-2"
                onClick={saveDeadlineValue}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Info Modal */}
      {taskInfoOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="card p-4 w-80 max-w-[90vw] space-y-3 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 font-heading">
              Task Information
            </h3>
            <div
              className="text-sm space-y-1 text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: taskInfoContent }}
            />
            <div className="flex justify-end">
              <button
                className="btn-secondary px-4 py-2 text-sm"
                onClick={() => setTaskInfoOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
