import React, { useState, useEffect } from 'react';
import { Cloud, FileText, Search } from 'lucide-react';
import UploadForm from './components/UploadForm';
import NotesGrid from './components/NotesGrid';
import { getNotes, uploadNote, deleteNote } from './services/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (formData) => {
    try {
      const newNote = await uploadNote(formData);
      // Add the new note to the beginning of the list
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      return { success: true };
    } catch (err) {
      console.error('Upload failed:', err);
      return { success: false, error: err.response?.data?.error || 'Upload failed' };
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete note.');
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (note.subject && note.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <header>
        <h1>
          <Cloud size={40} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px' }} />
          Cloud Notes
        </h1>
        <p className="subtitle">Securely store and share your files in the cloud</p>
      </header>

      <main>
        <div className="upload-form-container glass-card">
          <UploadForm onUpload={handleUpload} />
        </div>

        {error && (
          <div style={{ color: 'var(--danger-color)', textAlign: 'center', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="notes-container glass-card">
          <div className="notes-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2><FileText size={24} style={{ display: 'inline', verticalAlign: 'middle' }} /> Your Files</h2>
              <span style={{ color: 'var(--text-secondary)' }}>({filteredNotes.length})</span>
            </div>
            
            <div className="search-bar" style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by title or subject..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(15, 23, 42, 0.6)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          
          <NotesGrid 
            notes={filteredNotes} 
            isLoading={isLoading} 
            onDelete={handleDelete} 
          />
        </div>
      </main>
    </>
  );
}

export default App;
