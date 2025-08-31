{
let media_player = document.getElementById('media_player');
let media_panel = document.getElementById('media_panel');

let restoreState = null;

window.openAudio = function (path) {

}

window.openVideo = function (path) {
    media_player.src = toWebPath(path);
    media_player.play();
}

music_fullscreen.addEventListener("custom_click", () => {
    if (restoreState != null) {
        restoreState();
        restoreState = null;
        return;
    }
    restoreState = fullscreenize(media_panel);
});
}