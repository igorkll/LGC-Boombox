#include "main.h"
#include "ledstrip.h"

void app_main() {
    ledstrip_init();

    ledstrip_clear(0x000000);
    ledstrip_flush();

    while (true) {
        
    }
}