const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const drivelist = require('drivelist');

{ // main
    let tablist = document.getElementById('settings_tablist');
    let tabhost = document.getElementById('settings_tabhost');
    let defaultTab = true;

    function addSettingsTab(name) {
        addTab(tablist, tabhost, document.getElementById(`setting_${name}_button`), document.getElementById(`setting_${name}_panel`), defaultTab);
        defaultTab = false;
    }

    addSettingsTab("wallpaper");
    addSettingsTab("clock");
    addSettingsTab("light");
    addSettingsTab("debug");
}


{ // wallpaper
    let panel = document.getElementById('setting_wallpaper_panel');

    function addWallpaperSelector(name) {
        let path = `wallpapers/${name}.jpg`;

        let wallpaperSelector = document.createElement('div');
        wallpaperSelector.style.display = 'flex';
        wallpaperSelector.style.justifyContent = 'center';
        wallpaperSelector.style.alignItems = 'center';
        wallpaperSelector.style.width = '40vh';
        wallpaperSelector.style.height = '30vh';
        wallpaperSelector.style.padding = '2vh 2vh';
        wallpaperSelector.style.boxSizing = 'border-box';
        wallpaperSelector.style.backgroundColor = '#ffff00';

        let wallpaperPreview = document.createElement('img');
        wallpaperPreview.src = path;
        wallpaperPreview.style.width = '100%';
        wallpaperPreview.style.height = '100%';
        wallpaperPreview.style.objectFit = 'fill';

        wallpaperSelector.appendChild(wallpaperPreview);

        wallpaperSelector.addEventListener('pointerup', () => {
            setWallpaper(path);
        });

        
        panel.appendChild(wallpaperSelector);
    }

    for (let i = 1; i <= 3; i++) {
        addWallpaperSelector(`${i}`);
    }
}

{ // debug
    document.getElementById('setting_reboot_to_desktop').addEventListener('custom_click', () => {
        exec('C:\\WinboxApi\\reboot_to_desktop.bat');
    });

    document.getElementById('setting_explorer').addEventListener('custom_click', () => {
        exec('start explorer.exe');
    });

    document.getElementById('setting_cmd').addEventListener('custom_click', () => {
        exec('start cmd.exe');
    });

    document.getElementById('setting_run_script').addEventListener('custom_click', async () => {
        const drives = await drivelist.list();

        for (const drive of drives) {
            if (drive.mountpoints.some(mp => mp.path.toUpperCase() === 'C:\\')) continue;

            for (const mount of drive.mountpoints) {
                const filePath = path.join(mount.path, 'LGCBoombox.bat');

                if (fs.existsSync(filePath)) {
                    exec(`"${filePath}"`, (error, stdout, stderr) => {
                        if (error) {
                            messagebox(`Error executing batch: ${error.message}`, 'error');
                            return;
                        }
                        messagebox('Batch output:\n' + `${stdout}`);
                    });
                    return;
                }
            }
        }

        messagebox("LGCBoombox.bat was not found on any of the media", 'error');
    });
}