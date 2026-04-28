import React from 'react';
import { FileQuestion, Loader2 } from 'lucide-react';
import NoteCard from './NoteCard';

const NotesGrid = ({ notes, isLoading, onDelete }) => {
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="empty-state">
        <FileQuestion size={48} />
        <h3>No files found</h3>
        <p>Upload your first file above to get started.</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NotesGrid;
