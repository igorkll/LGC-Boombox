{
const { SerialPort } = require('serialport');

const TEST_BYTES = Buffer.from([0, 2, 0, 0]);

async function findLedStripPort() {
    const ports = await SerialPort.list();

    for (const portInfo of ports) {
        const portPath = portInfo.path;
        console.log(`Trying port: ${portPath}`);

        try {
            const found = await testPort(portPath);
            if (found) {
                console.log(`LED strip found on port: ${portPath}`);
                return portPath;
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

        const cleanup = () => {
            clearTimeout(timeout);
            port.removeAllListeners('data');
            port.removeAllListeners('error');
            if (port.isOpen) {
                port.close();
            }
        };

        const onData = (data) => {
            const str = data.toString('utf-8');
            if (str.includes('led_strip')) {
                cleanup();
                resolve(true);
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

/*
(async () => {
    let portPath = await findLedStripPort();
    if (portPath) console.log(`Selected port: ${portPath}`);
})();
*/

(async () => {
    let result = await testPort("COM9");
    console.log(result);
})();



}