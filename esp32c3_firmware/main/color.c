#include "color.h"

uint32_t color_pack(uint8_t red, uint8_t green, uint8_t blue) {
    return (red << 16) | (green << 8) | blue;
}

uint32_t color_hsv(uint8_t hue, uint8_t saturation, uint8_t value) {
    uint8_t region = hue / 43;
    uint8_t remainder = (hue - (region * 43)) * 6;
    uint8_t p = (value * (255 - saturation)) >> 8;
    uint8_t q = (value * (255 - ((saturation * remainder) >> 8))) >> 8;
    uint8_t t = (value * (255 - ((saturation * (255 - remainder)) >> 8))) >> 8;

    switch (region) {
        case 0:
            return color_pack(value, t, p);
            
        case 1:
            return color_pack(q, value, p);

        case 2:
            return color_pack(p, value, t);

        case 3:
            return color_pack(p, q, value);

        case 4:
            return color_pack(t, p, value);

        default:
            return color_pack(value, p, q);
    }
}

uint8_t color_getRed(uint32_t color) {
    return (color >> 16) & 0xFF;
}

uint8_t color_getGreen(uint32_t color) {
    return (color >> 8) & 0xFF;
}

uint8_t color_getBlue(uint32_t color) {
    return color & 0xFF;
}