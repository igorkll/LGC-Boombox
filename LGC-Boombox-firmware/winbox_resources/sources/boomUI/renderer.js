const body = document.body;

// wallpaper

function applyWallpaper(path) {
    body.style.backgroundImage = `url('${path}')`;
}

function setWallpaper(path) {
    applyWallpaper(path)
    localStorage.setItem('wallpaper', path);
}

applyWallpaper(localStorage.getItem('wallpaper') || "wallpapers/2.jpg");