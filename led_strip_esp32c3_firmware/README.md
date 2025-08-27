# led strip esp32c3 firmware
## esp-idf version 5.3
* go to main/config.h and specify the number of LEDs and the PIN to which the led strip is connected
* in the configuration, you also need to specify whether there is an external UART controller on your board
* you can also specify the maximum brightness of the strip