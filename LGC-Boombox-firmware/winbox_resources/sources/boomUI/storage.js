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
    light_bassLevel: 0.5
};

function storage_load() {
    let savedSettings = localStorage.getItem('storageSettings');
    if (savedSettings) {
        storage_table = JSON.parse(savedSettings);
    }
}

function storage_save() {
    localStorage.setItem('storageSettings', JSON.stringify(storage_table));
}

storage_load();