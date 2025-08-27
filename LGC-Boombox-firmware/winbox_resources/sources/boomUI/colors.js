window.colors_hexToRgb = function (hex) {
    const r = (hex >> 16) & 0xFF;
    const g = (hex >> 8) & 0xFF;
    const b = hex & 0xFF;
    return { r, g, b };
}