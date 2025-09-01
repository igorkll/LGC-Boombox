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
let loadedMediaName = null;

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

function loadingLabel(filePath) {
    media_player.style.display = 'none';
    media_preview.style.display = 'inline';
    media_preview.src = 'apps/music/loading.gif';

    music_trackname.innerHTML = "loading...";
    if (filePath != null) {
        getMediaName(filePath, (name) => {
            if (loadedMediaName != null) return;
            loadedMediaName = name;
            music_trackname.innerHTML = `loading "${name}"...`;
        });
    }
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

let oldDirPath = null;
let cachedFullPaths = null;

async function _getPreviousAndNextFile(filePath, callback) {
    for (let index = 0; index < cachedFullPaths.length; index++) {
        let lpath = cachedFullPaths[index];
        if (path.normalize(lpath) == path.normalize(filePath)) {
            callback(lpath, cachedFullPaths[wrapInt(index - 1, cachedFullPaths.length)], cachedFullPaths[wrapInt(index + 1, cachedFullPaths.length)]);
            return;
        }
    }
    callback(filePath, filePath, filePath);
}

function getPreviousAndNextFile(filePath, callback) {
    let dir = path.dirname(filePath);

    if (cachedFullPaths != null && oldDirPath == dir) {
        _getPreviousAndNextFile(filePath, callback);
        return;
    }

    fs.readdir(dir, (err, files) => {
        if (err) files = [];
        const sortedFiles = files.sort();
        cachedFullPaths = sortedFiles.map(file => path.join(dir, file));
        oldDirPath = dir;
        _getPreviousAndNextFile(filePath, callback);
    });
}

let showRealContent

function showTrackName(filePath) {
    if (loadedMediaName != null) {
        music_trackname.innerHTML = loadedMediaName;
    } else {
        getMediaName(filePath, (name) => {
            loadedMediaName = name;
            music_trackname.innerHTML = name;
        });
    }
}

function openAudio(filePath) {
    lastMediaPath = filePath;

    showRealContent = () => {
        showTrackName(filePath);
        defaultPreview();
        setTrackCover(media_preview, filePath).then(() => {});
    };

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

function openVideo(filePath) {
    lastMediaPath = filePath;

    showRealContent = () => {
        showTrackName(filePath);
        media_player.style.display = 'inline';
        media_preview.style.display = 'none';
    };

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

window.openMedia = function(filePath, callback) {
    loadedMediaName = null;
    loadingLabel(filePath);
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

media_player.addEventListener("playing", () => {
    if (showRealContent != null) {
        showRealContent();
        showRealContent = null;
    }
});

}