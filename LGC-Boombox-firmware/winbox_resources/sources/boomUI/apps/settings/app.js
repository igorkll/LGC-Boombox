{
const { exec } = require('child_process');

let tablist = document.getElementById('settings_tablist');
let tabhost = document.getElementById('settings_tabhost');
let defaultTab = true;

function addSettingsTab(name) {
    window.addTab(tablist, tabhost, document.getElementById(`setting_${name}_button`), document.getElementById(`setting_${name}_panel`), defaultTab);
    defaultTab = false;
}

addSettingsTab("wallpaper");
addSettingsTab("clock");
addSettingsTab("light");
addSettingsTab("debug");

// wallpaper
/*
document.getElementById('test1').addEventListener('pointerup', () => {
    window.setWallpaper("wallpapers/1.jpg");
});

document.getElementById('test2').addEventListener('pointerup', () => {
    window.setWallpaper("wallpapers/2.jpg");
});

document.getElementById('test3').addEventListener('pointerup', () => {
    window.setWallpaper("wallpapers/3.jpg");
});
*/

// debug
document.getElementById('setting_reboot_to_desktop').addEventListener('pointerup', () => {
    exec('C:\\WinboxApi\\reboot_to_desktop.bat');
});
}