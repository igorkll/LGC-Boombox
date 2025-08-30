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
        this.state = false;

        this._handler_down = (event) => {
            this.state = !this.state;
            this.setState(this.state);

            this.dispatchEvent(new CustomEvent('switch_change', {
                detail: this.state
            }));
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

    setState(state) {
        let buttonDot = this.shadow.getElementById("switch-dot");
        let switchBody = this.shadow.getElementById("switch-body");

        this.state = state;
        if (state) {
            buttonDot.classList.add('switch-dot-active');
            switchBody.classList.add('switch-body-active');
        } else {
            buttonDot.classList.remove('switch-dot-active');
            switchBody.classList.remove('switch-body-active');
        }
    }
}

customElements.define('custom-switch', custom_switch);
}