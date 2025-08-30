{
const fs = require('fs');
const path = require('path');
const drivelist = require('drivelist');

let tablist = document.getElementById('files_tablist');
let tabhost = document.getElementById('files_tabhost');

let tabs = [];

function addFilesFolder(name, path, readonly=false) {
    let tablink = document.createElement('div');
    tablink.id = `${name}_tablink`;
    tablink.classList.add("tablink");
    tablink.innerHTML = name;
    tablist.appendChild(tablink);

    let tab = document.createElement('div');
    tab.id = `${name}_tab`;
    tab.classList.add("tab");
    tab.innerHTML = path;
    tabhost.appendChild(tab);

    addTab(tablist, tabhost, tablink, tab);
    tabs.push({tablink: tablink, tab: tab});
}

addFilesFolder("defaults", path.join(__dirname, 'defaults'), true);
addFilesFolder("storage", 'C:\\LGCBoombox_storage');

activateTab(tablist, tabhost, tabs[0].tablink, tabs[0].tab);

setInterval(1000, async () => {
    const drives = await drivelist.list();

    console.log(drives);

    for (const drive of drives) {
        if (drive.mountpoints.some(mp => mp.path.toUpperCase() === 'C:\\')) continue;

        for (const mount of drive.mountpoints) {
            console.log(mount);
            addFilesFolder(name, path);
        }
    }
});
}