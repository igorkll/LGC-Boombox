const { getRandomValues } = require('crypto');

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
let music_loopmode = document.getElementById('music_loopmode');
let music_loopmode_img = document.getElementById('music_loopmode_img');
let music_visualizer = document.getElementById('music_visualizer');
let visualization_container = document.getElementById("visualization_container");
let visualization_main = document.getElementById("visualization_main");

let blackeningTimeout = 5000;

let restoreFullscreenState = null;
let fullscreenBlackeningTimer = null;
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

let alwaysMediaPreviewMargin = false;
let mediaPreviewMarginOptional = false;

function updateMediaPreviewMargin() {
    if (alwaysMediaPreviewMargin || !mediaPreviewMarginOptional) {
        media_preview.style.transform = 'scale(0.9)';
    } else {
        media_preview.style.transform = '';
    }
}

function enableMediaPreview(name, alwaysMargin=false) {
    alwaysMediaPreviewMargin = alwaysMargin;
    media_player.style.display = 'none';
    media_preview.style.display = 'inline';
    media_preview.src = name;
    updateMediaPreviewMargin();
}

function loadingLabel(filePath) {
    enableMediaPreview('apps/music/loading.gif', true);

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
    enableMediaPreview('apps/music/error.png', true);

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
    enableMediaPreview('apps/music/none.png', true);
}

function playerUnload() {
    media_player.pause();
    media_player.removeAttribute("src");
    media_player.load();
}

