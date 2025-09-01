{
const path = require('path');
const fs = require('fs');
const os = require('os');

let music_trackname = document.getElementById('music_trackname');
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

function loadingLabel() {
    media_player.style.display = 'none';
    media_preview.style.display = 'inline';
    media_preview.src = 'apps/music/loading.gif';

    music_trackname.innerHTML = "loading...";
}

function defaultPreview() {
    media_player.style.display = 'none';
    media_preview.style.display = 'inline';
    media_preview.src = 'apps/music/none.png';
}

function openNone() {
    defaultPreview();

    music_trackname.innerHTML = "nothing is selected";
}

openNone();

function getPreviousAndNextFile(filePath, callback) {
    let dir = path.dirname(filePath);
    fs.readdir(dir, (err, files) => {
        if (err) files = [];
        const sortedFiles = files.sort();
        const fullPaths = sortedFiles.map(file => path.join(dir, file));
        for (let index = 0; index < fullPaths.length; index++) {
            let lpath = fullPaths[index];
            if (path.normalize(lpath) == path.normalize(filePath)) {
                callback(lpath, fullPaths[wrapInt(index - 1, fullPaths.length)], fullPaths[wrapInt(index + 1, fullPaths.length)]);
            }
        }
    });
}

window.openAudio = function (filePath) {
    defaultPreview();
    lastMediaPath = filePath;

    music_trackname.innerHTML = getMediaName(filePath);
    
    setTrackCover(media_preview, filePath).then(() => {});

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

window.openVideo = function (filePath) {
    lastMediaPath = filePath;

    music_trackname.innerHTML = getMediaName(filePath);

    media_player.style.display = 'inline';
    media_preview.style.display = 'none';

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

window.openMedia = function(filePath, callback) {
    loadingLabel();
    lastMediaPath = filePath;
    detectMediaType(filePath).then(result => {
        switch (result) {
            case 'audio':
                openAudio(filePath);
                if (callback != null) {
                    callback(true);
                }
                break;

            case 'video':
                openVideo(filePath);
                if (callback != null) {
                    callback(true);
                }
                break;

            default:
                messagebox('unsupported file type', 'error');
                if (callback != null) {
                    callback(false);
                }
                break;
        }
    });
}

function exitFromFullscreen() {
    if (restoreState != null) {
        media_panel.style.borderRadius = null;
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
    media_panel.style.borderRadius = '0px';
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

function nextMedia(previous=false) {
    loadingLabel();
    getPreviousAndNextFile(lastMediaPath, (currentPath, previousPath, nextPath) => {
        if (previous) {
            openMedia(previousPath);
        } else {
            openMedia(nextPath);
        }
    });
}

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
    nextMedia(true);
});

music_next.addEventListener("custom_click", () => {
    if (lastMediaPath == null) return;
    nextMedia();
});

media_player.addEventListener('ended', () => {
    nextMedia();
});

}