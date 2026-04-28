import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

const UploadForm = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setStatus({ type: 'error', message: 'Please provide both a title and a file.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('title', title);
    if (subject) formData.append('subject', subject);
    formData.append('file', file);

    const result = await onUpload(formData);

    if (result.success) {
      setStatus({ type: 'success', message: 'File uploaded successfully!' });
      setTitle('');
      setSubject('');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to upload file.' });
    }
    
    setIsUploading(false);
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Note Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Q1 Financial Report"
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject / Category (Optional)</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Mathematics, Finance"
          disabled={isUploading}
        />
      </div>

      <div className="form-group">
        <label>Select File</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="file-input-btn">
            <UploadCloud size={20} />
            <span>{file ? file.name : 'Choose a file to upload or drag it here'}</span>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className="submit-btn" 
        disabled={isUploading || !title || !file}
      >
        {isUploading ? (
          <>Uploading...</>
        ) : (
          <>
            <UploadCloud size={20} /> Upload to Cloud
          </>
        )}
      </button>

      {status && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px', 
          borderRadius: '8px',
          background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
          color: status.type === 'error' ? 'var(--danger-color)' : '#22c55e',
          marginTop: '1rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {status.message}
        </div>
      )}
    </form>
  );
};

export default UploadForm;
