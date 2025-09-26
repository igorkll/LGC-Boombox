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
let music_duration = document.getElementById('music_duration');
let music_currentTime = document.getElementById('music_currentTime');

let restoreFullscreenState = null;
let lastMediaPath = null;
let loadedMediaName = null;
let manualOpen = false;
let playingFlag = false;
let playlist = null;
let playlistIndex = null;

function isMediaLoaded() {
    return media_player.src && media_player.src.trim() !== "";
}

function updateGui() {
    if (!media_player.paused && isMediaLoaded()) {
        music_playPause_img.src = 'apps/music/pause.png';
    } else {
        music_playPause_img.src = 'apps/music/play.png';
    }
    music_fullscreen_img.src = restoreFullscreenState == null ? 'apps/music/fullscreen.png' : 'apps/music/unfullscreen.png';
}

updateGui();

function loadingLabel(filePath) {
    media_player.style.display = 'none';
    media_preview.style.display = 'inline';
    media_preview.src = 'apps/music/loading.gif';

    music_trackname.innerHTML = "loading...";
    if (filePath != null) {
        getMediaName(filePath, (name) => {
            if (lastMediaPath != filePath) return;
            loadedMediaName = name;
            music_trackname.innerHTML = `loading "${name}"...`;
        });
    }
}

function showError(filePath, errorMessage) {
    media_player.style.display = 'none';
    media_preview.style.display = 'inline';
    media_preview.src = 'apps/music/error.png';

    if (loadedMediaName != null) {
        music_trackname.innerHTML = `${errorMessage} (${loadedMediaName}))`;
    } else {
        music_trackname.innerHTML = errorMessage;

        if (lastMediaPath != null) {
            getMediaName(lastMediaPath, (name) => {
                if (lastMediaPath != filePath) return;
                loadedMediaName = name;
                music_trackname.innerHTML = `${errorMessage} (${name}))`;
            });
        }
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

let showRealContent

function showTrackName(filePath) {
    if (loadedMediaName != null) {
        music_trackname.innerHTML = loadedMediaName;
    } else {
        getMediaName(filePath, (name) => {
            if (lastMediaPath != filePath) return;
            loadedMediaName = name;
            music_trackname.innerHTML = name;
        });
    }
}

function openAudio(filePath) {
    showRealContent = () => {
        if (lastMediaPath != filePath) return;
        showTrackName(filePath);
        defaultPreview();
        setTrackCover(media_preview, filePath).then(() => {});
    };

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

function openVideo(filePath) {
    showRealContent = () => {
        if (lastMediaPath != filePath) return;
        showTrackName(filePath);
        media_player.style.display = 'inline';
        media_preview.style.display = 'none';
    };

    media_player.src = toWebPath(filePath);
    media_player.play();
    updateGui();
}

window.openMedia = function(filePath, callback, _manualOpen=true, reindex=true) {
    manualOpen = _manualOpen;
    loadedMediaName = null;
    lastMediaPath = filePath;
    playingFlag = false;

    detectMediaType(filePath).then(result => {
        switch (result) {
            case 'audio':
                loadingLabel(filePath);
                openAudio(filePath);
                if (callback != null) {
                    callback(true);
                }
                break;

            case 'video':
                loadingLabel(filePath);
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

    if (reindex) {
        let dir = path.dirname(filePath);
        fs.readdir(dir, (err, files) => {
            if (err) files = [];
            let sortedFiles = files.sort();
            playlist = sortedFiles.map(file => path.join(dir, file));
            playlistIndex = null;

            for (let index = 0; index < playlist.length; index++) {
                let lpath = playlist[index];
                if (path.normalize(lpath) == path.normalize(filePath)) {
                    playlistIndex = index;
                    break;
                }
            }

            if (playlistIndex == null) {
                playlist = null;
            }
        });
    }
}

function exitFromFullscreen() {
    if (restoreFullscreenState != null) {
        media_panel.style.borderRadius = null;
        restoreFullscreenState();
        restoreFullscreenState = null;
        updateGui();
    }
}

music_fullscreen.addEventListener("custom_click", () => {
    if (restoreFullscreenState != null) {
        exitFromFullscreen();
        return;
    }
    media_panel.style.borderRadius = '0px';
    restoreFullscreenState = fullscreenize(media_panel);
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

function nextMedia(previous=false, _manualOpen=false) {
    if (playlist != null) {
        loadingLabel();
        if (previous) {
            playlistIndex = wrapInt(playlistIndex - 1, playlist.length);
        } else {
            playlistIndex = wrapInt(playlistIndex + 1, playlist.length);
        }
        openMedia(playlist[playlistIndex], null, _manualOpen, false);
    } else if (_manualOpen) {
        messagebox('playlist is not loaded', 'error');
    }
}

function updateProgressBar() {
    if (isMediaLoaded() && playingFlag) {
        music_progress.value = media_player.currentTime / media_player.duration;
        music_progress.locked = false;
        music_currentTime.innerHTML = formatTime(media_player.currentTime);
        music_duration.innerHTML = formatTime(media_player.duration);
    } else {
        music_progress.value = 0;
        music_progress.locked = true;
        music_currentTime.innerHTML = formatTime(0);
        music_duration.innerHTML = formatTime(0);
    }
}
setInterval(updateProgressBar, 50);
updateProgressBar();

music_progress.addEventListener("change", (event) => {
    if (isMediaLoaded() && playingFlag) {
        media_player.currentTime = event.detail * media_player.duration;
    }
});

music_previous.addEventListener("custom_click", () => {
    nextMedia(true, true);
});

music_next.addEventListener("custom_click", () => {
    nextMedia(false, true);
});

media_player.addEventListener('ended', () => {
    nextMedia();
});

media_player.addEventListener("playing", () => {
    playingFlag = true;
    if (showRealContent != null) {
        showRealContent();
        showRealContent = null;
    }
});

media_player.addEventListener("error", (e) => {
    if (manualOpen) {
        let err = media_player.error;
        let message = "";

        switch(err.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                message = "the fetching process was aborted by the user";
                break;
            case MediaError.MEDIA_ERR_NETWORK:
                message = "a network error occurred while fetching the media";
                break;
            case MediaError.MEDIA_ERR_DECODE:
                message = "an error occurred while decoding the media";
                break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                message = "the media format is not supported";
                break;
            default:
                message = "an unknown media error occurred";
        }

        //messagebox(message, 'error');
        showError(lastMediaPath, message);
    } else {
        nextMedia();
    }
});

}