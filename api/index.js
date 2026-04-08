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

const os = require('os');

// Helper to get local IP
function getWifiIP() {
  var nets = os.networkInterfaces();
  var candidates = [];
  for (var name of Object.keys(nets)) {
    for (var net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        candidates.push({ name: name, address: net.address });
      }
    }
  }
  var wifi = candidates.find(function(c) { return c.address.startsWith('192.168.'); });
  if (wifi) return wifi.address;
  var ten = candidates.find(function(c) { return c.address.startsWith('10.'); });
  if (ten) return ten.address;
  var c172 = candidates.find(function(c) { return c.address.startsWith('172.'); });
  if (c172) return c172.address;
  if (candidates.length > 0) return candidates[0].address;
  return 'localhost';
}

// API routing
app.use('/api/upload', uploadRoute);
app.use('/api/files', filesRoute);
app.use('/api/download', downloadRoute);

app.get('/api/ip', function(req, res) {
  res.json({ ip: getWifiIP() });
});

// Files download page
app.get('/files/:id', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'files.html'));
});

// Fallback to index
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
