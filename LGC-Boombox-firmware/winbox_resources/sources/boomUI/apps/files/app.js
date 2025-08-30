{
function addFilesFolder(name, path) {
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
    tab.innerHTML = name;
    tabhost.appendChild(tab);

    addTab(tablist, tabhost, tablink, tab, false);
}

addFilesFolder("test", "C:\\");
addFilesFolder("test2", "D:\\");
}