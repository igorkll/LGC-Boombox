let shutdown_flag = false;

function wrapInt(value, max) {
    return ((value % max) + max) % max;
}

function mapRange(x, inMin, inMax, outMin, outMax) {
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
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

function toWebPath(filePath) {
    return `file://${filePath.replace(/\\/g, '/')}`;
}

function fullscreenize(element) {
    // Сохраняем исходный родитель и следующий элемент
    const parent = element.parentNode;
    const nextSibling = element.nextSibling;

    // Сохраняем текущие inline-стили
    const prevStyles = {
        position: element.style.position || '',
        top: element.style.top || '',
        left: element.style.left || '',
        width: element.style.width || '',
        height: element.style.height || '',
        zIndex: element.style.zIndex || '',
        objectFit: element.style.objectFit || '',
    };

    // Создаем overlay для фона
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '9998'; // чуть ниже элемента
    overlay.style.backgroundImage = getComputedStyle(document.body).backgroundImage;
    overlay.style.backgroundSize = getComputedStyle(document.body).backgroundSize;
    overlay.style.backgroundPosition = getComputedStyle(document.body).backgroundPosition;
    overlay.style.backgroundRepeat = getComputedStyle(document.body).backgroundRepeat;

    document.body.appendChild(overlay);

    // Перемещаем элемент в body
    document.body.appendChild(element);

    // fullscreen стили для элемента
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.width = '100vw';
    element.style.height = '100vh';
    element.style.zIndex = '9999';
    if (element.tagName.toLowerCase() === 'video' || element.tagName.toLowerCase() === 'img') {
        element.style.objectFit = 'contain';
    }

    // Возвращаем лямбду для восстановления
    return () => {
        // Убираем overlay
        overlay.remove();

        // Возвращаем элемент на место
        if (nextSibling) parent.insertBefore(element, nextSibling);
        else parent.appendChild(element);

        // Восстанавливаем стили
        element.style.position = prevStyles.position;
        element.style.top = prevStyles.top;
        element.style.left = prevStyles.left;
        element.style.width = prevStyles.width;
        element.style.height = prevStyles.height;
        element.style.zIndex = prevStyles.zIndex;
        element.style.objectFit = prevStyles.objectFit;
    };
}

{
let autoSaveSettings = false;

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { fileTypeFromFile } = require('file-type');
const { ipcRenderer } = require('electron');

let messageboxTypes = {
    error: {
        icon: "error"
    }
};

let messageboxDefaultButtons = ["okay"];

// other
window.getActualTimeDate = function (callback) {
    /*
    exec('powershell -Command "Get-Date -Format \'yyyy-MM-dd HH:mm:ss\'"', (err, stdout) => {
        if (err) {
            console.error("Error getting system time:", err);
            return;
        }

        // Преобразуем в объект Date
        const dateTimeStr = stdout.trim().replace(' ', 'T'); // "2025-09-01T22:45:30"
        const dateObj = new Date(dateTimeStr);

        callback(dateObj);
    });
    */

    callback(new Date());
}

window.formatTime = function (seconds) {
    if (isNaN(seconds)) return "00:00:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
}

// fs
window.removeTemp = function () {
    fs.rm(path.join(os.tmpdir(), 'LGCBoombox'), { recursive: true, force: true }, (err) => {});
}

window.getFileName = function (filePath) {
    return path.basename(filePath, path.extname(filePath));
}

window.getMediaName = function (filePath, callback) {
    callback(getFileName(filePath));
}

// media
window.detectMediaType = async function (filePath) {
    const type = await fileTypeFromFile(filePath);
    if (!type) return 'unknown';

    if (type.mime.startsWith('audio/')) return 'audio';
    if (type.mime.startsWith('video/')) return 'video';
    return 'other';
}

window.setTrackCover = async function (imgElement, filePath) {
    const tempPath = await ipcRenderer.invoke('get-track-cover', filePath);
    if (tempPath) {
        imgElement.src = `file://${tempPath}`;
        console.log('Cover image set successfully.');
    } else {
        console.log('No cover found.');
    }
}

// messagebox
window.messagebox = function (message, type, callback, buttons, title) {
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
    msgboxBody.style.display = 'flex';
    msgboxBody.style.justifyContent = 'flex-start';
    msgboxBody.style.alignItems = 'center';
    msgboxBody.style.flexDirection = 'column';
    msgboxBody.style.padding = '1vh 1vh';
    msgboxBody.style.boxSizing = 'border-box';
    document.body.appendChild(msgboxBody);

    if (title != null) {
        let titleObject = document.createElement('div');
        titleObject.classList.add("info");
        titleObject.innerHTML = title;
        titleObject.style.margin = '1vh 1vh';
        msgboxBody.appendChild(titleObject);
    }

    if (type != null) {
        let typeData = messageboxTypes[type];

        if (typeData.hasOwnProperty('icon')) {
            let img = document.createElement('img');
            img.src = `icons/${typeData.icon}.png`;
            img.style.height = '20vh';
            img.style.margin = '1vh 1vh';
            img.style.objectFit = 'contain';
            msgboxBody.appendChild(img);
        }

        if (buttons == null && typeData.hasOwnProperty('buttons')) {
            buttons = typeData.buttons;
        }
    }

    if (message != null) {
        let text = document.createElement('div');
        text.classList.add("info");
        text.classList.add("soap");
        text.style.padding = '2vh 2vh';
        text.style.margin = '1vh 1vh';
        text.style.boxSizing = 'border-box';
        text.style.flex = '1';
        text.style.overflow = 'hidden';
        text.style.wordBreak = 'break-word';
        text.innerHTML = message;
        msgboxBody.appendChild(text);
    }

    if (buttons == null) {
        buttons = messageboxDefaultButtons;
    }

    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.flexDirection = 'row';
    buttonContainer.style.width = '100%';
    msgboxBody.appendChild(buttonContainer);

    for (let i = 0; i < buttons.length; i++) {
        let button = document.createElement('custom-button');
        button.style.margin = '1vh 1vh';
        button.style.flex = '1';
        button.innerHTML = buttons[i];
        buttonContainer.appendChild(button);

        button.addEventListener("custom_click", () => {
            if (callback != null) callback(i);
            msgboxBackground.remove();
            msgboxBody.remove();
        })
    }
}

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

// shutdown
window.shutdown = function(reboot) {
    if (reboot) {
        exec('shutdown /r /t 0');
    } else {
        exec('shutdown /s /t 0');
    }
}

ipcRenderer.on('on-shutdown', (event) => {
    shutdown_flag = true;

    let ledsCount = leds_getCount();
    for (let i = 0; i < ledsCount; i++) {
        leds_set(i, [0, 0, 0]);
    }
    leds_flush();

    removeTemp();

    ipcRenderer.send('on-shutdown-done');
});

// enable autosave
autoSaveSettings = true;
}

removeTemp();