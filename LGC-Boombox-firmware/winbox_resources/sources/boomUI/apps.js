{
let defaultApp = 'visualization';

let appslist = document.getElementById('appslist');
let appscontainer = document.getElementById('appscontainer');

function openApp(name) {
    for (let i = 0; i < appscontainer.children.length; i++) {
        const child = appscontainer.children[i];
        child.style.display = `${name}_container` === child.id ? 'flex' : 'none';
    }

    for (let i = 0; i < appslist.children.length; i++) {
        const child = appslist.children[i];
        if (`${name}_icon` === child.id) {
            if (!child.classList.contains('dock-item-active')) {
                child.classList.add('dock-item-active');
            }
        } else {
            child.classList.remove('dock-item-active');
        }
    }
}

function addApp(name) {
    let appIcon = document.createElement('img');
    appIcon.id = `${name}_icon`;
    appIcon.src = `apps/${name}/icon.png`;
    appIcon.classList.add('dock-item');
    appIcon.addEventListener('custom_click', () => {
        openApp(name);
    })
    appslist.appendChild(appIcon);

    fetch(`apps/${name}/app.html`)
        .then(response => response.text())
        .then(html => {
            let appContainer = document.createElement('div');
            appContainer.id = `${name}_container`;
            appContainer.classList.add('app');
            appContainer.innerHTML += html;
            appContainer.style.display = 'none';
            appscontainer.appendChild(appContainer);

            const script = document.createElement('script');
            script.src = `apps/${name}/app.js`;
            script.type = 'text/javascript';
            script.onload = () => {};
            script.onerror = () => console.error(`failed to load "${name}" script`);
            document.head.appendChild(script);

            if (name === defaultApp) {
                openApp(name);
            }
        })
        .catch(err => console.error(err));
}

addApp("files");
addApp("visualization");
addApp("settings");
}