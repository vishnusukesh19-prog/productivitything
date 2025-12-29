import React, { useState, useEffect } from "react";
import { useUserData } from "../hooks/useUserData";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

// Event color categories with RGB values for inline styles
const EVENT_COLORS = [
  { name: 'indigo', bg: 'rgba(99, 102, 241, 0.2)', border: 'rgb(99, 102, 241)', darkBg: 'rgba(99, 102, 241, 0.3)', darkBorder: 'rgb(129, 140, 248)' },
  { name: 'emerald', bg: 'rgba(16, 185, 129, 0.2)', border: 'rgb(16, 185, 129)', darkBg: 'rgba(16, 185, 129, 0.3)', darkBorder: 'rgb(52, 211, 153)' },
  { name: 'purple', bg: 'rgba(168, 85, 247, 0.2)', border: 'rgb(168, 85, 247)', darkBg: 'rgba(168, 85, 247, 0.3)', darkBorder: 'rgb(192, 132, 252)' },
  { name: 'amber', bg: 'rgba(245, 158, 11, 0.2)', border: 'rgb(245, 158, 11)', darkBg: 'rgba(245, 158, 11, 0.3)', darkBorder: 'rgb(251, 191, 36)' },
  { name: 'rose', bg: 'rgba(244, 63, 94, 0.2)', border: 'rgb(244, 63, 94)', darkBg: 'rgba(244, 63, 94, 0.3)', darkBorder: 'rgb(251, 113, 133)' },
  { name: 'cyan', bg: 'rgba(6, 182, 212, 0.2)', border: 'rgb(6, 182, 212)', darkBg: 'rgba(6, 182, 212, 0.3)', darkBorder: 'rgb(34, 211, 238)' },
];

// Get color for event based on title hash
function getEventColor(eventTitle) {
  const hash = eventTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return EVENT_COLORS[hash % EVENT_COLORS.length];
}

export default function Calendar() {
  const { data: events, loading, addItem, updateItem, deleteItem } = useUserData("events");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", category: "" });
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

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

  const isPastDate = (date) => {
    const today = new Date();
    const checkDate = new Date(year, month, date);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const isFutureDate = (date) => {
    const today = new Date();
    const checkDate = new Date(year, month, date);
    return checkDate > new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const handleEditEvent = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setNewEvent({ 
      title: event.title, 
      date: event.date, 
      time: event.time || "",
      category: event.category || ""
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this event?")) {
      await deleteItem(eventId);
    }
  };

  const saveEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    const eventDate = newEvent.date || `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    const eventData = {
      title: newEvent.title.trim(), 
      date: eventDate,
      time: newEvent.time || new Date().toLocaleTimeString(),
      done: editingEvent?.done || false,
      category: newEvent.category || EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)].name
    };
    
    if (editingEvent) {
      await updateItem(editingEvent.id, eventData);
      setEditingEvent(null);
    } else {
      await addItem(eventData);
    }
    setNewEvent({ title: "", date: "", time: "", category: "" });
    setShowEventForm(false);
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({ 
      title: "", 
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
      time: "",
      category: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)].name
    });
    setShowEventForm(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-space-dark dark:via-gray-900 dark:to-space-dark flex items-center justify-center">
      <div className="text-center text-gray-600 dark:text-gray-400">Loading calendar...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-space-dark dark:via-gray-900 dark:to-space-dark py-8">
      <div className="max-w-7xl mx-auto px-4 md:p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 font-heading">
              Calendar
            </h1>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              See your week at a glance and add sessions quickly.
            </p>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateYear(-1)}
                className="btn-secondary px-3 py-1 text-sm"
              >
                « Year
              </button>
              <button 
                onClick={() => navigateMonth(-1)}
                className="btn-secondary px-3 py-1 text-sm"
              >
                ‹ Month
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 font-heading">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateMonth(1)}
                className="btn-secondary px-3 py-1 text-sm"
              >
                Month ›
              </button>
              <button 
                onClick={() => navigateYear(1)}
                className="btn-secondary px-3 py-1 text-sm"
              >
                Year »
              </button>
            </div>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="btn-primary text-sm px-4 py-2"
          >
            Today
          </button>
        </div>

        {/* Event Form */}
        {showEventForm && (
          <div className="card p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-50 font-heading">
              {editingEvent ? 'Edit Event' : `Add Event for ${selectedDate && `${monthNames[month]} ${selectedDate}, ${year}`}`}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                className="input w-full"
                placeholder="Event title..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="date"
                className="input w-full"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <input
                type="time"
                className="input w-full"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={saveEvent} className="btn-primary flex-1">
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
                <button 
                  onClick={() => {
                    setShowEventForm(false);
                    setSelectedDate(null);
                    setEditingEvent(null);
                    setNewEvent({ title: "", date: "", time: "", category: "" });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="card p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div 
                key={day} 
                className="p-2 text-center font-bold text-sm text-gray-700 dark:text-gray-300"
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
              const isPast = isPastDate(date);
              const isCurrent = isToday(date);
              const isFuture = isFutureDate(date);
              
              return (
                <div
                  key={date}
                  className={`card p-2 min-h-[100px] cursor-pointer transition-all ${
                    isCurrent 
                      ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : isPast 
                      ? 'bg-gray-100 dark:bg-gray-800/50 opacity-60' 
                      : 'bg-white dark:bg-gray-900'
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className={`text-sm font-bold mb-1 ${
                    isCurrent 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : isPast 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {date}
                  </div>
                  <div className="space-y-1">
                    {dateEvents.map((event) => {
                      const color = getEventColor(event.title);
                      return (
                        <div 
                          key={event.id}
                          className="text-xs p-1.5 rounded-md border-2 text-gray-800 dark:text-gray-100 hover:opacity-90 transition-all group relative flex items-center justify-between shadow-sm font-semibold"
                          style={{
                            backgroundColor: isDarkMode ? color.darkBg : color.bg,
                            borderColor: isDarkMode ? color.darkBorder : color.border,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex-1 min-w-0">
                            {event.time && (
                              <span className="opacity-80 text-[10px] mr-1 font-medium">
                                {event.time.split(':').slice(0, 2).join(':')}
                              </span>
                            )}
                            <span>{event.title}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleEditEvent(event, e)}
                              className="p-1 rounded hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                              title="Edit event"
                            >
                              <PencilIcon className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteEvent(event.id, e)}
                              className="p-1 rounded hover:bg-red-500/30 dark:hover:bg-red-900/50 transition-colors"
                              title="Delete event"
                            >
                              <TrashIcon className="w-3 h-3 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
