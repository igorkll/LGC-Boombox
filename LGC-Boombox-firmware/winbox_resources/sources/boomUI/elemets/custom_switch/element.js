{
let htmlPromise = fetch('elemets/custom_switch/element.html').then(r => r.text());

class custom_switch extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.state = false;
    }

    async connectedCallback() {
        let html = await htmlPromise;
        if (!this.isConnected) return;

        this.shadow.innerHTML = html;
        
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

        let firstStateLoaded = false;
        let switchBody = this.shadow.getElementById("switch-body");
        this.resizeObserver = new ResizeObserver(entries => {
            let switchBody = this.shadow.getElementById("switch-body");
            if (switchBody.clientWidth > 0) {
                if (!firstStateLoaded) this.setState(this.state);
                firstStateLoaded = true;

                setTimeout(() => {
                    let buttonDot = this.shadow.getElementById("switch-dot");
                    switchBody.classList.add('switch-body-allow-animation');
                    buttonDot.classList.add('switch-dot-allow-animation');
                }, 0);
            }
        });
        this.resizeObserver.observe(switchBody);
    }

    disconnectedCallback() {
        this.removeEventListener('pointerdown', this._handler_down);
    }

    setState(state) {
        htmlPromise.then(_ => {
            let switchBody = this.shadow.getElementById("switch-body");
            let buttonDot = this.shadow.getElementById("switch-dot");

            this.state = state;
            if (state) {
                buttonDot.style.transform = `translate(${switchBody.clientWidth - buttonDot.clientWidth}px)`;
                switchBody.classList.add('switch-body-active');
            } else {
                buttonDot.style.transform = null;
                switchBody.classList.remove('switch-body-active');
            }
        });
    }
}

customElements.define('custom-switch', custom_switch);
}