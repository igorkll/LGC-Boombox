function isTouchingElement(touch, element) {
    const rect = element.getBoundingClientRect();
    return (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
    );
}

{
const { exec } = require('child_process');

// wallpaper

window.setWallpaper = function(path) {
    document.body.style.backgroundImage = `url('${path}')`;
    localStorage.setItem('wallpaper', path);
}

window.getWallpaper = function() {
    return localStorage.getItem('wallpaper');
}

setWallpaper(localStorage.getItem('wallpaper') || "wallpapers/2.jpg");

// volume
let max_volume = 65535 * volume_multiplier;
let current_volume;

window.setVolume = function(volume) {
    exec(`nircmd setsysvolume ${Math.round(volume * max_volume)}`);
    current_volume = volume;
    localStorage.setItem('volume', volume);
}

window.getVolume = function() {
    return current_volume;
}

setVolume(localStorage.getItem('volume') || 0.2);
}