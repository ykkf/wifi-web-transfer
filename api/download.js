const express = require('express');
const archiver = require('archiver');
const memoryStore = require('./memoryStore');

const router = express.Router();

function checkSession(req, res) {
  const sessionId = req.params.id;
  const session = memoryStore.sessions.get(sessionId);

  if (!session) {
    res.status(404).send('Session not found or expired.');
    return null;
  }
  if (Date.now() > session.expiresAt) {
    memoryStore.sessions.delete(sessionId);
    res.status(403).send('This transfer link has expired.');
    return null;
  }
  return session;
}

// Download single file
router.get('/:id/:fileIndex', (req, res) => {
  const session = checkSession(req, res);
  if (!session) return;

  const fileIndex = parseInt(req.params.fileIndex, 10);
  if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= session.files.length) {
    return res.status(404).send('File not found in session.');
  }

  const file = session.files[fileIndex];

  res.setHeader('Content-disposition', 'attachment; filename="' + encodeURIComponent(file.originalname) + '"');
  res.setHeader('Content-type', file.mimetype);
  res.send(file.buffer);
});

// Download all files as ZIP
router.get('/:id/zip/all', (req, res) => {
  const session = checkSession(req, res);
  if (!session) return;

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');

  const archive = archiver('zip', { zlib: { level: 1 } });

  archive.on('error', err => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  session.files.forEach(file => {
    archive.append(file.buffer, { name: file.originalname });
  });

  archive.finalize();
});

module.exports = router;
