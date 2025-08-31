{
const path = require('path');
const fs = require('fs');
const os = require('os');

let media_player = document.getElementById('media_player');
let media_preview = document.getElementById('media_preview');
let media_panel = document.getElementById('media_panel');
let music_progress = document.getElementById('music_progress');
let music_playPause = document.getElementById('music_playPause');
let music_previous = document.getElementById('music_previous');
let music_next = document.getElementById('music_next');
let music_playPause_img = document.getElementById('music_playPause_img');
let music_fullscreen_img = document.getElementById('music_fullscreen_img');

let restoreState = null;
let lastMediaPath = null;

function isMediaLoaded() {
    return media_player.src && media_player.src.trim() !== "";
}

function updateGui() {
    if (!media_player.paused && isMediaLoaded()) {
        music_playPause_img.src = 'apps/music/pause.png';
    } else {
        music_playPause_img.src = 'apps/music/play.png';
    }
    music_fullscreen_img.src = restoreState == null ? 'apps/music/fullscreen.png' : 'apps/music/unfullscreen.png';
}

updateGui();

function openNone() {
    lastMediaPath = null;
    media_player.style.display = 'none';
    media_preview.style.display = 'inline';
    media_preview.src = 'apps/music/none.png';
}

openNone();

function getPreviousAndNextFile(filePath, callback) {
    let dir = path.dirname(filePath);
    fs.readdir(dir, (err, files) => {
        if (err) files = [];
        const fullPaths = files.map(file => path.join(dir, file));
        for (let index in fullPaths) {
            let lpath = fullPaths[index];
            if (path.normalize(lpath) == path.normalize(filePath)) {
                console.log(fullPaths);
                console.log(index);
                callback(lpath, fullPaths[index - 1], fullPaths[index + 1]);
            }
        }
    });
}

window.openAudio = function (filePath) {
    openNone();
    lastMediaPath = filePath;
    setTrackCover(media_preview, filePath).then(() => {});

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

window.openVideo = function (filePath) {
    lastMediaPath = filePath;

    media_player.style.display = 'inline';
    media_preview.style.display = 'none';

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

window.openMedia = function(filePath) {
    lastMediaPath = filePath;

    detectMediaType(filePath).then(result => {
        switch (result) {
            case 'audio':
                openAudio(filePath);
                openApp('music');
                break;

            case 'video':
                openVideo(filePath);
                openApp('music');
                break;

            default:
                messagebox('unsupported file type', 'error');
                break;
        }
    });
}

function exitFromFullscreen() {
    if (restoreState != null) {
        restoreState();
        restoreState = null;
        updateGui();
    }
}

music_fullscreen.addEventListener("custom_click", () => {
    if (restoreState != null) {
        exitFromFullscreen();
        return;
    }
    restoreState = fullscreenize(media_panel);
    updateGui();
});

music_playPause.addEventListener("custom_click", () => {
    if (isMediaLoaded()) {
        if (media_player.paused) {
            media_player.play();
        } else {
            media_player.pause();
        }
        updateGui();
    } else {
        exitFromFullscreen();
        openApp("files");
    }
});

media_player.addEventListener('ended', updateGui);

function updateProgressBar() {
    if (isMediaLoaded()) {
        music_progress.value = media_player.currentTime / media_player.duration;
    } else {
        music_progress.value = 0;
    }
}
setInterval(updateProgressBar, 50);
updateProgressBar();

music_progress.addEventListener("change", (event) => {
    if (isMediaLoaded()) {
        media_player.currentTime = event.detail * media_player.duration;
    }
});

music_previous.addEventListener("custom_click", () => {
    if (lastMediaPath == null) return;
    getPreviousAndNextFile(lastMediaPath, (currentPath, previousPath, nextPath) => {
        console.log(previousPath);
        openMedia(previousPath);
    });
});

music_next.addEventListener("custom_click", () => {
    if (lastMediaPath == null) return;
    getPreviousAndNextFile(lastMediaPath, (currentPath, previousPath, nextPath) => {
        console.log(nextPath);
        openMedia(nextPath);
    });
});

}