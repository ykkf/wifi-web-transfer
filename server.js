const express = require('express');
const path = require('path');
const os = require('os');
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
  // Prefer 192.168.x.x (typical home Wi-Fi)
  var wifi = candidates.find(function(c) { return c.address.startsWith('192.168.'); });
  if (wifi) return wifi.address;
  // Then try 10.x.x.x
  var ten = candidates.find(function(c) { return c.address.startsWith('10.'); });
  if (ten) return ten.address;
  // Fallback to first available
  if (candidates.length > 0) return candidates[0].address;
  return null;
}

app.listen(PORT, '0.0.0.0', function() {
  var wifiIP = getWifiIP();

  console.log('');
  console.log('==================================================');
  console.log('  Server is running!');
  console.log('==================================================');
  console.log('');
  console.log('  PC browser  : http://localhost:' + PORT);
  if (wifiIP) {
    console.log('  iPad / phone: http://' + wifiIP + ':' + PORT);
  } else {
    console.log('  [WARNING] Could not detect Wi-Fi IP.');
    console.log('  Make sure your PC is connected to Wi-Fi.');
  }
  console.log('');
  console.log('  * iPad and PC must be on the SAME Wi-Fi network.');
  console.log('  * If iPad cannot connect, run start_app.bat');
  console.log('    as Administrator (right-click > Run as admin).');
  console.log('');
  console.log('  Press Ctrl+C to stop the server.');
  console.log('==================================================');
});
