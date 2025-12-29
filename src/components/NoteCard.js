import React, { useState } from "react";
import NoteCard from "../components/NoteCard.jsx";  // Add this

export default function Notes() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Math Notes", content: "Chapter 1 summary..." },
    { id: 2, title: "History Notes", content: "Revolution timeline..." },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const addNote = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setNotes([
      ...notes,
      { id: Date.now(), title: newTitle.trim(), content: newContent.trim() },
    ]);
    setNewTitle("");
    setNewContent("");
  };

  const updateNote = (id, title, content) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, title: title.trim(), content: content.trim() } : n
      )
    );
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      <div className="flex flex-col mb-4 space-y-2 max-w-md">
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Note title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          className="p-2 border rounded h-20"
          placeholder="Note content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          onClick={addNote}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Note
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
        ))}
      </div>
    </div>
  );
}