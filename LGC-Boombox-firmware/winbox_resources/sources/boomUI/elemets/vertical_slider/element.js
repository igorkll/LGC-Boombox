class vertical_slider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        let sliderContainer = document.createElement('div');
        sliderContainer.classList.add('soap');
        sliderContainer.style.setProperty('--slider-color', 'red');
        sliderContainer.style.width = '100px';
        sliderContainer.style.height = '50px';

        this.classList.add('soap');
        this.appendChild(sliderContainer);
    }
}

customElements.define('vertical-slider', vertical_slider);