const { ipcRenderer } = require('electron');

ipcRenderer.on('audio-data', (event, chunk) => {
    console.log(chunk.length);
});