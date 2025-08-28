function wrapInt(value, max) {
    return ((value % max) + max) % max;
}

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

function isTouch(event, element) {
    for (let i = 0; i < event.touches.length; i++) {
        let touchObj = event.touches[i];
        if (window.isTouchingElement(touchObj, element) && window.isTouchingElementLayerCheck(touchObj, element)) {
            return true;
        }
    }

    return false;
}

{
let autoSaveSettings = false;

const { exec } = require('child_process');

// wallpaper

window.setWallpaper = function(path) {
    storage_table.wallpaper = path;
    document.body.style.backgroundImage = `url('${path}')`;
    if (autoSaveSettings) storage_save();
}

setWallpaper(storage_table.wallpaper);

// volume
let max_volume = 65535 * volume_multiplier;

window.setVolume = function(volume) {
    storage_table.volume = volume;
    exec(`nircmd setsysvolume ${Math.round(volume * max_volume)}`);
    if (autoSaveSettings) storage_save();
}

window.getVolume = function() {
    return storage_table.volume;
}

setVolume(storage_table.volume);

// enable autosave
autoSaveSettings = true;
}