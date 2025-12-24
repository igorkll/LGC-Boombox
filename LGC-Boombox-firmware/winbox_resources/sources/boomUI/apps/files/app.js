{
const fs = require('fs');
const path = require('path');
const drivelist = require('drivelist');
const usb = require('usb');

let tablist = document.getElementById('files_tablist');
let tabhost = document.getElementById('files_tabhost');

let tabs = [];
let existsTabs = {};
let searchFilter = "";

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
    namelabel.classList.add("text-cropping");
    namelabel.style.textAlign = 'left';
    namelabel.innerHTML = name;
    infocontainer.appendChild(namelabel);

    let pathlabel = document.createElement('div');
    pathlabel.classList.add("panel");
    pathlabel.classList.add("mini-info");
    pathlabel.classList.add("text-cropping");
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

    let addToolButton = (iconPath, callback) => {
        let button = document.createElement('custom-button');
        button.style.aspectRatio = '1 / 1';
        button.style.height = '10vh';
        button.setAttribute('_style', 'border-radius: 0vh; border: 0.5vh solid #4b4b4b43;');
        toolcontainer.appendChild(button);

        let imageContainer = document.createElement('div');
        imageContainer.classList.add("button-content");
        button.appendChild(imageContainer);

        let image = document.createElement('img');
        image.classList.add("button-image");
        image.src = iconPath;
        imageContainer.appendChild(image);

        button.addEventListener('custom_click', () => {
            callback(button);
        });
    };

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
            for (let fileName of sortedFiles) {
                if (fileName.includes(searchFilter)) {
                    let fullPath = path.join(currentPath, fileName);

                    let element = document.createElement('div');
                    element.classList.add("panel");
                    element.classList.add("mini-info");
                    element.classList.add("text-cropping");
                    element.style.textAlign = 'left';
                    element.style.alignSelf = 'stretch';
                    element.style.backgroundColor = 'rgba(35, 35, 35, 0.1)';
                    element.innerHTML = getFileName(fileName);
                    filescontainer.appendChild(element);

                    element.addEventListener('pointerup', async () => {
                        fs.stat(fullPath, (err, stats) => {
                            if (err) return;
                            if (stats.isFile()) {
                                openMedia(fullPath, (successfully) => {
                                    if (successfully) {
                                        openApp('music');
                                    }
                                });
                            } else if (stats.isDirectory()) {
                                currentPath = path.join(currentPath, fileName);
                                refresh();
                            }
                        });
                    })
                }
            }
        });
    };

    refresh();

    // ---------------- tool buttons

    addToolButton('apps/files/upfolder.png', () => {
        let oldPath = currentPath;
        currentPath = path.dirname(currentPath);

        let relative = path.relative(defaultPath, currentPath);
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
            currentPath = oldPath;
            return;
        }

        if (path.normalize(currentPath) != path.normalize(oldPath)) {
            refresh();
        }
    });

    addToolButton('apps/files/search.png', () => {
        inputWindow(searchFilter, (_search) => {
            searchFilter = _search;
            refresh()
        }, "search")
    });
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

usb.usb.on('attach', async function(device) {
    playSystemSound("connect");
    await asyncWait(200);
    updateDrives();
});

usb.usb.on('detach', function(device) {
    playSystemSound("disconnect");
    updateDrives();
});

// -------------------------

if (!fs.existsSync(storage_path)) {
    fs.mkdirSync(storage_path, {recursive: true});
}

addFolder("defaults", path.join(__dirname, 'defaults'), true);
addFolder("storage", storage_path);

activateTab(tablist, tabhost, tabs[0].tablink, tabs[0].tab);
}