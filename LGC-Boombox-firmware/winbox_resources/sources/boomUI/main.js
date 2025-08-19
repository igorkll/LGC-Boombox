const { app, BrowserWindow, ipcMain } = require('electron');
const portAudio = require('naudiodon');

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

    console.log(portAudio.getDevices());

    const ai = new portAudio.AudioInput({
        channelCount: 2,
        sampleFormat: portAudio.SampleFormat16Bit,
        sampleRate: 44100,
        deviceId: 1,
        closeOnError: true
    });

    ai.on('data', (chunk) => {
        console.log('PCM data length:', chunk.length);
        mainWindow.webContents.send('audio-data', chunk);
    });

    ai.start();
});

app.on('window-all-closed', () => {
    app.quit();
});