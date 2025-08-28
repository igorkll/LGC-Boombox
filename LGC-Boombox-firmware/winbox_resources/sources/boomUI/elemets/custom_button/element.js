{
let htmlPromise = fetch('elemets/custom_button/element.html').then(r => r.text());

class custom_button extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        let html = await htmlPromise;
        if (!this.isConnected) return;

        this.shadow.innerHTML = html;

        this.pressed = false;

        this._handler_touchstart = (event) => {
            if (isTouch(event, this)) {
                this.pressed = true;

                let buttonBody = this.shadow.getElementById("button-body");
                buttonBody.classList.add('button-active');
            }
        };

        this._handler_touchend = (event) => {
            if (this.pressed) {
                this.pressed = false;

                let buttonBody = this.shadow.getElementById("button-body");
                buttonBody.classList.remove('button-active');
                
                if (isTouch(event, this)) {
                    this.dispatchEvent(new CustomEvent('click'));
                }
            }
        };

        document.addEventListener('touchstart', this._handler_touchstart);
        document.addEventListener('touchend', this._handler_touchend);
    }

    disconnectedCallback() {
        document.removeEventListener('touchstart', this._handler_touchstart);
        document.removeEventListener('touchend', this._handler_touchend);
    }
}

customElements.define('custom-button', custom_button);
}