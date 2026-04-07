const express = require('express');
const path = require('path');
const apiApp = require('./api/index');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Use the API router
app.use(apiApp);

// Rewrite for files/[id] to serve the frontend files.html
app.get('/files/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'files.html'));
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running locally!`);
  console.log(`Access the app locally via: http://localhost:\${PORT}`);
  
  // Try mapping local IP to show user for local network access
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`Available on local network at: http://\${net.address}:\${PORT}`);
      }
    }
  }
});
