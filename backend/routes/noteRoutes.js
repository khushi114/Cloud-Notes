const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const noteController = require('../controllers/noteController');

// GET /api/notes - Get all notes
router.get('/', noteController.getNotes);

// POST /api/notes - Upload a note (expecting 'file' and 'title')
router.post('/', upload.single('file'), noteController.uploadNote);

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/:id', noteController.deleteNote);

// PATCH /api/notes/:id/download - Increment download count
router.patch('/:id/download', noteController.incrementDownload);

// GET /api/notes/:id/view - Generate presigned URL and redirect
router.get('/:id/view', noteController.viewNote);

module.exports = router;
