#pragma once
#include "main.h"

uint32_t color_pack(uint8_t red, uint8_t green, uint8_t blue);
uint32_t color_hsv(uint8_t hue, uint8_t saturation, uint8_t value);
uint8_t color_getRed(uint32_t color);
uint8_t color_getGreen(uint32_t color);
uint8_t color_getBlue(uint32_t color);