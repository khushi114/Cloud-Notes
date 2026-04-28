const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
const s3Client = require('../config/s3');
const { db } = require('../config/firebase');

const NOTES_COLLECTION = 'notes';

// @desc    Get all notes
// @route   GET /api/notes
exports.getNotes = async (req, res) => {
  try {
    const notesSnapshot = await db.collection(NOTES_COLLECTION).orderBy('uploadDate', 'desc').get();
    
    const notes = [];
    notesSnapshot.forEach(doc => {
      notes.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// @desc    Upload a new note
// @route   POST /api/notes
exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const { title, subject } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Prepare S3 upload parameters
    const fileExtension = req.file.originalname.split('.').pop();
    const s3Key = `notes/${crypto.randomUUID()}.${fileExtension}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    // Upload to S3
    await s3Client.send(command);

    // Get the file URL
    // Depending on S3 setup, it could be a public URL or requires signed URL. 
    // We'll generate a public URL format assuming the bucket/object is publicly readable,
    // or the frontend can use the object key to request a signed URL if needed.
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Save metadata to Firestore
    const newNote = {
      title,
      subject: subject || 'Uncategorized',
      fileName: req.file.originalname,
      s3Key,
      fileUrl,
      downloads: 0,
      uploadDate: new Date().toISOString(),
    };

    const docRef = await db.collection(NOTES_COLLECTION).add(newNote);

    res.status(201).json({ id: docRef.id, ...newNote });
  } catch (error) {
    console.error('Error uploading note:', error);
    res.status(500).json({ error: 'Failed to upload note' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteRef = db.collection(NOTES_COLLECTION).doc(noteId);
    const doc = await noteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const noteData = doc.data();

    // Delete from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: noteData.s3Key,
    };

    try {
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (s3Error) {
      console.error('S3 Deletion Error:', s3Error);
      // We can continue to delete from Firestore even if S3 fails, or abort. 
      // Proceeding with Firestore deletion for consistency.
    }

    // Delete from Firestore
    await noteRef.delete();

    res.status(200).json({ message: 'Note deleted successfully', id: noteId });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

// @desc    Increment download count
// @route   PATCH /api/notes/:id/download
exports.incrementDownload = async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteRef = db.collection(NOTES_COLLECTION).doc(noteId);
    
    const doc = await noteRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Atomically increment the downloads field by 1
    const admin = require('firebase-admin');
    await noteRef.update({
      downloads: admin.firestore.FieldValue.increment(1)
    });

    res.status(200).json({ message: 'Download count incremented' });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ error: 'Failed to track download' });
  }
};

// @desc    Generate a presigned URL and redirect to it for viewing/downloading
// @route   GET /api/notes/:id/view
exports.viewNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteRef = db.collection(NOTES_COLLECTION).doc(noteId);
    
    const doc = await noteRef.get();
    if (!doc.exists) {
      return res.status(404).send('Note not found');
    }

    const noteData = doc.data();

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: noteData.s3Key,
    });

    // Generate a presigned URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Redirect the browser to the presigned URL
    res.redirect(signedUrl);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).send('Failed to generate view link');
  }
};

