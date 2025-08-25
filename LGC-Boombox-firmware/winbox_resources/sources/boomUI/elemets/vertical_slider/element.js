class vertical_slider extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let sliderContainer = document.createElement('div');
        sliderContainer.classList.add('soap');
        sliderContainer.style.setProperty('--slider-color', "#8cd70bff");
        sliderContainer.style.flex = 1;
        sliderContainer.style.background = 'var(--slider-color)';
        sliderContainer.style.margin = '2vh';

        this.classList.add('soap');
        this.style.display = 'flex';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'stretch';
        this.appendChild(sliderContainer);
    }
}

customElements.define('vertical-slider', vertical_slider);