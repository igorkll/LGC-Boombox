{
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const drivelist = require('drivelist');
const { ipcRenderer } = require('electron');
const sudo = require('sudo-prompt');

{ // main
    let tablist = document.getElementById('settings_tablist');
    let tabhost = document.getElementById('settings_tabhost');
    let defaultTab = true;

    function addSettingsTab(name) {
        addTab(tablist, tabhost, document.getElementById(`setting_${name}_button`), document.getElementById(`setting_${name}_panel`), defaultTab);
        defaultTab = false;
    }

    addSettingsTab("wallpaper");
    addSettingsTab("syssound");
    addSettingsTab("clock");
    addSettingsTab("light");
    addSettingsTab("aux");
    addSettingsTab("debug");
}

function addSwitch(panel, name, title=null) {
    panel = "setting_" + panel;
    if (title == null) title = name;
    
    let panelElement = document.getElementById(panel + "_panel");
    let referenceNode = document.getElementById(panel + "_reference");

    const settingsLine = document.createElement('div');
    settingsLine.className = 'settings-line';

    const slider = document.createElement('custom-switch');
    slider.id = panel + "_" + name;
    slider.className = 'settings-switch';
    slider.style = "";
    settingsLine.appendChild(slider);

    const info = document.createElement('div');
    info.className = 'info';
    info.textContent = title;
    settingsLine.appendChild(info);
    
    panelElement.insertBefore(settingsLine, referenceNode);
}

function linkSwitch(updateFunctions, name) {
    let switchElement = document.getElementById(`setting_${name}`);

    switchElement.addEventListener('switch_change', (event) => {
        storage_table[name] = event.detail;
        storage_save();
    });

    let updateState = () => {
        switchElement.setState(storage_table[name]);
    }

    updateState();
    updateFunctions.push(updateState);
}

function linkSlider(updateFunctions, name, min, max) {
    let sliderElement = document.getElementById(`setting_${name}`);
    sliderElement.min = min;
    sliderElement.max = max;

    sliderElement.addEventListener('change', (event) => {
        storage_table[name] = event.detail;
        storage_save();
    });

    let updateState = () => {
        sliderElement.value = storage_table[name];
    }

    updateState();
    updateFunctions.push(updateState);
}

function updateAllFunctions(updateFunctions) {
    updateFunctions.forEach(updateState => {
        updateState();
    });
};

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

{ //date & time
    let clockTab = document.getElementById(`setting_clock_panel`);
    let fp = flatpickr("#setting_clock_calendar", {
        enableTime: true,
        inline: true,
        time_24hr: true,
        defaultDate: new Date(),
        dateFormat: "Y-m-d H:i",
    });


    clockTab.addEventListener("tab-activate", (e) => {
        getActualTimeDate((dateObj) => {
            document.documentElement.style.setProperty('--calendar-scale', (window.innerHeight / 480) * 0.8);
            fp.setDate(dateObj, true);
        });
    });

    document.getElementById('setting_clock_apply').addEventListener('custom_click', (event) => {
        const dateObj = fp.selectedDates[0];
        if (!dateObj) return;

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');

        const psCmd = `Set-Date -Date '${year}-${month}-${day} ${hours}:${minutes}:${seconds}'`;

        sudo.exec(`powershell -Command "${psCmd}"`, { name: 'ElectronApp' }, (err, stdout, stderr) => {
            if (err) {
                console.error("Error setting date/time:", err);
                return;
            }
            console.log("Date and time successfully set:", stdout);

            //updateDateTime();
            ipcRenderer.send('quit-app');
        });
    });
}

{ // light
    let updateFunctions = []

    linkSwitch(updateFunctions, "light_enabled");
    linkSwitch(updateFunctions, "light_mirror");
    linkSwitch(updateFunctions, "light_reverse");
    linkSwitch(updateFunctions, "light_deltaBassLevel");
    linkSwitch(updateFunctions, "light_bassBlink");
    linkSwitch(updateFunctions, "light_dynamicSpeed");
    linkSwitch(updateFunctions, "light_idleLight");

    linkSlider(updateFunctions, "light_moveSpeed", 0, 5);
    linkSlider(updateFunctions, "light_leds", 1, 10);
    linkSlider(updateFunctions, "light_min", 0, 1);
    linkSlider(updateFunctions, "light_max", 0, 1);
    linkSlider(updateFunctions, "light_mul", 0.5, 2);
    linkSlider(updateFunctions, "light_bassLevel", 0, 1);

    document.getElementById('setting_light_subOffset').addEventListener('custom_click', () => {
        lightOffset--;
    });
    
    document.getElementById('setting_light_resetOffset').addEventListener('custom_click', () => {
        lightOffset = 0;
    });

    document.getElementById('setting_light_addOffset').addEventListener('custom_click', () => {
        lightOffset++;
    });

    document.getElementById('setting_light_reset').addEventListener('custom_click', () => {
        storage_loadDefaults(storage_defaultsLight, true);
        updateAllFunctions(updateFunctions);
        storage_save();
    });
}

{ // aux
    let setting_aux_enabled = document.getElementById('setting_aux_enabled');
    let setting_aux_echoCancellation = document.getElementById('setting_aux_echoCancellation');
    let setting_aux_noiseSuppression = document.getElementById('setting_aux_noiseSuppression');
    let setting_aux_autoGainControl = document.getElementById('setting_aux_autoGainControl');

    setting_aux_enabled.addEventListener('switch_change', async (event) => {
        await aux_setEnabled(event.detail);
        storage_save();
    });

    setting_aux_echoCancellation.addEventListener('switch_change', async (event) => {
        await aux_setEchoCancellation(event.detail);
        storage_save();
    });

    setting_aux_noiseSuppression.addEventListener('switch_change', async (event) => {
        await aux_setNoiseSuppression(event.detail);
        storage_save();
    });

    setting_aux_autoGainControl.addEventListener('switch_change', async (event) => {
        await aux_setAutoGainControl(event.detail);
        storage_save();
    });
    
    let updateValues = async () => {
        setting_aux_enabled.setState(storage_table.aux_enabled);
        setting_aux_echoCancellation.setState(storage_table.aux_audioSettings.echoCancellation);
        setting_aux_noiseSuppression.setState(storage_table.aux_audioSettings.noiseSuppression);
        setting_aux_autoGainControl.setState(storage_table.aux_audioSettings.autoGainControl);
    };

    updateValues()

    let setting_aux_reset = document.getElementById('setting_aux_reset');
    setting_aux_reset.addEventListener('custom_click', async () => {
        storage_loadDefaults(storage_defaultsAux, true);
        storage_save();
        updateValues();
        await aux_update();
    });
}

{ // syssound
    let updateFunctions = []

    addSwitch("syssound", "wakeup");
    addSwitch("syssound", "shutdown");
    addSwitch("syssound", "usbDeviceConnected", "usb device connected");
    addSwitch("syssound", "usbDeviceDisconnected", "usb device disconnected");
    addSwitch("syssound", "bluetoothFinding", "bluetooth finding");
    addSwitch("syssound", "bluetoothConnected", "bluetooth connected");
    addSwitch("syssound", "bluetoothDisconnected", "bluetooth disconnected");

    linkSwitch(updateFunctions, "syssound_wakeup");
    linkSwitch(updateFunctions, "syssound_shutdown");
    linkSwitch(updateFunctions, "syssound_usbDeviceConnected");
    linkSwitch(updateFunctions, "syssound_usbDeviceDisconnected");
    linkSwitch(updateFunctions, "syssound_bluetoothFinding");
    linkSwitch(updateFunctions, "syssound_bluetoothConnected");
    linkSwitch(updateFunctions, "syssound_bluetoothDisconnected");

    let setting_aux_reset = document.getElementById('setting_aux_reset');
    setting_aux_reset.addEventListener('custom_click', async () => {
        storage_loadDefaults(storage_defaultsSyssound, true);
        storage_save();
        updateAllFunctions(updateFunctions);
        await aux_update();
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