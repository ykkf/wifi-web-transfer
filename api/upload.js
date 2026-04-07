const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const memoryStore = require('./memoryStore');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('files'), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const { expireMinutes } = req.body;
    const minutes = parseInt(expireMinutes) || 60;
    const expiresAt = Date.now() + minutes * 60 * 1000;

    const sessionId = uuidv4();
    memoryStore.sessions.set(sessionId, {
      expiresAt,
      files: files.map(f => ({
        originalname: f.originalname,
        buffer: f.buffer,
        mimetype: f.mimetype,
        size: f.size
      }))
    });

    // Generate URL to share
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    const shareUrl = `\${protocol}://\${host}/files/\${sessionId}`;

    res.json({ success: true, sessionId, shareUrl, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

module.exports = router;
