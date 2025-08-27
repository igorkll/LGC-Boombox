let storage_version = 0;

let storage_default = {
    //base
    wallpaper: 'wallpapers/2.jpg',
    volume: 0.2,

    //light
    light_mirror: true,
    light_reverse: false,
    light_movement: true,
    light_min: 0.1,
    light_max: 0.5,
    light_mul: 1.2,
    light_bassLevel: 0.6
};

let storage_table = structuredClone(storage_default);

function storage_load() {
    let savedStorageVersion = localStorage.getItem('storageVersion');
    if (savedStorageVersion == storage_version) {
        let savedSettings = localStorage.getItem('storageSettings');
        if (savedSettings) {
            storage_table = JSON.parse(savedSettings);

            for (let key in storage_default) {
                if (!storage_table.hasOwnProperty(key)) {
                    storage_table[key] = storage_default[key];
                }
            }
        }
    }
}

function storage_save() {
    localStorage.setItem('storageSettings', JSON.stringify(storage_table));
    localStorage.setItem('storageVersion', storage_version);
}

storage_load();