class custom_button extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const resp = await fetch('elemets/custom_button/element.html');
        const html = await resp.text();

        this.shadow.innerHTML = html;
    }

    disconnectedCallback() {
        
    }
}

customElements.define('custom-button', custom_button);