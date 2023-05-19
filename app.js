const net = require('net');
const express = require('express');
const sql = require('./sql/index.js');
const log = require('./logger/index.js');

const IOT_PORT = 4000;
const HTTP_PORT = 3000;
const WHITELIST = ['::ffff:12.47.179.11']

const parseData = (hexData) => {
    try {
        const parsePayload = (payload) => ({
            UTCE: payload.slice(0, 8),
            semilla: payload.slice(8, 10),
            tipo: payload.slice(10, 12),
            nSlaves: payload.slice(12, 14),
            data: payload.slice(14),
        });

        return {
            MOHeader: hexData.slice(0, 2),
            overallLenght: hexData.slice(2, 6),
            MOHeaderIEI: hexData.slice(6, 8),
            MOHeaderLenght: hexData.slice(8, 12),
            CDRReference: hexData.slice(12, 20),
            IMEI: hexData.slice(20, 50),
            sessionStatus: hexData.slice(50, 52),
            MOMSN: hexData.slice(52, 56),
            MTMSN: hexData.slice(56, 60),
            timeOfSession: hexData.slice(60, 68),
            MOPaylodIEI: hexData.slice(68, 70),
            MOPaylodLenght: hexData.slice(70, 74),
            payload: parsePayload(hexData.slice(74)),
        }
    } catch (error) {
        log.error(error)
    }
};

const runHTTPService = async () => {
    const app = express()
    app.get('/mensajes', async (req, res) => {
        if (server.address() === req.socket.remoteAddress || req.headers['x-forwarded-for']) {
            const rawMsjs = await sql.get('Mensajes');
            const parsedMsjs = rawMsjs.map(msj => parseData(msj.raw));
            const response = {
                areas: [
                    {
                        nombre: 'Test',
                        geo: "-45.867714,-68.131386",
                        equipos: parsedMsjs.reduce((p, x) => {
                            p[x.IMEI] = p[x.IMEI] || { mensajes: [] };
                            p[x.IMEI].mensajes.push(x.payload);
                            return p;
                        }, {})
                    }
                ]
            }
            res.send(response)
        }

    });

    app.listen(HTTP_PORT);
}

// IP: ::ffff:12.47.179.11
// Puerto: 15145
// Data: 01 00 2b 01 00 1c 21 ca 2e 54 33 30 30 34 33 34 30 36 34 37 36 38 30 33 30 00 01 27 00 00 64 55 17 05 02 00 09 64 55 10 9f 00 50 02 e5 2e

const runIOTService = async () => {
    const server = net.createServer();
    //IOT Socket
    server.on('connection', (socket) => {
        console.log(`Remote Address: `, socket.remoteAddress);
        if (WHITELIST.includes(socket.remoteAddress)) {
            const onData = async (data) => {

                const hexData = data.toString('hex');
                log.info(hexData);
                const parsedData = parseData(hexData);
                if (parsedData) {
                    log.warn(parsedData);
                    await sql.add('Mensajes', { Timestamp: Date.now(), Raw: hexData });
                    socket.write(`OK`);
                }
            }

            const onClose = (data) => {
                log.info(`Closed`, data);
            }

            const onError = (err) => {
                log.error(`Error: ${err.message}`)
            }

            socket.on('data', onData);
            socket.on('close', onClose);
            socket.on('error', onError);
        } else {
            log.warn(`Invalid IP: ${socket.remoteAddress}`);
        }

    })

    server.listen(IOT_PORT, () => log.info(`IOT Server listening on port:${IOT_PORT}`));
}
runIOTService();
runHTTPService();