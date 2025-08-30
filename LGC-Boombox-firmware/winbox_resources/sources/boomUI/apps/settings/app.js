{
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const drivelist = require('drivelist');
const { ipcRenderer } = require('electron');

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
    let oldSelected;

    let defaultBorder = '1vh solid #0000006b';
    let highlightBorder = '1vh solid #f6ff00bd';

    function addWallpaperSelector(name) {
        let path = `wallpapers/${name}.jpg`;

        let wallpaperSelector = document.createElement('img');
        wallpaperSelector.style.width = '45%';
        wallpaperSelector.style.aspectRatio = `${window.innerWidth} / ${window.innerHeight}`;
        wallpaperSelector.style.boxSizing = 'border-box';
        wallpaperSelector.style.objectFit = 'fill';
        wallpaperSelector.style.border = defaultBorder;
        wallpaperSelector.src = path;
        wallpaperSelector.classList.add("settings-item");
        
        let updateSelector = () => {
            let state = path === storage_table.wallpaper;
            wallpaperSelector.style.border = state ? highlightBorder : defaultBorder;
            if (state) {
                oldSelected = wallpaperSelector;
            }
        };

        wallpaperSelector.addEventListener('pointerup', () => {
            oldSelected.style.border = defaultBorder;
            setWallpaper(path);
            updateSelector();
        });
        
        panel.appendChild(wallpaperSelector);

        updateSelector();
    }

    for (let i = 1; i <= 37; i++) {
        addWallpaperSelector(i);
    }
}

{ // light
    let setting_light_enabled = document.getElementById('setting_light_enabled');
    let setting_light_mirror = document.getElementById('setting_light_mirror');
    let setting_light_reverse = document.getElementById('setting_light_reverse');

    setting_light_enabled.addEventListener('switch_change', (event) => {
        storage_table.light_enabled = event.detail;
        storage_save();
    });

    setting_light_mirror.addEventListener('switch_change', (event) => {
        storage_table.light_mirror = event.detail;
        storage_save();
    });

    setting_light_reverse.addEventListener('switch_change', (event) => {
        storage_table.light_reverse = event.detail;
        storage_save();
    });

    let setting_light_moveSpeed = document.getElementById('setting_light_moveSpeed');
    let setting_light_leds = document.getElementById('setting_light_leds');
    let setting_light_min = document.getElementById('setting_light_min');
    let setting_light_max = document.getElementById('setting_light_max');
    let setting_light_mul = document.getElementById('setting_light_mul');
    let setting_light_bassLevel = document.getElementById('setting_light_bassLevel');

    setting_light_moveSpeed.max = 5;
    setting_light_moveSpeed.addEventListener('change', (event) => {
        storage_table.light_moveSpeed = event.detail;
        storage_save();
    });

    setting_light_leds.min = 1;
    setting_light_leds.max = 20;
    setting_light_leds.addEventListener('change', (event) => {
        storage_table.light_leds = Math.round(event.detail);
        console.log(storage_table.light_leds);
        storage_save();
    });

    
    setting_light_min.addEventListener('change', (event) => {
        storage_table.light_min = event.detail;
        storage_save();
    });

    setting_light_max.addEventListener('change', (event) => {
        storage_table.light_max = event.detail;
        storage_save();
    });

    setting_light_mul.min = 0.5;
    setting_light_mul.max = 2;
    setting_light_mul.addEventListener('change', (event) => {
        storage_table.light_mul = event.detail;
        storage_save();
    });

    setting_light_bassLevel.addEventListener('change', (event) => {
        storage_table.light_bassLevel = event.detail;
        storage_save();
    });

    let updateValues = () => {
        setting_light_enabled.setState(storage_table.light_enabled);
        setting_light_mirror.setState(storage_table.light_mirror);
        setting_light_reverse.setState(storage_table.light_reverse);
        
        setting_light_moveSpeed.value = storage_table.light_moveSpeed;
        setting_light_leds.value = storage_table.light_leds;
        setting_light_min.value = storage_table.light_min;
        setting_light_max.value = storage_table.light_max;
        setting_light_mul.value = storage_table.light_mul;
        setting_light_bassLevel.value = storage_table.light_bassLevel;
    };

    updateValues();

    let setting_light_reset = document.getElementById('setting_light_reset');
    setting_light_reset.addEventListener('custom_click', () => {
        storage_loadDefaults(storage_defaultsLight, true);
        updateValues();
        storage_save();
    });
}

{ // debug
    document.getElementById('setting_reboot_to_desktop').addEventListener('custom_click', () => {
        exec('C:\\WinboxApi\\reboot_to_desktop.bat');
    });

    document.getElementById('setting_explorer').addEventListener('custom_click', () => {
        exec('start "" /max explorer.exe');
    });

    document.getElementById('setting_cmd').addEventListener('custom_click', () => {
        exec('start "" /max cmd.exe');
    });

    document.getElementById('setting_run_script').addEventListener('custom_click', async () => {
        const drives = await drivelist.list();

        for (const drive of drives) {
            if (drive.mountpoints.some(mp => mp.path.toUpperCase() === 'C:\\')) continue;

            for (const mount of drive.mountpoints) {
                const filePath = path.join(mount.path, 'LGCBoombox', 'LGCBoombox.bat');

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

        messagebox("/LGCBoombox/LGCBoombox.bat was not found on any of the media", 'error');
    });

    document.getElementById('setting_quit').addEventListener('custom_click', async () => {
        ipcRenderer.send('quit-app');
    });
}
}