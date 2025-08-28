class custom_slider extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.style.getPropertyValue('--slider-color')) {
            this.style.setProperty('--slider-color', "63, 255, 48");
        }

        this._vertical = this.style.getPropertyValue('--slider-vertical');

        this._slider = document.createElement('div');
        this._slider.style.background = 'rgba(var(--slider-color), 1)';
        this._slider.style.height = '100%';
        this._slider.style.width = '100%';

        this.classList.add('soap');
        this.classList.add('crop');
        this.style.background = 'rgba(var(--slider-color), 0.27)';
        this.style.display = 'flex';
        if (this._vertical) {
            this.style.justifyContent = 'center';
            this.style.alignItems = 'end';
        } else {
            this.style.justifyContent = 'left';
            this.style.alignItems = 'center';
        }
        this.appendChild(this._slider);

        let value = this.style.getPropertyValue('--slider-value');
        if (value) {
            this.value = value;
        } else {
            this.value = 0.5;
        }

        // process
        this._updateSlider = (x, y) => {
            const rect = this.getBoundingClientRect();
            let percent;
            if (this._vertical) {
                let relativeY = rect.bottom - y;
                relativeY = Math.max(0, Math.min(relativeY, rect.height));
                percent = relativeY / rect.height;
            } else {
                let relativeX = rect.width - (rect.right - x);
                relativeX = Math.max(0, Math.min(relativeX, rect.width));
                percent = relativeX / rect.width;
            }

            this.value = percent;
            this.dispatchEvent(new CustomEvent('change', { detail: this._value }));
        }

        this._mouseMoveHandler = (event) => {
            if (this.isDragging) {
                this._updateSlider(event.clientX, event.clientY);
            }
        };

        this._touchMoveHandler = (event) => {
            if (this.isDragging) {
                for (let i = 0; i < event.touches.length; i++) {
                    this._updateSlider(event.touches[i].clientX, event.touches[i].clientY);
                }
            }
        };

        this._downHandler = (event) => {
            if (window.isTouchingElement(event, this) && window.isTouchingElementLayerCheck(event, this)) {
                this.isDragging = true;
                this._updateSlider(event.clientX, event.clientY);
            } else {
                this.dispatchEvent(new CustomEvent('click_outside'));
            }
        };

        this._upHandler = () => {
            this.isDragging = false;
        };

        document.addEventListener('pointerdown', this._downHandler);
        document.addEventListener('mousemove', this._mouseMoveHandler);
        document.addEventListener('touchmove', this._touchMoveHandler);
        document.addEventListener('touchend', this._upHandler);
        document.addEventListener('mouseup', this._upHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('pointerdown', this._downHandler);
        document.removeEventListener('mousemove', this._mouseMoveHandler);
        document.removeEventListener('touchmove', this._touchMoveHandler);
        document.removeEventListener('touchend', this._upHandler);
        document.removeEventListener('mouseup', this._upHandler);
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = Math.max(0, Math.min(1, v));
        if (this._vertical) {
            this._slider.style.height = `${this._value * 100}%`;
        } else {
            this._slider.style.width = `${this._value * 100}%`;
        }
    }
}

customElements.define('custom-slider', custom_slider);