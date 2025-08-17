let dockContainer = document.getElementById('dock');

function addApp(name) {
    let appIcon = document.createElement('img');
    appIcon.id = `${name}_icon`;
    appIcon.src = `apps/${name}/icon.png`;
    appIcon.classList.add('dock-item');
    dockContainer.appendChild(appIcon);
}

addApp("settings")
addApp("music")