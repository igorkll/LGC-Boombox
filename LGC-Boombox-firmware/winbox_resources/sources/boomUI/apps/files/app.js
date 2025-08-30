{
const fs = require('fs');
const path = require('path');
const drivelist = require('drivelist');

let tablist = document.getElementById('files_tablist');
let tabhost = document.getElementById('files_tabhost');

let tabs = [];
let existsTabs = {};

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
    
    let obj = {tablink: tablink, tab: tab};
    tabs.push(obj);
    existsTabs[path] = obj;
    return obj;
}

if (!fs.existsSync(storage_path)) {
    fs.mkdirSync(storage_path, {recursive: true});
}

addFilesFolder("defaults", path.join(__dirname, 'defaults'), true);
addFilesFolder("storage", storage_path);

activateTab(tablist, tabhost, tabs[0].tablink, tabs[0].tab);

setInterval(async () => {
    const drives = await drivelist.list();
    for (const drive of drives) {
        if (drive.mountpoints.some(mp => mp.path.toUpperCase() === 'C:\\')) continue;

        for (const mount of drive.mountpoints) {
            if (existsTabs[mount.path] == null) {
                addFilesFolder(drive.description, mount.path);
            }
        }
    }

    for (let path in existsTabs) {
        if (!fs.existsSync(path)) {
            let obj = existsTabs[path];
            delTab(tablist, tabhost, obj.tablink, obj.tab);

            if (obj.tablink.selectedTab) {
                activateTab(tablist, tabhost, tabs[0].tablink, tabs[0].tab);
            }

            const index = tabs.indexOf(obj);
            if (index !== -1) {
                tabs.splice(index, 1);
            }
            delete existsTabs[path];
        }
    }
}, 1000);
}