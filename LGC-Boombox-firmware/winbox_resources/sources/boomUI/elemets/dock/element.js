{

let capturedElements = []
let elementsTriggerTime = []
let elementsDelay = []

function changeElementState(element, touch) {
    let uptime = performance.now();
    if (touch) {
        if (!element.classList.contains('dock-item-hover')) {
            element.classList.add('dock-item-hover');
            elementsTriggerTime[element.id] = uptime;
        }
    } else if (elementsTriggerTime[element.id] && uptime - elementsTriggerTime[element.id] > 1000) {
        element.classList.remove('dock-item-hover');
        delete elementsTriggerTime[element.id];
        delete elementsDelay[element.id];
    } else if (elementsTriggerTime[element.id]) {
        elementsDelay[element.id] = true;
    }
}

function sendTouchEvent(element) {
    element.dispatchEvent(new CustomEvent('custom_click'));
}

function checkTouchs(event, allowCapture=true) {
    capturedElements = []

    document.querySelectorAll('.dock-item').forEach(element => {
        let touch = isTouch(event, element)
        if (touch && !allowCapture) return; 
        if (touch) {
            capturedElements.push(element);
        }
        changeElementState(element, touch);
    });
}

/*
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
    element.addEventListener('pointerup', (event) => {
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
*/

document.addEventListener('touchstart', (event) => {
    checkTouchs(event);
});

document.addEventListener('touchmove', (event) => {
    checkTouchs(event, false);
});

document.addEventListener('touchend', (event) => {
    for (let i = 0; i < capturedElements.length; i++) {
        sendTouchEvent(capturedElements[i]);
    }
    checkTouchs(event);
});


document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') {
        checkTouchs(event);
    }
});

document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse') {
        checkTouchs(event);
    }
});

document.querySelectorAll('.dock-item').forEach(element => {
    element.addEventListener('click', (event) => {
        if (event.pointerType === 'mouse') {
            for (let i = 0; i < capturedElements.length; i++) {
                sendTouchEvent(capturedElements[i]);
            }
            checkTouchs(event);
        }
    });
});


setInterval(() => {
    let uptime = performance.now();
    for (let elementId in elementsDelay) {
        if (uptime - elementsTriggerTime[elementId] > 150) {
            let element = document.getElementById(elementId);
            element.classList.remove('dock-item-hover');
            delete elementsTriggerTime[element.id];
            delete elementsDelay[element.id];
        }
    }
}, 50);

}