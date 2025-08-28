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

        this._handler_down = (event) => {
            this.pressed = true;

            let buttonBody = this.shadow.getElementById("button-body");
            buttonBody.classList.add('button-active');
        };

        this._handler_up = (event) => {
            if (this.pressed) {
                this.pressed = false;

                let buttonBody = this.shadow.getElementById("button-body");
                buttonBody.classList.remove('button-active');
                
                if (isTouch(event, this)) {
                    this.dispatchEvent(new CustomEvent('click'));
                }
            }
        };

        this.addEventListener('pointerdown', this._handler_down);
        document.addEventListener('pointerup', this._handler_up);
        document.addEventListener('touchend', this._handler_up);
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this._handler_down);
        document.removeEventListener('pointerup', this._handler_up);
        document.removeEventListener('touchend', this._handler_up);
    }
}

customElements.define('custom-button', custom_button);
}