{
const { exec } = require('child_process');

document.getElementById('poweroff_button').addEventListener('custom_click', () => {
    exec('shutdown /s /t 0');
})

let volumeSlider = null;
let volumeSliderCloseTimeoutId = null;

function deleteVolumeSlider() {
    clearTimeout(volumeSliderCloseTimeoutId);
    volumeSlider.remove();
    volumeSlider = null;
    volumeSliderCloseTimeoutId = null;
}

document.getElementById('volume_button').addEventListener('custom_click', () => {
    if (volumeSlider) {
        deleteVolumeSlider();
        return;
    }

    volumeSlider = document.createElement('custom-slider');
    volumeSlider.style.position = 'absolute';
    volumeSlider.style.zIndex = '10';
    volumeSlider.style.right = '1%';
    volumeSlider.style.top = '10%';
    volumeSlider.style.bottom = '10%';
    volumeSlider.style.width = '15%';
    volumeSlider.style.setProperty('--slider-value', window.getVolume());
    //volumeSlider.style.setProperty('--slider-vertical', true);
    document.body.appendChild(volumeSlider);

    function startTimer() {
        volumeSliderCloseTimeoutId = setTimeout(() => {
            volumeSlider.remove();
            volumeSlider = null;
            volumeSliderCloseTimeoutId = null;
        }, 5000);
    }

    startTimer();

    volumeSlider.addEventListener('change', value => {
        window.setVolume(value.detail);

        if (volumeSliderCloseTimeoutId) clearInterval(volumeSliderCloseTimeoutId);
        startTimer();
    });

    volumeSlider.addEventListener('click_outside', () => {
        deleteVolumeSlider();
    });
})

}