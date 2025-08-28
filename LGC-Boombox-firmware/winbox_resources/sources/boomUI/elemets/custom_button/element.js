class custom_button extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        let resp = await fetch('elemets/custom_button/element.html');
        let html = await resp.text();

        this.shadow.innerHTML = html;

        this.pressed = false;

        this._downHandler = (event) => {
            if (window.isTouchingElement(event, this) && window.isTouchingElementLayerCheck(event, this)) {
                this.pressed = true;

                let buttonBody = this.shadow.getElementById("button-body");
                buttonBody.classList.add('button-active');
            }
        };

        this._upHandler = (event) => {
            if (this.pressed) {
                this.pressed = false;
                
                let buttonBody = this.shadow.getElementById("button-body");
                buttonBody.classList.remove('button-active');
                
                this.dispatchEvent(new CustomEvent('click'));
            }
        };

        document.addEventListener('pointerdown', this._downHandler);
        document.addEventListener('pointerup', this._upHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('pointerdown', this._downHandler);
        document.removeEventListener('pointerup', this._upHandler);
    }
}

customElements.define('custom-button', custom_button);