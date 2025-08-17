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



document.getElementById('test1').addEventListener('click', () => {
    setWallpaper("wallpapers/1.jpg");
});

document.getElementById('test2').addEventListener('click', () => {
    setWallpaper("wallpapers/2.jpg");
});

document.getElementById('test3').addEventListener('click', () => {
    setWallpaper("wallpapers/3.jpg");
});

// event - hover
const el = document.querySelector('.element');

el.addEventListener('touchstart', () => {
  el.classList.add('hover');
}, { passive: true });

el.addEventListener('touchend', () => {
  el.classList.remove('hover');
});