function openNone() {
    playerUnload();
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
        setTrackCover(enableMediaPreview, filePath).then(() => {});
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

function openImage(filePath) {
    playerUnload();
    showTrackName(filePath);
    enableMediaPreview(`file://${filePath}`);
    updateGui();
}

window.openMedia = function(filePath, callback, _manualOpen=true, reindex=true, noLoadingLabel=false, requireContinue=false) {
    manualOpen = _manualOpen;
    loadedMediaName = null;
    lastMediaPath = filePath;
    playingFlag = false;

    detectMediaType(filePath).then(result => {
        switch (result) {
            case 'audio':
                if (!noLoadingLabel) loadingLabel(filePath);
                if (!requireContinue) openAudio(filePath);
                if (callback != null && callback(true, result) && requireContinue) openAudio(filePath);
                break;

            case 'video':
                if (!noLoadingLabel) loadingLabel(filePath);
                if (!requireContinue) openVideo(filePath);
                if (callback != null && callback(true, result) && requireContinue) openVideo(filePath);
                break;

            case 'image':
                if (!noLoadingLabel) loadingLabel(filePath);
                if (!requireContinue) openImage(filePath);
                if (callback != null && callback(true, result) && requireContinue) openImage(filePath);
                break;

            default:
                if (_manualOpen) messagebox('unsupported file type', 'error');
                if (callback != null) callback(false, result);
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

function blackeningToggle(state) {
    if (state) {
        media_panel.classList.add("music-blackening-mode");
    } else {
        media_panel.classList.remove("music-blackening-mode");
    }
}

function stopBlackeningTimer() {
    if (fullscreenBlackeningTimer == null) return;
    clearTimeout(fullscreenBlackeningTimer);
    fullscreenBlackeningTimer = null;
}

function startBlackeningTimer() {
    if (fullscreenBlackeningTimer != null) return;
    fullscreenBlackeningTimer = setTimeout(() => {
        blackeningToggle(true);
        fullscreenBlackeningTimer = null;
    }, blackeningTimeout);
}

document.addEventListener("user_interaction", () => {
    if (restoreFullscreenState == null) return;
    stopBlackeningTimer();
    blackeningToggle(false);
    startBlackeningTimer();
})

function exitFromFullscreen() {
    stopBlackeningTimer();
    blackeningToggle(false);
    
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

    visualization_main.classList.add("hide-if-not-visualizer-enabled");
    let fullscreenRestore1 = fullscreenize(visualization_main, true);
    let fullscreenRestore2 = fullscreenize(media_panel, false);
    restoreFullscreenState = () => {
        visualization_main.classList.remove("hide-if-not-visualizer-enabled");
        fullscreenRestore1();
        fullscreenRestore2();
    };
    updateGui();

    startBlackeningTimer();
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

window.stopMedia = function (force=false) {
    if ((isMediaLoaded() && !media_player.paused) || force) {
        media_player.pause();
        updateGui();
        return true;
    }
    return false;
}

function nextMedia(playmode=0, _manualOpen=false, recursionLimit=null, noLoadingLabel=false) {
    if (recursionLimit != null && recursionLimit <= 0) {
        messagebox('failed to load any playlist item', 'error');
        return;
    }

    if (playlist != null) {
        if (!noLoadingLabel) loadingLabel();
        switch (playmode) {
            case 0:
                playlistIndex = wrapInt(playlistIndex + 1, playlist.length);
                break;

            case 1:
                playlistIndex = wrapInt(playlistIndex - 1, playlist.length);
                break;

            case 2: //current
                playmode = 0; //перебор в случаи проблемы вперед
                break;

            case 3: //random
                playlistIndex = getRandomInt(0, playlist.length - 1);
                playmode = 0; //перебор в случаи проблемы вперед
                break;
        }
        if (recursionLimit == null) {
            recursionLimit = playlist.length;
        }
        openMedia(playlist[playlistIndex], (result, fileType) => {
            if (!result || (fileType == "image" && !_manualOpen)) {
                setTimeout(() => {
                    nextMedia(playmode, _manualOpen, recursionLimit - 1, true);
                }, 0);
                return false;
            }
            return true;
        }, false, false, noLoadingLabel, true);
        manualOpen = _manualOpen;
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

function updateLoopmodeImage() {
    let loopmode = 'next';

    switch (storage_table.loopmode) {
        case 1:
            loopmode = 'loop';
            break;
        
        case 2:
            loopmode = 'previous';
            break;
        
        case 3:
            loopmode = 'stop';
            break;

        case 4:
            loopmode = 'random';
            break;
    }

    music_loopmode_img.src = `apps/music/loopmode_${loopmode}.png`;
}

updateLoopmodeImage();

music_loopmode.addEventListener("custom_click", () => {
    storage_table.loopmode = (storage_table.loopmode + 1) % 5;
    storage_save();
    updateLoopmodeImage();
});

function toogleVisualizerState(state) {
    if (state) {
        media_panel.classList.add("music-visualizer-self");
        media_panel.classList.remove("soap");
        visualization_container.classList.add("music-visualizer");
        visualization_main.classList.remove("soap");
        document.body.classList.add("overwrite-hide-if-not-visualizer-enabled");
    } else {
        media_panel.classList.remove("music-visualizer-self");
        media_panel.classList.add("soap");
        visualization_container.classList.remove("music-visualizer");
        visualization_main.classList.add("soap");
        document.body.classList.remove("overwrite-hide-if-not-visualizer-enabled");
    }
}

document.addEventListener("open_app", (event) => {
    if (storage_table.music_visualizer) {
        toogleVisualizerState(event.detail.name == "music");
    }
})

music_visualizer.addEventListener("custom_click", () => {
    storage_table.music_visualizer = !storage_table.music_visualizer;
    storage_save();
    toogleVisualizerState(storage_table.music_visualizer);
});

music_previous.addEventListener("custom_click", () => {
    nextMedia(1, true);
});

music_next.addEventListener("custom_click", () => {
    nextMedia(0, true);
});

function autoPlay() {
    switch (storage_table.loopmode) {
        case 1: //loop
            nextMedia(2);
            break;

        case 2: //previous
            nextMedia(1);
            break;

        case 3: //stop
            stopMedia(true);
            break;

        case 4: //random
            nextMedia(3);
            break;

        default: //next
            nextMedia();
            break;
    }
}

media_player.addEventListener('ended', () => {
    autoPlay();
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
        autoPlay();
    }
});

}