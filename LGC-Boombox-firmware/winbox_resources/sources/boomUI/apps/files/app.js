{
const fs = require('fs');
const path = require('path');
const drivelist = require('drivelist');

let tablist = document.getElementById('files_tablist');
let tabhost = document.getElementById('files_tabhost');

let tabs = [];
let existsTabs = {};

function getFileName(filePath) {
    return path.basename(filePath, path.extname(filePath));
}

function addFolderUi(tab, name, defaultPath) {
    let currentPath = defaultPath;

    // ---------------- info

    let infocontainer = document.createElement('div');
    infocontainer.style.width = '100%';
    infocontainer.style.display = 'flex';
    infocontainer.style.justifyContent = 'start';
    infocontainer.style.alignItems = 'start';
    tab.appendChild(infocontainer);

    let namelabel = document.createElement('div');
    namelabel.classList.add("panel");
    namelabel.classList.add("mini-info");
    namelabel.style.textAlign = 'left';
    namelabel.innerHTML = name;
    infocontainer.appendChild(namelabel);

    let pathlabel = document.createElement('div');
    pathlabel.classList.add("panel");
    pathlabel.classList.add("mini-info");
    pathlabel.style.textAlign = 'left';
    pathlabel.style.flex = '1';
    infocontainer.appendChild(pathlabel);

    // ---------------- tool

    let toolcontainer = document.createElement('div');
    toolcontainer.classList.add("panel");
    toolcontainer.style.width = '100%';
    toolcontainer.style.height = '10vh';
    toolcontainer.style.display = 'flex';
    toolcontainer.style.justifyContent = 'start';
    toolcontainer.style.alignItems = 'start';
    toolcontainer.style.padding = '0px';
    tab.appendChild(toolcontainer);

    let addToolButton = (path) => {
        let button = document.createElement('custom-button');
        button.style.aspectRatio = '1 / 1';
        button.style.height = '10vh';
        toolcontainer.appendChild(button);

        let imageContainer = document.createElement('img');
        imageContainer.classList.add("button-content");
        button.appendChild(imageContainer);

        let image = document.createElement('img');
        image.classList.add("button-image");
        image.src = path;
        imageContainer.appendChild(image);
    };

    addToolButton('apps/files/upfolder.png');

    // ---------------- files
    let filescontainer = document.createElement('div');
    filescontainer.classList.add("scrollable");
    filescontainer.style.width = '100%';
    filescontainer.style.display = 'flex';
    filescontainer.style.justifyContent = 'start';
    filescontainer.style.alignItems = 'streetch';
    filescontainer.style.flexDirection = 'column';
    tab.appendChild(filescontainer);

    let refresh = () => {
        pathlabel.innerHTML = '/' + path.relative(defaultPath, currentPath).replace(/\\/g, '/');

        filescontainer.replaceChildren();
        fs.readdir(currentPath, (err, files) => {
            if (err) files = [];
            const sortedFiles = files.sort();
            for (let obj of sortedFiles) {
                let fullPath = path.join(currentPath, obj);

                let element = document.createElement('div');
                element.classList.add("panel");
                element.classList.add("mini-info");
                element.style.textAlign = 'left';
                element.style.alignSelf = 'stretch';
                element.style.backgroundColor = 'rgba(35, 35, 35, 0.1)';
                element.innerHTML = getFileName(obj);
                filescontainer.appendChild(element);

                element.addEventListener('pointerup', async () => {
                    fs.stat(fullPath, (err, stats) => {
                        if (err) return;
                        if (stats.isFile()) {
                            openMedia(fullPath);
                        } else if (stats.isDirectory()) {
                            currentPath = path.join(currentPath, obj);
                            refresh();
                        }
                    });
                })
            }
        });
    };

    refresh();
}

function addFolder(name, defaultPath, readonly=false) {
    let tablink = document.createElement('div');
    tablink.id = `${name}_tablink`;
    tablink.classList.add("tablink");
    tablink.innerHTML = name;
    tablist.appendChild(tablink);

    let tab = document.createElement('div');
    tab.id = `${name}_tab`;
    tab.classList.add("tab");
    tab.style.flexDirection = 'column';
    addFolderUi(tab, name, defaultPath);
    tabhost.appendChild(tab);

    addTab(tablist, tabhost, tablink, tab);
    
    let obj = {tablink: tablink, tab: tab};
    tabs.push(obj);
    existsTabs[defaultPath] = obj;
    return obj;
}

let updateDrives = async () => {
    const drives = await drivelist.list();
    for (const drive of drives) {
        if (drive.mountpoints.some(mp => mp.path.toUpperCase() === 'C:\\')) continue;

        for (const mount of drive.mountpoints) {
            if (existsTabs[mount.path] == null) {
                addFolder(drive.description, mount.path);
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
};

updateDrives();
setInterval(updateDrives, 1000);

// -------------------------

if (!fs.existsSync(storage_path)) {
    fs.mkdirSync(storage_path, {recursive: true});
}

addFolder("defaults", path.join(__dirname, 'defaults'), true);
addFolder("storage", storage_path);

activateTab(tablist, tabhost, tabs[0].tablink, tabs[0].tab);
}