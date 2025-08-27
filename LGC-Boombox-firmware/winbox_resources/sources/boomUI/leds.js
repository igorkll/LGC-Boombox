{
let port;
let led_count = 0;

window.leds_getCount = function () {
    return led_count;
}

window.leds_set = function (index, rgb) {
    if (led_count == 0) return;
    port.write(Buffer.from([index + 1, rgb[0], rgb[1], rgb[2]]));
    console.log(rgb);
}

window.leds_flush = function () {
    if (led_count == 0) return;
    port.write(Buffer.from([0, 0, 0, 0]));
    console.log("F");
}

// ----------------------------------------------------------------

const { SerialPort } = require('serialport');

const TEST_BYTES = Buffer.from([0, 2, 0, 0]);

async function findLedStripPort() {
    const ports = await SerialPort.list();

    for (const portInfo of ports) {
        const portPath = portInfo.path;
        console.log(`Trying port: ${portPath}`);

        try {
            const port = await testPort(portPath);
            if (port) {
                console.log(`LED strip found on port: ${portPath}`);
                return port;
            }
        } catch (err) {
            console.log(`Failed to test ${portPath}: ${err.message}`);
        }
    }

    console.log('LED strip port not found');
    return null;
}

async function testPort(portPath) {
    return new Promise((resolve, reject) => {
        const port = new SerialPort({
            path: portPath,
            baudRate: uart_baudrate,
            autoOpen: false,
        });

        let timeout;

        const cleanup = (withoutClose=false) => {
            clearTimeout(timeout);
            port.removeAllListeners('data');
            port.removeAllListeners('error');
            if (port.isOpen && !withoutClose) {
                port.close();
            }
        };

        const onData = (data) => {
            const str = data.toString('utf-8');
            if (str.includes('led_strip')) {
                cleanup(true);
                resolve(port);
            }
        };

        const onError = (err) => {
            cleanup();
            reject(err);
        };

        port.on('data', onData);
        port.on('error', onError);

        port.open((err) => {
            if (err) {
                cleanup();
                reject(err);
                return;
            }

            port.write(TEST_BYTES);

            timeout = setTimeout(() => {
                cleanup();
                resolve(false);
            }, 500);
        });
    });
}

(async () => {
    port = await findLedStripPort();
    if (port) {
        port.on('data', (data) => {
            if (data.length > 0) {
                led_count = data[0];
            }
        });

        port.write(Buffer.from([0, 1, 0, 0]));
    }
})();

}