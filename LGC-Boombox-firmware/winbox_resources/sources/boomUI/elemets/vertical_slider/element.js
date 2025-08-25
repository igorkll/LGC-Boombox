class vertical_slider extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.style.getPropertyValue('--slider-color')) {
            this.style.setProperty('--slider-color', "63, 255, 48");
        }

        let sliderContainer = document.createElement('div');
        sliderContainer.classList.add('soap');
        sliderContainer.classList.add('crop');
        sliderContainer.style.flex = 1;
        sliderContainer.style.background = 'rgba(var(--slider-color), 0.27)';
        sliderContainer.style.margin = '2vh';
        sliderContainer.style.display = 'flex';
        sliderContainer.style.justifyContent = 'center';
        sliderContainer.style.alignItems = 'end';

        let slider = document.createElement('div');
        slider.style.background = 'rgba(var(--slider-color), 1)';
        slider.style.width = '100%';
        slider.style.height = '50%';

        sliderContainer.appendChild(slider);

        this.classList.add('soap');
        this.style.display = 'flex';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'stretch';
        this.appendChild(sliderContainer);
    }
}

customElements.define('vertical-slider', vertical_slider);