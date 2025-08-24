class vertical_slider extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('soap');
    }
}

customElements.define('vertical-slider', vertical_slider);