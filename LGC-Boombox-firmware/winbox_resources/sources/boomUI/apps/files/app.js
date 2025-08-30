{
let path = require('path');

function addFilesFolder(name, path, opened=false) {
    console.log(path);
    
    let tablist = document.getElementById('files_tablist');
    let tabhost = document.getElementById('files_tabhost');

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

    addTab(tablist, tabhost, tablink, tab, opened);
}

addFilesFolder("defaults", path.join(__dirname, 'defaults'), true);
addFilesFolder("test2", "D:\\");
}