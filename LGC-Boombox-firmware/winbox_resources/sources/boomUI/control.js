{
const { ipcRenderer } = require('electron');

document.getElementById('poweroff_button').addEventListener('custom_click', () => {
    ipcRenderer.send('exec', 'shutdown /s /t 600');
})

document.getElementById('volume_button').addEventListener('custom_click', () => {
    
})
}