let capturedElements = []

function isTouchingElement(touch, element) {
    const rect = element.getBoundingClientRect();
    return (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
    );
}

function changeElementState(element, touch) {
    if (touch) {
        if (!element.classList.contains('active')) {
            element.classList.add('dock-item-hover');
        }
    } else {
        element.classList.remove('dock-item-hover');
    }
}

function sendTouchEvent(element) {
    element.dispatchEvent(new CustomEvent('custom_click'));
}

function checkTouchs(event) {
    capturedElements = []

    document.querySelectorAll('.dock-item').forEach(element => {
        let touch = false;
        for (let i = 0; i < event.touches.length; i++) {
            if (isTouchingElement(event.touches[i], element)) {
                touch = true;
                break;
            }
        }

        if (touch) {
            capturedElements.push(element);
            if (!element.classList.contains('active')) {
                element.classList.add('dock-item-hover');
            }
        } else {
            element.classList.remove('dock-item-hover');
        }
    });
}

document.addEventListener('touchstart', (event) => {
    checkTouchs(event);
});

document.addEventListener('touchmove', (event) => {
    checkTouchs(event);
});

document.addEventListener('touchend', (event) => {
    for (let i = 0; i < capturedElements.length; i++) {
        sendTouchEvent(capturedElements[i]);
    }
    checkTouchs(event);
});

document.querySelectorAll('.dock-item').forEach(element => {
    element.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse') {
            sendTouchEvent(element);
        }
    });

    element.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') {
            changeElementState(element, true);
        }
    });

    element.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'mouse') {
            changeElementState(element, false);
        }
    });
});