function activateTab(tablist, tabhost, button, tab) {
    if (tablist.currnetTab != null) {
        let event = new CustomEvent("tab-deactivate", {
            cancelable: true
        });
        tablist.currnetTab.dispatchEvent(event);
        tablist.currnetTab = null;
    }

    for (let i = 0; i < tabhost.children.length; i++) {
        const child = tabhost.children[i];
        child.style.display = tab.id === child.id ? 'flex' : 'none';
    }

    for (let i = 0; i < tablist.children.length; i++) {
        const child = tablist.children[i];
        if (button.id === child.id) {
            child.classList.add('tablink-selected');
            child.selectedTab = true;
        } else {
            child.classList.remove('tablink-selected');
            child.selectedTab = false;
        }
    }

    let event = new CustomEvent("tab-activate", {
        cancelable: true
    });
    tab.dispatchEvent(event);

    tablist.currnetTab = tab;
}

function addTab(tablist, tabhost, button, tab, opened=false) {
    button.classList.remove('tablink-selected');
    button.selectedTab = false;
    tab.style.display = 'none';

    let tablinkPressed = false;

    button.addEventListener('pointerdown', () => {
        tablinkPressed = true;
    });

    button._pointerUpHandle = (event) => {
        if (!tablinkPressed) return;
        tablinkPressed = false;
        if (isTouchingElementWithLayerCheck(event, button)) {
            activateTab(tablist, tabhost, button, tab);
        }
    };

    document.addEventListener('pointerup', button._pointerUpHandle);

    if (opened) {
        activateTab(tablist, tabhost, button, tab);
    }

    tabhost.appendChild(tab);
}

function delTab(tablist, tabhost, button, tab) {
    document.removeEventListener('pointerup', button._pointerUpHandle);

    button.remove();
    tab.remove();
}