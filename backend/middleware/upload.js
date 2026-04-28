const multer = require('multer');

// Configure multer to store files in memory as a Buffer.
// This is ideal for uploading straight to S3 without saving locally first.
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  }
});

module.exports = upload;
