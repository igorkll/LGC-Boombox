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

    let inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.justifyContent = 'space-evenly';
    inputContainer.style.alignItems = 'center';
    inputContainer.style.flexDirection = 'row';
    inputContainer.style.width = '100%';
    msgboxBody.appendChild(inputContainer);

    let inputBlock
    let clearButton = document.createElement('custom-button');
    clearButton.style.margin = '1vh 1vh';
    clearButton.style.flex = '1';
    clearButton.style.height = '100%';
    clearButton.innerHTML = "X";
    inputContainer.appendChild(clearButton);
    clearButton.addEventListener("custom_click", () => {
        inputBlock.value = "";
    })

    inputBlock = document.createElement('input');
    inputBlock.style.type = 'text';
    inputBlock.style.placeholder = placeholder ?? "";
    inputBlock.style.flex = '1';
    inputBlock.value = inputText ?? "";
    inputBlock.addEventListener("blur", () => {
        inputBlock.focus();
    });
    inputContainer.appendChild(inputBlock);
    inputBlock.focus();

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
