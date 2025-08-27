#define LED_COUNT 42
#define LED_GPIO 9
#define LED_FREQ 10000000
#define LED_ORDER ledstrip_GRB
#define LED_MAX_LIGHT 16

//uncomment if your board has an external UART controller
//#define BOARD_WITH_EXTERNAL_UART_CONTROLLER

#ifdef BOARD_WITH_EXTERNAL_UART_CONTROLLER
    #define UART_NUM UART_NUM_1
    #define UART_TXD GPIO_NUM_5
    #define UART_RXD GPIO_NUM_4
#else
    #define UART_NUM      UART_NUM_0
    #define UART_TXD      UART_PIN_NO_CHANGE
    #define UART_RXD      UART_PIN_NO_CHANGE
#endif
#define UART_BUFSIZE 1024
#define UART_BAUDRATE 115200