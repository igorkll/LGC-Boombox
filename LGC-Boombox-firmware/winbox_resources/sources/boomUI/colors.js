{
window.colors_888ToRgb = function (hex) {
    let r = (hex >> 16) & 0xFF;
    let g = (hex >> 8) & 0xFF;
    let b = hex & 0xFF;
    return [ r, g, b ];
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

window.colors_from = function (colorValue) {
    let rgbArray;

    if (colorValue.startsWith('rgb')) {
        let rgbValues = colorValue.match(/\d+/g);
        rgbArray = rgbValues.map(Number);
    } else if (colorValue.startsWith('#')) {
        rgbArray = hexToRgb(colorValue);
    } else {
        rgbArray = [0, 0, 0];
    }

    return rgbArray;
}

window.colors_multiply = function(color, multiplier) {
    let rgb = color.slice();
    rgb[0] = Math.min(255, Math.max(0, Math.round(rgb[0] * multiplier)));
    rgb[1] = Math.min(255, Math.max(0, Math.round(rgb[1] * multiplier)));
    rgb[2] = Math.min(255, Math.max(0, Math.round(rgb[2] * multiplier)));
    return rgb;
}
}