{
const { ipcRenderer } = require('electron');

ipcRenderer.on('waves', (event, waves) => {
    for (let i = 0; i <= 5; i++) {
        let element = document.getElementById(`visualization_${i}`);
        element.style.height = `${waves[i] * 100}%`;
        document.getElementById(`visualization_light_${i}`).style.height = `${waves[i] * 100}%`;
    }

    for (let i = 0; i <= window.leds_getCount(); i++) {
        let color;
        if (waves[0] > storage_table.light_bassLevel) {
            color = [255, 255, 255];
        } else {
            let waveIndex = i % 6;
            let element = document.getElementById(`visualization_${waveIndex}`);
            let val = waves[waveIndex];
            if (val < storage_table.light_min) {
                val = storage_table.light_min;
            }
            color = window.colors_multiply(window.colors_from(element.style.getPropertyValue('--c').trim()), val);
        }
        color = window.colors_multiply(color, storage_table.light_mul);
        color = window.colors_clamp(color, 0, storage_table.light_max * 255);
        window.leds_set(i, color);
    }
    window.leds_flush();
});
}