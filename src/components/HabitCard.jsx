import React from "react";

export default function HabitCard({ habit, toggleDone, deleteHabit }) {
  return (
    <div className="card flex justify-between items-center p-3 rounded shadow hover:shadow-md transition bg-white">
      <div className={habit.done ? "line-through text-gray-500" : "font-medium"}>
        {habit.title}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={habit.done}
          onChange={() => toggleDone(habit.id)}
          className="w-5 h-5"
        />
        <button
          onClick={() => deleteHabit(habit.id)}
          className="text-red-500 font-bold px-2 py-1 hover:bg-red-100 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}