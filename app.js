const net = require('net');
const express = require('express');
const sql = require('./sql/index.js');
const log = require('./logger/index.js');

const IOT_PORT = 4000;
const HTTP_PORT = 3000;
const WHITELIST = ['::ffff:12.47.179.11']

const runHTTPService = async () => {
    const app = express()
    app.get('/', function (req, res) { res.send(getData()) })
    app.listen(HTTP_PORT)
}

// IP: ::ffff:12.47.179.11
// Puerto: 15145
// Data: 01 00 2b 01 00 1c 21 ca 2e 54 33 30 30 34 33 34 30 36 34 37 36 38 30 33 30 00 01 27 00 00 64 55 17 05 02 00 09 64 55 10 9f 00 50 02 e5 2e

const runIOTService = async () => {
    const server = net.createServer();
    //IOT Socket
    server.on('connection', (socket) => {
        console.log(`Remote Address: `, socket.remotePort);
        if (WHITELIST.includes(socket.remoteAddress)) {
            const onData = async (data) => {

                const parseData = (hexData) => {
                    try {
                        return {
                            MOHeader: hexData.slice(0, 2),
                            overallLenght: hexData.slice(2, 6),
                            MOHeaderIEI: hexData.slice(6, 10),
                            MOHeaderLenght: hexData.slice(10, 18),
                            IMEI: hexData.slice(20, 48),
                            sessionStatus: hexData.slice(48, 50),
                            MOMSN: hexData.slice(50, 54),
                            MTMSN: hexData.slice(50, 54),
                            timeOfSession: hexData.slice(54, 62),
                            MOPaylodIEI: hexData.slice(62, 64),
                            MOPaylodLenght: hexData.slice(64, 68),
                            payload: hexData.slice(68),
                        }
                    } catch (error) {
                        log.error(error)
                    }
                };

                const hexData  = data.toString('hex');
                log.info(hexData);
                const parsedData = parseData(hexData);
                if(parsedData){
                    log.warn(parsedData);
                    await sql.add('Mensajes', { IMEI: parsedData.IMEI, Timestamp: Date.now(), Codigo: parsedData.codigo, Raw: hexData });
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
        }else{
            log.warn(`Invalid IP: ${socket.remoteAddress}`);
        }

    })

    server.listen(IOT_PORT, () => log.info(`IOT Server listening on port:${IOT_PORT}`));
}
runIOTService();
runHTTPService();