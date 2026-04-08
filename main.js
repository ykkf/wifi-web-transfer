const { app, BrowserWindow } = require('electron');
const path = require('path');

// 1. サーバーのプログラムを裏側で実行する
require('./server.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 800,
    title: 'Wi-Fi Web Transfer',
    backgroundColor: '#0F172A',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 少し待ってからサーバーのURLを開く（サーバー起動猶予）
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:8080');
  }, 1000);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
