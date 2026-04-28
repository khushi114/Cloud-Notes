import React, { useState } from 'react';
import { File, Download, Trash2, Loader2, Copy, Eye, Check, X } from 'lucide-react';
import { incrementDownload } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NoteCard = ({ note, onDelete }) => {
  const shareLink = `${API_URL}/notes/${note.id}/view`;
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloads, setDownloads] = useState(note.downloads || 0);
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      setIsDeleting(true);
      await onDelete(note.id);
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      await incrementDownload(note.id);
      setDownloads(prev => prev + 1);
    } catch (e) {
      console.error('Failed to increment download counter', e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <div className="note-card glass-card" style={{ padding: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
        <div className="note-header">
          <div>
            <h3 className="note-title">{note.title}</h3>
            {note.subject && <span className="subject-tag">{note.subject}</span>}
          </div>
          <div className="note-icon">
            <File size={24} />
          </div>
        </div>
        
        <div className="note-meta">
          <p style={{ marginBottom: '6px' }}><strong>File:</strong> <span style={{wordBreak: 'break-all'}}>{note.fileName}</span></p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span><strong>Date:</strong> {formatDate(note.uploadDate)}</span>
            <span className="downloads-badge">{downloads} Downloads</span>
          </div>
        </div>

        <div className="note-actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <button 
            onClick={() => setIsPreviewOpen(true)} 
            className="action-btn preview-btn"
          >
            <Eye size={18} /> Preview
          </button>
          
          <a 
            href={shareLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={handleDownload}
            className="action-btn download-btn"
          >
            <Download size={18} /> Get File
          </a>

          <button 
            onClick={handleCopyLink} 
            className="action-btn copy-btn"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />} 
            {copied ? 'Copied!' : 'Link'}
          </button>

          <button 
            onClick={handleDelete} 
            className="action-btn delete-btn"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />} 
            Delete
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{note.title}</h3>
              <button className="close-btn" onClick={() => setIsPreviewOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <iframe 
                src={shareLink} 
                title="File Preview" 
                className="preview-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
