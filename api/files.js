const express = require('express');
const memoryStore = require('./memoryStore');

const router = express.Router();

// Get all active sessions
router.get('/', (req, res) => {
  const activeSessions = [];
  const now = Date.now();
  for (const [id, session] of memoryStore.sessions.entries()) {
    if (now > session.expiresAt) {
      memoryStore.sessions.delete(id);
    } else {
      activeSessions.push({
        sessionId: id,
        fileCount: session.files.length,
        expiresAt: session.expiresAt
      });
    }
  }
  // Sort by newest expiry first
  activeSessions.sort((a, b) => b.expiresAt - a.expiresAt);
  res.json({ sessions: activeSessions });
});

// Get metadata for a given session ID
router.get('/:id', (req, res) => {
  const sessionId = req.params.id;
  const session = memoryStore.sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found or expired.' });
  }

  if (Date.now() > session.expiresAt) {
    memoryStore.sessions.delete(sessionId);
    return res.status(403).json({ error: 'This transfer link has expired.' });
  }

  const fileMetadata = session.files.map((f, index) => ({
    index,
    name: f.originalname,
    size: f.size
  }));

  res.json({
    sessionId,
    expiresAt: session.expiresAt,
    files: fileMetadata
  });
});

module.exports = router;
