const express = require('express');
const cors = require('cors');

const uploadRoute = require('./upload');
const filesRoute = require('./files');
const downloadRoute = require('./download');

const app = express();
app.use(cors());
app.use(express.json());

// Main routing
app.use('/api/upload', uploadRoute);
app.use('/api/files', filesRoute);
app.use('/api/download', downloadRoute);

module.exports = app;
