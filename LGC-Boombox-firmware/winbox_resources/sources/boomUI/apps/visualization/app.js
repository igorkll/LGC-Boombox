{
const { ipcRenderer } = require('electron');

ipcRenderer.on('waves', (event, waves) => {
    for (let i = 0; i <= 5; i++) {
        let element = document.getElementById(`visualization_${i}`);
        element.style.height = `${waves[i] * 100}%`;
        document.getElementById(`visualization_light_${i}`).style.height = `${waves[i] * 100}%`;
    }

    if (waves[0] > storage_table.light_bassLevel) {
        for (let i = 0; i <= window.leds_getCount(); i++) {
            window.leds_set(i, [255, 255, 255]);
        }
    } else {
        for (let i = 0; i <= window.leds_getCount(); i++) {
            let waveIndex = i % 6;
            let element = document.getElementById(`visualization_${waveIndex}`);
            window.leds_set(i, window.colors_multiply(window.colors_from(element.style.getPropertyValue('--c').trim()), waves[waveIndex]));
        }
    }
    window.leds_flush();
});
}