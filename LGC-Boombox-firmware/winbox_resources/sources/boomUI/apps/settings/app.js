{
let tabhost = document.getElementById('settings_tabhost');
let defaultTab = true;

function addSettingsTab(name) {
    window.addTab(tabhost, document.getElementById(`setting_${name}_button`), document.getElementById(`setting_${name}_panel`), defaultTab);
    defaultTab = false;
}

addSettingsTab("wallpaper");
addSettingsTab("clock");
addSettingsTab("light");
addSettingsTab("debug");

// wallpaper
document.getElementById('test1').addEventListener('click', () => {
    window.setWallpaper("wallpapers/1.jpg");
});

document.getElementById('test2').addEventListener('click', () => {
    window.setWallpaper("wallpapers/2.jpg");
});

document.getElementById('test3').addEventListener('click', () => {
    window.setWallpaper("wallpapers/3.jpg");
});
}