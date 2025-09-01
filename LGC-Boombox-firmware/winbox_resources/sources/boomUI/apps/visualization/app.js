{
const { ipcRenderer } = require('electron');

let lightOffset = 0;
let oldTime;
let bassDetected = false;
let oldDeltaValue = 0;
let deltaValue = 0;
let deltaCounter = 0;

ipcRenderer.on('waves', (event, waves) => {
    if (shutdown_flag) return;

    for (let i = 0; i <= 5; i++) {
        let element = document.getElementById(`visualization_${i}`);
        element.style.height = `${waves[i] * 100}%`;
        document.getElementById(`visualization_light_${i}`).style.height = `${waves[i] * 100}%`;
    }

    // light
    oldTime = oldTime || performance.now();
    let deltaTime = performance.now() - oldTime;

    if (storage_table.light_deltaBassLevel) {
        deltaValue = deltaValue + waves[0];
        deltaCounter = deltaCounter + deltaTime;
        if (deltaCounter > 50) {
            let detectedDelta = deltaValue - oldDeltaValue;
            bassDetected = detectedDelta > storage_table.light_bassLevel;
            deltaCounter = 0;
            oldDeltaValue = deltaValue;
            deltaValue = 0;
        }
    } else {
        bassDetected = waves[0] > storage_table.light_bassLevel;
    }

    let realLedsCount = leds_getCount();
    let ledsCount = realLedsCount;
    if (storage_table.light_enabled && storage_table.light_mirror) {
        ledsCount /= 2;
    }
    for (let i = 0; i < ledsCount; i++) {
        if (storage_table.light_enabled) {
            let color;
            if (bassDetected) {
                color = [255, 255, 255];
            } else {
                let waveIndex = wrapInt(Math.round((i / storage_table.light_leds) - lightOffset), 6);
                let element = document.getElementById(`visualization_${waveIndex}`);
                let val = waves[waveIndex];
                if (val < storage_table.light_min) {
                    val = storage_table.light_min;
                }
                color = colors_multiply(colors_from(element.style.getPropertyValue('--c').trim()), val);
            }
            color = colors_multiply(color, storage_table.light_mul);
            color = colors_clamp(color, 0, storage_table.light_max * 255);

            let ni = i;
            if (storage_table.light_reverse) {
                ni = ledsCount - 1 - i;
            }
            leds_set(ni, color);
            if (storage_table.light_mirror) {
                leds_set(realLedsCount - 1 - ni, color);
            }
        } else {
            leds_set(i, [0, 0, 0]);
        }
    }
    leds_flush();

    lightOffset += storage_table.light_moveSpeed * (deltaTime / 1000);

    oldTime = performance.now();
});
}