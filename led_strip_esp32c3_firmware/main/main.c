#include "main.h"
#include "ledstrip.h"

#define UART_NUM UART_NUM_1
#define UART_TXD GPIO_NUM_5
#define UART_RXD GPIO_NUM_4
#define UART_BUFSIZE 1024

static void uart_init() {
    const uart_config_t uart_config = {
        .baud_rate = 9600,
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
            if (data[0]) {
                ledstrip_flush();
            } else {
                ledstrip_set(data[0] - 1, color_pack(data[1], data[2], data[3]));
            }
        }
    }
}