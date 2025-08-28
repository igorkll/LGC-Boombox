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

function isTouchingElementWithLayerCheck(touch, element) {
    return isTouchingElement(touch, element) && isTouchingElementLayerCheck(touch, element);
}

function isTouchOnTouchscreen(event, element) {
    for (let i = 0; i < event.touches.length; i++) {
        let touchObj = event.touches[i];
        if (isTouchingElementWithLayerCheck(touchObj, element)) {
            return true;
        }
    }

    return false;
}

function isTouch(event, element) {
    if (isTouchingElementWithLayerCheck(event, element)) return true;
    if (event.touches != null && isTouchOnTouchscreen(event, element)) return true;
    return false;
}

function messagebox(message) {
    let msgboxBackground = document.createElement('div');
    msgboxBackground.style.position = 'absolute';
    msgboxBackground.style.zIndex = '20';
    msgboxBackground.style.width = '100%';
    msgboxBackground.style.height = '100%';
    msgboxBackground.style.backdropFilter = 'blur(1vh)';
    msgboxBackground.style.backgroundColor = 'rgba(20, 20, 20, 0.2)';
    msgboxBackground.style.display = 'flex';
    msgboxBackground.style.justifyContent = 'center';
    msgboxBackground.style.alignItems = 'center';
    document.body.appendChild(msgboxBackground);

    let msgboxBody = document.createElement('div');
    msgboxBody.classList.add("soap");
    msgboxBody.style.position = 'absolute';
    msgboxBody.style.zIndex = '21';
    msgboxBody.style.width = '80%';
    msgboxBody.style.height = '80%';
    msgboxBody.style.display = 'flex';
    msgboxBody.style.justifyContent = 'center';
    msgboxBody.style.alignItems = 'center';
    document.body.appendChild(msgboxBody);
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