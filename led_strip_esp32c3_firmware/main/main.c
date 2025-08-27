#include "main.h"
#include "load_config.h"
#include "ledstrip.h"
#include "color.h"

static void uart_init() {
    const uart_config_t uart_config = {
        .baud_rate = UART_BAUDRATE,
        .data_bits = UART_DATA_8_BITS,
        .parity    = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
    };

    uart_driver_install(UART_NUM, UART_BUFSIZE, 0, 0, NULL, 0);
    uart_param_config(UART_NUM, &uart_config);
    uart_set_pin(UART_NUM, UART_TXD, UART_RXD, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE);
}

void app_main() {
    ledstrip_init();
    ledstrip_clear(0x000000);
    ledstrip_flush();

    uart_init();

    uint8_t data[4];
    while (1) {
        int len = uart_read_bytes(UART_NUM, data, 4, portMAX_DELAY);
        if (len == 4) {
            if (data[0] == 0) {
                switch (data[1]) {
                    case 0:
                        ledstrip_flush();
                        break;
                    
                    case 1:
                        uint8_t byte = LED_COUNT;
                        uart_write_bytes(UART_NUM, &byte, 1);
                        break;
                }
            } else {
                ledstrip_set(data[0] - 1, color_pack(data[1], data[2], data[3]));
            }
        }
    }
}