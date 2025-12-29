import React, { useState } from "react";
import { useUserData } from "../hooks/useUserData";
import PokerBackground from "../components/PokerBackground";

export default function Notes() {
  const { data: notes, loading, addItem, updateItem, deleteItem } = useUserData("notes");
  const [newNote, setNewNote] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const addNote = async () => {
    if (newNote.trim() === "") return;
    try {
      await addItem({ 
        content: newNote.trim(), 
        tags: [], 
        createdAt: new Date().toISOString() 
      });
      setNewNote("");
    } catch (error) {
      console.error('Add note failed:', error);
      alert('Failed to add note');
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Delete note failed:', error);
      alert('Failed to delete note');
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = async (id) => {
    try {
      await updateItem(id, { content: editContent.trim() });
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error('Update note failed:', error);
      alert('Failed to update note');
    }
  };

  const filteredNotes = notes?.filter(note => 
    note.content?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading) return <div className="p-6 text-center text-slate-400">Loading notes...</div>;

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--poker-text)' }}>
              Notes
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--poker-muted)' }}>
              Quick scratchpad for study ideas and reminders.
            </p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          className="poker-input w-full mb-6"
          placeholder="🔍 Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Add Note */}
        <div className="flex mb-6 gap-2">
          <textarea
            className="poker-input flex-1 rounded-l-lg resize-none"
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <button onClick={addNote} className="poker-button rounded-r-lg px-6">
            Add Note
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="poker-card blue p-4"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    className="poker-input w-full resize-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(note.id)}
                      className="poker-button text-sm px-4 py-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="poker-button secondary text-sm px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-3 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {note.tags?.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          background: 'var(--poker-accent)',
                          color: 'white',
                          opacity: 0.8
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs opacity-60">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'No date'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-sm opacity-70 hover:opacity-100 transition"
                        style={{ color: 'var(--poker-gold)' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-sm opacity-70 hover:opacity-100 transition text-red-400"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <p 
            className="text-center mt-8 text-lg"
            style={{ color: 'var(--poker-text)', opacity: 0.7 }}
          >
            No notes yet—add one above.
          </p>
        )}
      </div>
    </div>
  );
}