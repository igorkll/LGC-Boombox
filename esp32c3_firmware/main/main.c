#include "main.h"
#include "load_config.h"
#include "ledstrip.h"
#include "color.h"

static const char* TAG = "LGC-Boombox";

#ifdef USE_UART
static void uart_init() {
    const uart_config_t uart_config = {
        .baud_rate = UART_BAUDRATE,
        .data_bits = UART_DATA_8_BITS,
        .parity    = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
    };

    ESP_ERROR_CHECK(uart_driver_install(UART_NUM, UART_RX_BUFSIZE, UART_TX_BUFSIZE, 0, NULL, 0));
    ESP_ERROR_CHECK(uart_param_config(UART_NUM, &uart_config));
    ESP_ERROR_CHECK(uart_set_pin(UART_NUM, UART_TXD, UART_RXD, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE));
}

static int usb_read(void* buffer, size_t len) {
    return uart_read_bytes(UART_NUM, buffer, len, portMAX_DELAY);
}

static int usb_write(void* buffer, size_t len) {
    return uart_write_bytes(UART_NUM, buffer, len);
}
#else
static void usb_serial_init() {
    usb_serial_jtag_driver_config_t usb_serial_jtag_config = {
        .tx_buffer_size = USB_SERIAL_TX_BUFSIZE,
        .rx_buffer_size = USB_SERIAL_RX_BUFSIZE,
    };
    
    esp_err_t err = usb_serial_jtag_driver_install(&usb_serial_jtag_config);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Failed to install USB serial jtag driver: %s", esp_err_to_name(err));
        return;
    }

    ESP_LOGI(TAG, "USB Serial/JTAG initialized successfully");
}

static int usb_read(void* buffer, size_t len) {
    return usb_serial_jtag_read_bytes(buffer, len, portMAX_DELAY);
}

static int usb_write(const void* buffer, size_t len) {
    return usb_serial_jtag_write_bytes(buffer, len, portMAX_DELAY);;
}
#endif

void app_main() {
    ledstrip_init();
    ledstrip_clear(0x000000);
    ledstrip_flush();

    #ifdef USE_UART
        uart_init();
    #else
        usb_serial_init();
    #endif

    uint8_t data[4];
    while (1) {
        int len = usb_read(data, 4);

        if (len == 4) {
            if (data[0] == 0) {
                switch (data[1]) {
                    case 0:
                        ledstrip_flush();
                        break;
                    
                    case 1:
                        uint8_t byte = LED_COUNT;
                        usb_write(&byte, 1);
                        break;

                    case 2:
                        const char* str = "led_strip";
                        usb_write(str, strlen(str));
                        break;
                }
            } else {
                ledstrip_set(data[0] - 1, color_pack(data[1], data[2], data[3]));
            }
        }
    }
}