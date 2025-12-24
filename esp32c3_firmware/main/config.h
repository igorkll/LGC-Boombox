#define LED_COUNT 42
#define LED_GPIO 9
#define LED_FREQ 10000000
#define LED_ORDER ledstrip_GRB
#define LED_MAX_LIGHT 16

//uncomment if your board has an external UART controller
//#define USE_UART

#ifdef USE_UART
    #define UART_NUM UART_NUM_1
    #define UART_TXD GPIO_NUM_5
    #define UART_RXD GPIO_NUM_4
    #define UART_RX_BUFSIZE 1024
    #define UART_TX_BUFSIZE 1024
    #define UART_BAUDRATE 115200
#else
    #define USB_SERIAL_RX_BUFSIZE 1024
    #define USB_SERIAL_TX_BUFSIZE 1024
#endif
