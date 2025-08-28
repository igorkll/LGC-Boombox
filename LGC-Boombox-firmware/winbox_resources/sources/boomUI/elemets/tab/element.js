function addTab(tablist, tabhost, button, tab, opened=false) {
    function changeState(state) {
        for (let i = 0; i < tabhost.children.length; i++) {
            const child = tabhost.children[i];
            child.style.display = tab.id === child.id ? 'flex' : 'none';
        }

        for (let i = 0; i < tablist.children.length; i++) {
            const child = tablist.children[i];
            if (button.id === child.id) {
                if (!child.classList.contains('tablink-selected')) {
                    child.classList.add('tablink-selected');
                }
            } else {
                child.classList.remove('tablink-selected');
            }
        }
    }

    let tablinkPressed = false;

    button.addEventListener('pointerdown', () => {
        tablinkPressed = true;
    });

    document.addEventListener('pointerup', (event) => {
        if (!tablinkPressed) return;
        tablinkPressed = false;
        if (window.isTouchingElement(event, button) && window.isTouchingElementLayerCheck(event, button)) {
            changeState(true);
        }
    });

    if (opened) {
        changeState(true);
    }

    tabhost.appendChild(tab);
}