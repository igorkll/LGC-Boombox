{
let media_player = document.getElementById('media_player');
let media_panel = document.getElementById('media_panel');
let music_progress = document.getElementById('music_progress');
let music_playPause = document.getElementById('music_playPause');
let music_playPause_img = document.getElementById('music_playPause_img');
let music_fullscreen_img = document.getElementById('music_fullscreen_img');

let restoreState = null;

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

window.openAudio = function (path) {

}

window.openVideo = function (path) {
    media_player.src = toWebPath(path);
    media_player.play();
    updateGui();
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
}