let storage_table = {
    wallpaper: 'wallpapers/2.jpg',
    volume: 0.2
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