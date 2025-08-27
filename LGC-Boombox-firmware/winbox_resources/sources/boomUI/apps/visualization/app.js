{
const { ipcRenderer } = require('electron');

ipcRenderer.on('waves', (event, waves) => {
    for (let i = 0; i <= 5; i++) {
        let element = document.getElementById(`visualization_${i}`);
        element.style.height = `${waves[i] * 100}%`;
        document.getElementById(`visualization_light_${i}`).style.height = `${waves[i] * 100}%`;
    }

    let realLedsCount = window.leds_getCount();
    let ledsCount = realLedsCount;
    if (storage_table.light_mirror) {
        ledsCount /= 2;
    }
    for (let i = 0; i < ledsCount; i++) {
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

        let ni = i;
        if (storage_table.light_reverse || true) {
            ni = ledsCount - 1 - i;
        }
        window.leds_set(ni, color);
        if (storage_table.light_mirror) {
            window.leds_set(realLedsCount - 1 - ni, color);
        }
    }
    window.leds_flush();
});
}