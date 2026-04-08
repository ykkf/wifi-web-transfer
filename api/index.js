const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRoute = require('./upload');
const filesRoute = require('./files');
const downloadRoute = require('./download');

const app = express();
app.use(cors());

// Accept large JSON bodies (base64 files)
app.use(express.json({ limit: '100mb' }));

// Serve static files from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routing
app.use('/api/upload', uploadRoute);
app.use('/api/files', filesRoute);
app.use('/api/download', downloadRoute);

// Files download page
app.get('/files/:id', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'files.html'));
});

// Fallback to index
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
