const express = require('express');
const { v4: uuidv4 } = require('uuid');
const memoryStore = require('./memoryStore');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    var body = req.body;

    if (!body || !body.files || body.files.length === 0) {
      return res.status(400).json({ error: 'No files received.' });
    }

    var minutes = parseInt(body.expireMinutes) || 60;
    var expiresAt = Date.now() + minutes * 60 * 1000;
    var sessionId = uuidv4();

    var storedFiles = body.files.map(function(f) {
      return {
        originalname: f.name,
        buffer: Buffer.from(f.data, 'base64'),
        mimetype: f.type,
        size: f.size
      };
    });

    memoryStore.sessions.set(sessionId, {
      expiresAt: expiresAt,
      files: storedFiles
    });

    // Generate URL to share
    var protocol = req.headers['x-forwarded-proto'] || req.protocol;
    var host = req.headers.host;
    var shareUrl = protocol + '://' + host + '/files/' + sessionId;

    res.json({ success: true, sessionId: sessionId, shareUrl: shareUrl, expiresAt: expiresAt });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

module.exports = router;
