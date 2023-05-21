const net = require('net');
const express = require('express');
const sql = require('./sql/index.js');
const log = require('./logger/index.js');

const IOT_PORT = 4000;
const HTTP_PORT = 3000;
const WHITELIST = ['::ffff:12.47.179.11']

const hex2Dec = v => parseInt(v, 16);
const isThisLocalhost =  (req) => {
    var ip = req.connection.remoteAddress;
    var host = req.get('host');
    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
};

const parseData = (hexData) => {
    try {
        const parsePayload = (payload) => {
            const res = { tipo: payload.slice(10, 12) };
            switch (hex2Dec(res.tipo)) {
                case 14:
                    res.UTCE = payload.slice(0, 8);
                    res.semilla = payload.slice(8, 10);
                    res.nSlaves = payload.slice(12, 14);
                    res.tempMin = payload.slice(14, 16);
                    res.horaTempMin = payload.slice(16, 18);
                    res.tempMax = payload.slice(18, 20);
                    res.horaTempMax = payload.slice(20, 22);
                    break;
                case 42:
                    res.UTCE = payload.slice(0, 8);
                    res.semilla = payload.slice(8, 10);
                    res.nSlaves = payload.slice(12, 14);
                    res.data = payload.slice(14, 16);
                    break;
                case 44:
                    res.UTCE = payload.slice(0, 8);
                    res.semilla = payload.slice(8, 10);
                    res.nSlaves = payload.slice(12, 14);
                    res.data = payload.slice(14, 16);
                    break;
                case 46:
                    res.UTCE = payload.slice(0, 8);
                    res.semilla = payload.slice(8, 10);
                    res.nSlaves = payload.slice(12, 14);
                    res.nMuestras = payload.slice(14, 16);
                    res.modoActual = payload.slice(16, 20);
                    res.actualDistanciaAlLiquido = payload.slice(20, 24);
                    res.actualVolumenEnTanque = payload.slice(24, 28);
                    res.accActual = payload.slice(28, 32);
                    DistanciaLiquidomm0 = payload.slice(32, 36);
                    volumenDecilitros0 = payload.slice(36, 40);
                    DistanciaLiquidomm1 = payload.slice(40, 44);
                    volumenDecilitros1 = payload.slice(44,48);
                    DistanciaLiquidomm2 = payload.slice(48, 52);
                    volumenDecilitros2 = payload.slice(52, 56);
                    DistanciaLiquidomm3 = payload.slice(56, 60);
                    volumenDecilitros3 = payload.slice(60, 64);
                    DistanciaLiquidomm4 = payload.slice(64, 68);
                    volumenDecilitros4 = payload.slice(72, 76);
                    DistanciaLiquidomm5 = payload.slice(76, 80);
                    volumenDecilitros5 = payload.slice(84, 88);
                    DistanciaLiquidomm6 = payload.slice(92, 96);
                    volumenDecilitros6 = payload.slice(96, 100);
                    DistanciaLiquidomm7 = payload.slice(100, 104);
                    volumenDecilitros7 = payload.slice(104, 108);
                    DistanciaLiquidomm8 = payload.slice(108, 112);
                    volumenDecilitros8 = payload.slice(112, 116);
                    DistanciaLiquidomm9 = payload.slice(116, 120);
                    volumenDecilitros9 = payload.slice(120, 124);
                    DistanciaLiquidomm10 = payload.slice(124, 128);
                    volumenDecilitros10 = payload.slice(128, 132);
                    DistanciaLiquidomm11 = payload.slice(132, 136);
                    volumenDecilitros11 = payload.slice(136, 140);
                    break;
                case 80:
                    res.UTCE = payload.slice(0, 8);
                    res.semilla = payload.slice(8, 10);
                    res.nSlaves = payload.slice(12, 14);
                    res.error = payload.slice(14, 18);
                    res.opcional = payload.slice(18);
                    break;
                case 90:
                    res.UTCE = payload.slice(0, 8);
                    res.semilla = payload.slice(8, 10);
                    res.nSlaves = payload.slice(12, 14);
                    res.error = payload.slice(14, 16);
                    res.onOff = payload.slice(16, 18);
                    break;
                case 92:
                    res.UTCE = payload.slice(0, 8);
                    res.semilla = payload.slice(8, 10);
                    res.nSlaves = payload.slice(12, 14);
                    res.payload = payload.slice(14);
                    break;
                default:
                    break;
            }
            return res;
        };

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
        if (true || isThisLocalhost(req)) {
            // const rawMsjs = await sql.get('Mensajes');
            // const parsedMsjs = rawMsjs.map(msj => parseData(msj.raw));
            // const response = {
            //     areas: [
            //         {
            //             nombre: 'Test',
            //             geo: "-45.867714,-68.131386",
            //             equipos: parsedMsjs.reduce((p, x) => {
            //                 p[x.IMEI] = p[x.IMEI] || { mensajes: [] };
            //                 p[x.IMEI].mensajes.push(x.payload);
            //                 return p;
            //             }, {})
            //         }
            //     ]
            // }
            res.send((await sql.get('Mensajes')).map(msj => parseData(msj.raw)))
        }

    });

    app.listen(HTTP_PORT);
}

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