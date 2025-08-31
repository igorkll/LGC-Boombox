{
let media_player = document.getElementById('media_player');
let media_panel = document.getElementById('media_panel');
let music_playPause_img = document.getElementById('music_playPause_img');
let music_fullscreen_img = document.getElementById('music_fullscreen_img');

let restoreState = null;

window.openAudio = function (path) {

}

window.openVideo = function (path) {
    media_player.src = toWebPath(path);
    media_player.play();
}

function updateGui() {
    music_fullscreen_img.src = restoreState == null ? 'apps/music/fullscreen.png' : 'apps/music/unfullscreen.png';
}

updateGui();

music_fullscreen.addEventListener("custom_click", () => {
    if (restoreState != null) {
        restoreState();
        restoreState = null;
        updateGui();
        return;
    }
    restoreState = fullscreenize(media_panel);
    updateGui();
});
}