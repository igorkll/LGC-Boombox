const { app, BrowserWindow, ipcMain } = require('electron');
const net = require('net');

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
    const client = net.connect('\\\\.\\pipe\\LGCBoombox_AudioCapture');

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

app.on('window-all-closed', () => {
    app.quit();
});