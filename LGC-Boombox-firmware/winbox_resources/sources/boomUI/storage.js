let storage_version = 3;
let storage_table = {
    //base
    wallpaper: 'wallpapers/2.jpg',
    volume: 0.2,

    //light
    light_mirror: true,
    light_reverse: false,
    light_movement: true,
    light_min: 0.1,
    light_max: 1,
    light_bassLevel: 0.8
};

function storage_load() {
    let savedStorageVersion = localStorage.getItem('storageVersion');
    if (savedStorageVersion == storage_version) {
        let savedSettings = localStorage.getItem('storageSettings');
        if (savedSettings) {
            storage_table = JSON.parse(savedSettings);
        }
    }
}

function storage_save() {
    localStorage.setItem('storageSettings', JSON.stringify(storage_table));
    localStorage.setItem('storageVersion', storage_version);
}

storage_load();