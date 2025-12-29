import React, { useState } from "react";
import { useUserData } from "../hooks/useUserData";
import PokerBackground from "../components/PokerBackground";

export default function Calendar() {
  const { data: events, loading, addItem, updateItem, deleteItem } = useUserData("events");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "" });
  const [showEventForm, setShowEventForm] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const navigateYear = (direction) => {
    setCurrentDate(new Date(year + direction, month, 1));
  };

  const getEventsForDate = (date) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events?.filter(e => e.date === dateStr) || [];
  };

  const isToday = (date) => {
    const today = new Date();
    return date === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const addEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    const eventDate = newEvent.date || `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    await addItem({ 
      title: newEvent.title.trim(), 
      date: eventDate,
      time: newEvent.time || new Date().toLocaleTimeString(),
      done: false 
    });
    setNewEvent({ title: "", date: "", time: "" });
    setShowEventForm(false);
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({ 
      title: "", 
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
      time: "" 
    });
    setShowEventForm(true);
  };

  if (loading) return <div className="p-6 text-center" style={{ color: 'var(--poker-text)' }}>Loading calendar...</div>;

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        <div
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--poker-text)' }}>
              Calendar
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--poker-muted)' }}>
              See your week at a glance and add sessions quickly.
            </p>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="poker-card p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateYear(-1)}
                className="poker-button secondary px-3 py-1 text-sm"
              >
                « Year
              </button>
              <button 
                onClick={() => navigateMonth(-1)}
                className="poker-button secondary px-3 py-1 text-sm"
              >
                ‹ Month
              </button>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--poker-gold)' }}>
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateMonth(1)}
                className="poker-button secondary px-3 py-1 text-sm"
              >
                Month ›
              </button>
              <button 
                onClick={() => navigateYear(1)}
                className="poker-button secondary px-3 py-1 text-sm"
              >
                Year »
              </button>
            </div>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="poker-button text-sm px-4 py-2"
          >
            Today
          </button>
        </div>

        {/* Event Form */}
        {showEventForm && (
          <div className="poker-card p-6 mb-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--poker-gold)' }}>
              Add Event for {selectedDate && `${monthNames[month]} ${selectedDate}, ${year}`}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                className="poker-input w-full"
                placeholder="Event title..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="date"
                className="poker-input w-full"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <input
                type="time"
                className="poker-input w-full"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={addEvent} className="poker-button flex-1">
                  Add Event
                </button>
                <button 
                  onClick={() => {
                    setShowEventForm(false);
                    setSelectedDate(null);
                    setNewEvent({ title: "", date: "", time: "" });
                  }}
                  className="poker-button secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="poker-card p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div 
                key={day} 
                className="p-2 text-center font-bold text-sm"
                style={{ color: 'var(--poker-accent)' }}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
              const dateEvents = getEventsForDate(date);
              return (
                <div
                  key={date}
                  className={`poker-card p-2 min-h-[80px] cursor-pointer ${isToday(date) ? 'ring-2 ring-yellow-400' : ''}`}
                  style={{ 
                    borderLeft: dateEvents.length > 0 ? '4px solid var(--poker-accent)' : undefined 
                  }}
                  onClick={() => handleDateClick(date)}
                >
                  <div className={`text-sm font-bold mb-1 ${isToday(date) ? 'text-yellow-400' : ''}`}>
                    {date}
                  </div>
                  <div className="space-y-1">
                    {dateEvents.slice(0, 2).map((event) => (
                      <div 
                        key={event.id}
                        className="text-xs p-1 rounded"
                        style={{ 
                          background: 'rgba(220, 20, 60, 0.2)',
                          color: 'var(--poker-text)'
                        }}
                      >
                        {event.time && <span className="opacity-70">{event.time.split(':').slice(0, 2).join(':')}</span>} {event.title}
                      </div>
                    ))}
                    {dateEvents.length > 2 && (
                      <div className="text-xs opacity-70">
                        +{dateEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
