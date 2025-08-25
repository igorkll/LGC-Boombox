class vertical_slider extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let sliderContainer = document.createElement('div');
        sliderContainer.classList.add('soap');
        sliderContainer.style.setProperty('--slider-color', "#8cd70b44");
        sliderContainer.style.flex = 1;
        sliderContainer.style.background = 'var(--slider-color)';
        sliderContainer.style.margin = '2vh';

        let slider = document.createElement('div');
        slider.style.setProperty('--slider-color', "#8cd70bff");
        slider.style.background = 'var(--slider-color)';

        this.classList.add('soap');
        this.style.display = 'flex';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'stretch';
        this.appendChild(sliderContainer);
    }
}

customElements.define('vertical-slider', vertical_slider);