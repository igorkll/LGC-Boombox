let storage_version = 0;

let storage_defaults = {
    wallpaper: 'wallpapers/1.jpg',
    volume: 0.5,
};

let storage_defaultsLight = {
    light_enabled: true,
    light_mirror: true,
    light_reverse: true,
    light_deltaBassLevel: true,
    light_moveSpeed: 1,
    light_leds: 3,
    light_min: 0.05,
    light_max: 1,
    light_mul: 1.2,
    light_bassLevel: 0.2
};

let storage_defaultsAux = {
    aux_enabled: true
};

let storage_table = {};

function storage_loadDefaults(defaults, force=false) {
    for (let key in defaults) {
        if (force || !storage_table.hasOwnProperty(key)) {
            storage_table[key] = defaults[key];
        }
    }
}

function storage_load() {
    storage_table = {};
    
    let savedStorageVersion = localStorage.getItem('storageVersion');
    if (savedStorageVersion == storage_version) {
        let savedSettings = localStorage.getItem('storageSettings');
        if (savedSettings) {
            storage_table = JSON.parse(savedSettings);
        }
    }

    storage_loadDefaults(storage_defaults);
    storage_loadDefaults(storage_defaultsLight);
    storage_loadDefaults(storage_defaultsAux);
}

function storage_save() {
    localStorage.setItem('storageSettings', JSON.stringify(storage_table));
    localStorage.setItem('storageVersion', storage_version);
}

storage_load();