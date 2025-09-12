const { app, BrowserWindow, ipcMain, session } = require('electron');
const { exec } = require('child_process');
const net = require('net');
const path = require('path');
const mm = require('music-metadata');
const os = require('os');
const fs = require('fs');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    });

    win.loadFile('main.html');
    win.setMenu(null);

    win.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F11") {
            event.preventDefault();
        }
    });

    if (process.defaultApp) {
        win.webContents.openDevTools();
    }

    // ------------------------- permission
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        callback(true);
    });

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
        exec(`"${path.join(__dirname, "../../AudioCapture/AudioCapture.exe")}"`);
        console.log(`pipe created: LGCBoombox_AudioCapture`);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});


ipcMain.on('quit-app', () => {
    app.quit();
});

ipcMain.handle('get-track-cover', async (event, filePath) => {
    try {
        const metadata = await mm.parseFile(filePath, { native: true });
        const picture = metadata.common.picture?.[0];
        if (!picture) return null;

        fs.mkdir(path.join(os.tmpdir(), 'LGCBoombox'), { recursive: true }, (err) => {});

        const ext = picture.format.split('/')[1];
        const tempFilePath = path.join(os.tmpdir(), 'LGCBoombox', `track_cover_${Date.now()}.${ext}`);
        fs.writeFileSync(tempFilePath, picture.data);
        return tempFilePath;
    } catch (err) {
        console.error('Error reading metadata:', err.message);
        return null;
    }
});