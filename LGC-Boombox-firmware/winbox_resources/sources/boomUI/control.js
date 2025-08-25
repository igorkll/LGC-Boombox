{
const { exec } = require('child_process');

document.getElementById('poweroff_button').addEventListener('custom_click', () => {
    exec('shutdown /s /t 0');
})

let verticalSlider = null;
let verticalSliderCloseTimeoutId = null;

document.getElementById('volume_button').addEventListener('custom_click', () => {
    if (verticalSlider) {
        clearTimeout(verticalSliderCloseTimeoutId);
        verticalSlider.remove();
        verticalSlider = null;
        verticalSliderCloseTimeoutId = null;
        return;
    }

    verticalSlider = document.createElement('vertical-slider');
    verticalSlider.style.position = 'absolute';
    verticalSlider.style.zIndex = '10';
    verticalSlider.style.right = '1%';
    verticalSlider.style.top = '10%';
    verticalSlider.style.bottom = '10%';
    verticalSlider.style.width = '15%';
    verticalSlider.style.setProperty('--slider-value', window.getVolume());
    document.body.appendChild(verticalSlider);

    function startTimer() {
        verticalSliderCloseTimeoutId = setTimeout(() => {
            verticalSlider.remove();
            verticalSlider = null;
            verticalSliderCloseTimeoutId = null;
        }, 5000);
    }

    startTimer();

    verticalSlider.addEventListener('change', value => {
        window.setVolume(value);

        if (verticalSliderCloseTimeoutId) clearInterval(verticalSliderCloseTimeoutId);
        startTimer();
    });
})

}