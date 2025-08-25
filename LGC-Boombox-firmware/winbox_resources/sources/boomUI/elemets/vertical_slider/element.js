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

        this._slider = document.createElement('div');
        this._slider.style.background = 'rgba(var(--slider-color), 1)';
        this._slider.style.width = '100%';

        sliderContainer.appendChild(this._slider);

        this.classList.add('soap');
        this.style.display = 'flex';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'stretch';
        this.appendChild(sliderContainer);

        let value = this.style.getPropertyValue('--slider-value');
        if (value) {
            this.value = value;
        } else {
            this.value = 0.5;
        }

        let isDragging = false;

        this._updateSlider = (y) => {
            const rect = sliderContainer.getBoundingClientRect();
            let relativeY = rect.bottom - y;
            relativeY = Math.max(0, Math.min(relativeY, rect.height));
            const percent = relativeY / rect.height;

            this.value = percent;
            this.dispatchEvent(new CustomEvent('change', { detail: this._value }));
        }

        this._mouseMoveHandler = (event) => {
            if (this.isDragging) {
                console.log(event.clientY);
                this._updateSlider(event.clientY);
            }
        };

        this._mouseUpHandler = () => {
            this.isDragging = false;
        };

        sliderContainer.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this._updateSlider(e.clientY);
        });

        //document.addEventListener('mousemove', this._mouseMoveHandler);
        document.addEventListener('touchmove', this._mouseMoveHandler);
        document.addEventListener('mouseup', this._mouseUpHandler);
    }

    disconnectedCallback() {
        //document.removeEventListener('mousemove', this._mouseMoveHandler);
        document.removeEventListener('touchmove', this._mouseMoveHandler);
        document.removeEventListener('mouseup', this._mouseUpHandler);
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = Math.max(0, Math.min(1, v));
        this._slider.style.height = `${this._value * 100}%`;
    }
}

customElements.define('vertical-slider', vertical_slider);