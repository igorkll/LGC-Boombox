{
const { ipcRenderer } = require('electron');

ipcRenderer.on('waves', (event, waves) => {
    for (let i = 0; i <= 5; i++) {
        document.getElementById(`visualization_${i}`).style.height = `${waves[i] * 100}%`;
        document.getElementById(`visualization_light_${i}`).style.height = `${waves[i] * 100}%`;
        window.leds_set(i, waves[i] * 255);
    }
    window.leds_flush();
});
}