import React from 'react';

export default function TaskCard({ task, onToggle, onDelete, onStartTimer }) {
  const cardColor = task.priority === 'high' ? 'red' : 
                    task.priority === 'medium' ? 'blue' : 
                    task.category === 'study' ? 'green' : 'purple';
  
  const points = task.points || 10;
  const bonus = task.bonus || 0;
  const stars = Math.min(5, Math.floor((points + bonus) / 5));

  return (
    <div className={`poker-card ${cardColor} p-4 mb-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
            className="w-5 h-5 mt-1 cursor-pointer"
            style={{ accentColor: 'var(--poker-accent)' }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold ${task.done ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </h3>
              {task.dueDate && (
                <span className="text-xs px-2 py-1 rounded" style={{ 
                  background: task.dueDate === 'Today' ? 'rgba(220, 20, 60, 0.2)' : 'rgba(0,0,0,0.2)',
                  color: task.dueDate === 'Today' ? 'var(--poker-accent)' : 'var(--poker-text)'
                }}>
                  Due {task.dueDate}
                </span>
              )}
            </div>
            {task.description && (
              <p className="text-sm opacity-70 mb-2">{task.description}</p>
            )}
            <div className="flex items-center gap-4">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < stars ? '' : 'empty'}`}>
                    ★
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold" style={{ color: 'var(--poker-muted)' }}>
                  {points + bonus} pts
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!task.done && onStartTimer && (
            <button
              onClick={() => onStartTimer(task)}
              className="poker-button secondary text-xs px-3 py-1"
            >
              ⏱️
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-400 hover:text-red-300 text-lg"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
