#pragma once
#include "main.h"

void ledstrip_init();
void ledstrip_setLight(uint8_t light);
void ledstrip_clear(uint32_t color);
void ledstrip_set(size_t i, uint32_t color);
void ledstrip_setRGB(size_t i, uint8_t r, uint8_t g, uint8_t b);
void ledstrip_setHSV(size_t i, uint8_t h, uint8_t s, uint8_t v);
void ledstrip_flush();