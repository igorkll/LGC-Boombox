const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const net = require('net');
const path = require('path');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('main.html');
    win.setMenu(null);

    win.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F11") {
            event.preventDefault();
        }
    });

    win.webContents.openDevTools();

    // ------------------------- AudioCapture
    const server = net.createServer((client) => {
        client.on('data', (data) => {
            const messages = data.toString().split('\n').filter(Boolean);
            messages.forEach(msg => {
                try {
                    const obj = JSON.parse(msg);
                    win.webContents.send('waves', obj);
                } catch (err) {
                }
            });
        });
    });

    server.listen('\\\\.\\pipe\\LGCBoombox_AudioCapture', () => {
        exec(`"${path.join(__dirname, "AudioCapture/AudioCapture.exe")}"`);
        console.log(`pipe created: LGCBoombox_AudioCapture`);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});