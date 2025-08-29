{
let htmlPromise = fetch('elemets/custom_switch/element.html').then(r => r.text());

class custom_switch extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        let html = await htmlPromise;
        if (!this.isConnected) return;

        this.shadow.innerHTML = html;

        this._handler_down = (event) => {
            let buttonDot = this.shadow.getElementById("switch-dot");
            buttonDot.classList.add('switch-dot-active');
        };

        this.addEventListener('pointerdown', this._handler_down);

        if (this.hasAttribute("_style")) {
            let switchBody = this.shadow.getElementById("switch-body");
            switchBody.style.cssText = this.getAttribute("_style");
        }
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this._handler_down);
    }
}

customElements.define('custom-switch', custom_switch);
}