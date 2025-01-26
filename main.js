const { app, BrowserWindow, session } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js in the renderer
      contextIsolation: false, // Simplify for development
    },
  });

  mainWindow.loadFile('index.html');

  // Grant geolocation permission
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'geolocation') {
      callback(true); // Approve geolocation requests
    } else {
      callback(false); // Deny other requests
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
