function isTouchingElement(touch, element) {
    const rect = element.getBoundingClientRect();
    return (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
    );
}

function isTouchingElementLayerCheck(touch, element) {
    let topElement = document.elementFromPoint(touch.clientX, touch.clientY);
    return topElement === element || element.contains(topElement);
}

{
const { exec } = require('child_process');

// wallpaper

window.setWallpaper = function(path, dontSave) {
    document.body.style.backgroundImage = `url('${path}')`;
    if (!dontSave) {
        localStorage.setItem('wallpaper', path);
    }
}

setWallpaper(storage_table.wallpaper);

// volume
let max_volume = 65535 * volume_multiplier;
let current_volume;

window.setVolume = function(volume, dontSave) {
    exec(`nircmd setsysvolume ${Math.round(volume * max_volume)}`);
    current_volume = volume;
    if (!dontSave) {
        localStorage.setItem('volume', volume);
    }
}

window.getVolume = function() {
    return current_volume;
}

setVolume(storage_table.volume);
}