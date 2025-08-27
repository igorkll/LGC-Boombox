#include "main.h"
#include "ledstrip.h"

void app_main() {
    ledstrip_init();

    while (true) {
        ledstrip_clear(0xff0000);
        ledstrip_flush();
        vTaskDelay(pdMS_TO_TICKS(1000));

        ledstrip_clear(0x00ff00);
        ledstrip_flush();
        vTaskDelay(pdMS_TO_TICKS(1000));

        ledstrip_clear(0x0000ff);
        ledstrip_flush();
        vTaskDelay(pdMS_TO_TICKS(1000));

        ledstrip_clear(0x000000);
        ledstrip_flush();
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}