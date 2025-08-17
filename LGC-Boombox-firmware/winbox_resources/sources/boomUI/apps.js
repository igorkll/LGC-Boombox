let appslist = document.getElementById('appslist');
let appscontainer = document.getElementById('appscontainer');

function openApp(name) {

}

function addApp(name) {
    let appIcon = document.createElement('img');
    appIcon.id = `${name}_icon`;
    appIcon.src = `apps/${name}/icon.png`;
    appIcon.classList.add('dock-item');
    appslist.appendChild(appIcon);

    fetch(`apps/${name}/app.html`)
        .then(response => response.text())
        .then(html => {
            let appContainer = document.createElement('div');
            appContainer.id = `${name}_container`;
            appContainer.classList.add('app');
            appContainer.innerHTML += html;
            appscontainer.appendChild(appContainer);
        })
        .catch(err => console.error(err));

    const script = document.createElement('script');
    script.src = `apps/${name}/app.js`;
    script.type = 'text/javascript';
    script.onload = () => {};
    script.onerror = () => console.error(`failed to load "${name}" script`);
    document.head.appendChild(script);
}

addApp("settings")
addApp("music")