import React, { useState } from "react";

export default function NoteCard({ note, updateNote, deleteNote }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const saveChanges = () => {
    updateNote(note.id, title, content);
    setEditing(false);
  };

  return (
    <div className="card p-4 bg-white rounded shadow mb-4">
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 rounded"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-1 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="font-bold">{note.title}</h2>
          <p className="text-gray-700">{note.content}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-500 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
