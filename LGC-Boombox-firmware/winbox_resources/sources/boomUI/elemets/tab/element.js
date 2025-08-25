function addTab(tabhost, button, tab, opened=false) {
    function changeState(state) {
        for (let i = 0; i < tabhost.children.length; i++) {
            const child = tabhost.children[i];
            child.style.display = tab.id === child.id ? 'flex' : 'none';
        }
    }

    button.addEventListener('click', () => {
        changeState(true);
    });

    if (opened) {
        changeState(true);
    }

    tabhost.appendChild(tab);
}