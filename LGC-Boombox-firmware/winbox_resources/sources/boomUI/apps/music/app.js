{
let media_player = document.getElementById('media_player');
let restoreState = null;

window.openAudio = function (path) {

}

window.openVideo = function (path) {
    media_player.src = toWebPath(path);
    media_player.play();
}

music_fullscreen.addEventListener("custom_click", () => {
    restoreState = fullscreenize(media_player);

    let exitListener = () => {
        restoreState();
        document.removeEventListener('pointerup', exitListener);
    };
    document.addEventListener("pointerup", exitListener);
});
}