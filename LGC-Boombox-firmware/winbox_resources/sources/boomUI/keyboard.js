function inputWindow(inputText, callback, title, placeholder) {
    let msgboxBackground = document.createElement('div');
    msgboxBackground.style.position = 'absolute';
    msgboxBackground.style.zIndex = '20';
    msgboxBackground.style.width = '100%';
    msgboxBackground.style.height = '100%';
    msgboxBackground.style.backdropFilter = 'blur(1vh)';
    msgboxBackground.style.backgroundColor = 'rgba(20, 20, 20, 0.2)';
    msgboxBackground.style.display = 'flex';
    msgboxBackground.style.justifyContent = 'center';
    msgboxBackground.style.alignItems = 'center';
    document.body.appendChild(msgboxBackground);

    let msgboxBody = document.createElement('div');
    msgboxBody.classList.add("soap");
    msgboxBody.style.position = 'absolute';
    msgboxBody.style.zIndex = '21';
    msgboxBody.style.width = '80%';
    msgboxBody.style.display = 'flex';
    msgboxBody.style.justifyContent = 'flex-start';
    msgboxBody.style.alignItems = 'center';
    msgboxBody.style.flexDirection = 'column';
    msgboxBody.style.padding = '1vh 1vh';
    msgboxBody.style.boxSizing = 'border-box';
    document.body.appendChild(msgboxBody);

    if (title != null) {
        let titleObject = document.createElement('div');
        titleObject.classList.add("info");
        titleObject.innerHTML = title;
        titleObject.style.margin = '1vh 1vh';
        msgboxBody.appendChild(titleObject);
    }

    let inputBlock = document.createElement('input');
    inputBlock.style.type = 'text';
    inputBlock.style.placeholder = placeholder ?? "";
    inputBlock.style.alignItems = 'center';
    inputBlock.style.flexDirection = 'row';
    inputBlock.style.width = '100%';
    inputBlock.value = inputText ?? "";
    msgboxBody.appendChild(inputBlock);

    let done = () => {
        if (callback != null) callback(inputBlock.value);
        msgboxBackground.remove();
        msgboxBody.remove();
    }

    inputBlock.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            done()
            event.preventDefault();
        }
    });

    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.flexDirection = 'row';
    buttonContainer.style.width = '100%';
    msgboxBody.appendChild(buttonContainer);

    let addButton = (text, callback) => {
        let button = document.createElement('custom-button');
        button.style.margin = '1vh 1vh';
        button.style.flex = '1';
        button.innerHTML = text;
        buttonContainer.appendChild(button);
        button.addEventListener("custom_click", callback)
    }

    addButton("done", done)
}
