const net = require('net');
const express = require('express');
const sql = require('./sql/index.js');
const log = require('./logger/index.js');

const IOT_PORT = 4000;
const HTTP_PORT = 3000;
const WHITELIST = ['::ffff:12.47.179.11'];

const isThisLocalhost = (req) => {
    var ip = req.connection.remoteAddress;
    var host = req.get('host');
    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
};

const parser = (rawMsjs) => {
    // const parseMsg = (hexData) => {
    //     const hex2Dec = v => parseInt(v, 16);
    //     try {
    //         const parsePayload = (payload) => {
    //             const res = { tipo: payload.slice(10, 12) };
    //             switch (hex2Dec(res.tipo)) {
    //                 case 14:
    //                     res.UTCE = payload.slice(0, 8);
    //                     res.semilla = payload.slice(8, 10);
    //                     res.nSlaves = payload.slice(12, 14);
    //                     res.tempMin = payload.slice(14, 16);
    //                     res.horaTempMin = payload.slice(16, 18);
    //                     res.tempMax = payload.slice(18, 20);
    //                     res.horaTempMax = payload.slice(20, 22);
    //                     break;
    //                 case 42:
    //                     res.UTCE = payload.slice(0, 8);
    //                     res.semilla = payload.slice(8, 10);
    //                     res.nSlaves = payload.slice(12, 14);
    //                     res.data = payload.slice(14, 16);
    //                     break;
    //                 case 44:
    //                     res.UTCE = payload.slice(0, 8);
    //                     res.semilla = payload.slice(8, 10);
    //                     res.nSlaves = payload.slice(12, 14);
    //                     res.data = payload.slice(14, 16);
    //                     break;
    //                 case 46:
    //                     res.UTCE = payload.slice(0, 8);
    //                     res.semilla = payload.slice(8, 10);
    //                     res.nSlaves = payload.slice(12, 14);
    //                     res.nMuestras = payload.slice(14, 16);
    //                     res.modoActual = payload.slice(16, 20);
    //                     res.actualDistanciaAlLiquido = payload.slice(20, 24);
    //                     res.actualVolumenEnTanque = payload.slice(24, 28);
    //                     res.accActual = payload.slice(28, 32);
    //                     res.distanciaLiquidomm0 = payload.slice(32, 36);
    //                     res.volumenDecilitros0 = payload.slice(36, 40);
    //                     res.distanciaLiquidomm1 = payload.slice(40, 44);
    //                     res.volumenDecilitros1 = payload.slice(44, 48);
    //                     res.distanciaLiquidomm2 = payload.slice(48, 52);
    //                     res.volumenDecilitros2 = payload.slice(52, 56);
    //                     res.distanciaLiquidomm3 = payload.slice(56, 60);
    //                     res.volumenDecilitros3 = payload.slice(60, 64);
    //                     res.distanciaLiquidomm4 = payload.slice(64, 68);
    //                     res.volumenDecilitros4 = payload.slice(68, 72);
    //                     res.distanciaLiquidomm5 = payload.slice(72, 76);
    //                     res.volumenDecilitros5 = payload.slice(76, 80);
    //                     res.distanciaLiquidomm6 = payload.slice(80, 84);
    //                     res.volumenDecilitros6 = payload.slice(84, 88);
    //                     res.distanciaLiquidomm7 = payload.slice(88, 92);
    //                     res.volumenDecilitros7 = payload.slice(92, 96);
    //                     res.distanciaLiquidomm8 = payload.slice(96, 100);
    //                     res.volumenDecilitros8 = payload.slice(100, 104);
    //                     res.distanciaLiquidomm9 = payload.slice(104, 108);
    //                     res.volumenDecilitros9 = payload.slice(108, 112);
    //                     res.distanciaLiquidomm10 = payload.slice(112, 116);
    //                     res.volumenDecilitros10 = payload.slice(116, 120);
    //                     res.distanciaLiquidomm11 = payload.slice(120, 124);
    //                     res.volumenDecilitros11 = payload.slice(124, 128);
    //                     break;
    //                 case 80:
    //                     res.UTCE = payload.slice(0, 8);
    //                     res.semilla = payload.slice(8, 10);
    //                     res.nSlaves = payload.slice(12, 14);
    //                     res.error = payload.slice(14, 18);
    //                     res.opcional = payload.slice(18);
    //                     break;
    //                 case 90:
    //                     res.UTCE = payload.slice(0, 8);
    //                     res.semilla = payload.slice(8, 10);
    //                     res.nSlaves = payload.slice(12, 14);
    //                     res.error = payload.slice(14, 16);
    //                     res.onOff = payload.slice(16, 18);
    //                     break;
    //                 case 92:
    //                     res.UTCE = payload.slice(0, 8);
    //                     res.semilla = payload.slice(8, 10);
    //                     res.nSlaves = payload.slice(12, 14);
    //                     res.payload = payload.slice(14);
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             return res;
    //         };

    //         return {
    //             MOHeader: hexData.slice(0, 2),
    //             overallLength: hexData.slice(2, 6),
    //             MOHeaderIEI: hexData.slice(6, 8),
    //             MOHeaderLength: hexData.slice(8, 12),
    //             CDRReference: hexData.slice(12, 20),
    //             IMEI: hexData.slice(20, 50),
    //             sessionStatus: hexData.slice(50, 52),
    //             MOMSN: hexData.slice(52, 56),
    //             MTMSN: hexData.slice(56, 60),
    //             timeOfSession: hexData.slice(60, 68),
    //             MOPaylodIEI: hexData.slice(68, 70),
    //             MOPaylodLength: hexData.slice(70, 74),
    //             payload: parsePayload(hexData.slice(74)),
    //         }
    //     } catch (error) {
    //         log.error(error)
    //     }
    // };

    const parseMsg = (hexData) => {
        const parseMensaje = (_mensaje) => {
            const toDecRecursive = (obj) => {
                let _obj = JSON.parse(JSON.stringify(obj));
                Object.keys(_obj).forEach(k => {
                    if (typeof _obj[k] === 'object') {
                        _obj[k] = toDecRecursive(_obj[k])
                    } else if (typeof _obj[k] === 'string') {
                        if (k === 'ts') _obj[k] = new Date(hex2Dec(obj[k])).toLocaleString()
                        else if (k === 'IMEI') _obj[k] = fromASCII(obj[k])
                        else if (k === 'raw') _obj[k] = obj[k]
                        else if (k === 'UTCE') _obj[k] = new Date(hex2Dec(obj[k]) * 1000).toLocaleString()
                        else if (k === 'timeOfSession') _obj[k] = new Date(hex2Dec(obj[k]) * 1000).toLocaleString()
                        else if (k.startsWith('distanciaLiquidomm')) {
                            let hex = obj[k].substr(2, 2) + obj[k].substr(0, 2)
                            _obj[k] = hex2Dec(hex);
                        }
                        else if (k.startsWith('volumenDecilitros')) {
                            let hex = obj[k].substr(2, 2) + obj[k].substr(0, 2)
                            _obj[k] = hex2Dec(hex);
                        }
                        else _obj[k] = hex2Dec(_obj[k]);
                    }
                })
                return _obj;
            };
            return toDecRecursive(_mensaje);
        }
        const hex2Dec = v => parseInt(v, 16);
        const hex2DecInv = v => {
            let hex = v.substr(2, 2) + v.substr(0, 2)
            return hex2Dec(hex);
        }
        const dec2Hex = v => v?.toString(16) || '0000';
        const fromASCII = str => str?.match(/.{1,2}/g)?.map(pair => String.fromCharCode(parseInt(pair, 16)))?.join("");

        try {
            const parsePayload = (payload) => {
                const res = { tipo: hex2Dec(payload.slice(10, 12)) };
                switch (tipo) {
                    case 14:
                        res.UTCE = hex2Dec(payload.slice(0, 8)) * 1000;
                        res.semilla = hex2Dec(payload.slice(8, 10));
                        res.nSlaves = hex2Dec(payload.slice(12, 14));
                        res.tempMin = hex2Dec(payload.slice(14, 16));
                        res.horaTempMin = hex2Dec(payload.slice(16, 18) * 1000);
                        res.tempMax = hex2Dec(payload.slice(18, 20));
                        res.horaTempMax = hex2Dec(payload.slice(20, 22));
                        break;
                    case 42:
                        res.UTCE = hex2Dec(payload.slice(0, 8)) * 1000;
                        res.semilla = hex2Dec(payload.slice(8, 10));
                        res.nSlaves = hex2Dec(payload.slice(12, 14));
                        res.data = payload.slice(14, 16);
                        break;
                    case 44:
                        res.UTCE = hex2Dec(payload.slice(0, 8)) * 1000;
                        res.semilla = hex2Dec(payload.slice(8, 10));
                        res.nSlaves = hex2Dec(payload.slice(12, 14));
                        res.data = payload.slice(14, 16);
                        break;
                    case 46:
                        res.UTCE = hex2Dec(payload.slice(0, 8)) * 1000;
                        res.semilla = hex2Dec(payload.slice(8, 10));
                        res.nSlaves = hex2Dec(payload.slice(12, 14));
                        res.nMuestras = hex2Dec(payload.slice(14, 16));
                        res.modoActual = hex2Dec(payload.slice(16, 20));
                        res.actualDistanciaAlLiquido = hex2DecInv(payload.slice(20, 24));
                        res.actualVolumenEnTanque = hex2DecInv(payload.slice(24, 28));
                        res.accActual = hex2DecInv(payload.slice(28, 32));
                        res.distanciaLiquidomm0 = hex2DecInv(payload.slice(32, 36));
                        res.volumenDecilitros0 = hex2DecInv(payload.slice(36, 40));
                        res.distanciaLiquidomm1 = hex2DecInv(payload.slice(40, 44));
                        res.volumenDecilitros1 = hex2DecInv(payload.slice(44, 48));
                        res.distanciaLiquidomm2 = hex2DecInv(payload.slice(48, 52));
                        res.volumenDecilitros2 = hex2DecInv(payload.slice(52, 56));
                        res.distanciaLiquidomm3 = hex2DecInv(payload.slice(56, 60));
                        res.volumenDecilitros3 = hex2DecInv(payload.slice(60, 64));
                        res.distanciaLiquidomm4 = hex2DecInv(payload.slice(64, 68));
                        res.volumenDecilitros4 = hex2DecInv(payload.slice(68, 72));
                        res.distanciaLiquidomm5 = hex2DecInv(payload.slice(72, 76));
                        res.volumenDecilitros5 = hex2DecInv(payload.slice(76, 80));
                        res.distanciaLiquidomm6 = hex2DecInv(payload.slice(80, 84));
                        res.volumenDecilitros6 = hex2DecInv(payload.slice(84, 88));
                        res.distanciaLiquidomm7 = hex2DecInv(payload.slice(88, 92));
                        res.volumenDecilitros7 = hex2DecInv(payload.slice(92, 96));
                        res.distanciaLiquidomm8 = hex2DecInv(payload.slice(96, 100));
                        res.volumenDecilitros8 = hex2DecInv(payload.slice(100, 104));
                        res.distanciaLiquidomm9 = hex2DecInv(payload.slice(104, 108));
                        res.volumenDecilitros9 = hex2DecInv(payload.slice(108, 112));
                        res.distanciaLiquidomm10 = hex2DecInv(payload.slice(112, 116));
                        res.volumenDecilitros10 = hex2DecInv(payload.slice(116, 120));
                        res.distanciaLiquidomm11 = hex2DecInv(payload.slice(120, 124));
                        res.volumenDecilitros11 = hex2DecInv(payload.slice(124, 128));
                        break;
                    case 80:
                        res.UTCE = hex2Dec(payload.slice(0, 8) * 1000);
                        res.semilla = hex2Dec(payload.slice(8, 10));
                        res.nSlaves = hex2Dec(payload.slice(12, 14));
                        res.error = hex2Dec(payload.slice(14, 18));
                        res.opcional = hex2Dec(payload.slice(18));
                        break;
                    case 90:
                        res.UTCE = hex2Dec(payload.slice(0, 8)) * 1000;
                        res.semilla = hex2Dec(payload.slice(8, 10));
                        res.nSlaves = hex2Dec(payload.slice(12, 14));
                        res.error = hex2Dec(payload.slice(14, 16));
                        res.onOff = hex2Dec(payload.slice(16, 18));
                        break;
                    case 92:
                        res.UTCE = hex2Dec(payload.slice(0, 8)) * 1000;
                        res.semilla = hex2Dec(payload.slice(8, 10));
                        res.nSlaves = hex2Dec(payload.slice(12, 14));
                        res.payload = payload.slice(14);
                        break;
                    default:
                        break;
                }
                return res;
            };

            return {
                MOHeader: hexData.slice(0, 2),
                overallLength: hexData.slice(2, 6),
                MOHeaderIEI: hexData.slice(6, 8),
                MOHeaderLength: hexData.slice(8, 12),
                CDRReference: hexData.slice(12, 20),
                IMEI: fromASCII(hexData.slice(20, 50)),
                sessionStatus: hexData.slice(50, 52),
                MOMSN: hexData.slice(52, 56),
                MTMSN: hexData.slice(56, 60),
                timeOfSession: hex2Dec(hexData.slice(60, 68)) * 1000,
                MOPaylodIEI: hexData.slice(68, 70),
                MOPaylodLength: hexData.slice(70, 74),
                payload: parsePayload(hexData.slice(74)),
            }
        } catch (error) {
            console.error(error)
        }
    }

    const parsedMsgs = rawMsjs.map(msg => {
        const parsed = parseMsg(msg.raw);
        return { IMEI: parsed.IMEI, ts: msg.timestamp, raw: msg.raw, parsed }
    });

    const parsedMsgsByIMEI = parsedMsgs.reduce((p, msg) => {
        p[msg.IMEI] = p[msg.IMEI] || [];
        p[msg.IMEI].push(msg);
        return p;
    }, {});
    const IMEI2Groups = []; // TODO: query from DDBB
    const IMEIsWithNoGroup = Object.keys(parsedMsgsByIMEI).filter(IMEI => !IMEI2Groups.some(g => g.IMEIs.includes(IMEI)));
    IMEI2Groups.push({ nombre: 'Sin Grupo', IMEIs: IMEIsWithNoGroup });

    return IMEI2Groups
        .reduce((p, g) => [...p, {
            ...g,
            IMEIs: g.IMEIs.map(IMEI => ({
                IMEI,
                equipos: parsedMsgsByIMEI[IMEI].reduce((p, x) => {
                    p[x.parsed.payload.nSlaves || 'general'] ??= { nSlave: x.parsed.payload.nSlaves, mensajes: [] };
                    p[x.parsed.payload.nSlaves || 'general'].mensajes.push({ parsed: x.parsed, raw: x.raw, ts: x.ts });
                    return p;
                }, {}),
            }))
        }], [])
        .map(g => g);
}
const cache = { parser: parser.toString(), data: [] };

const runHTTPService = async () => {
    const app = express()
    app.get('/mensajes', async (req, res) => {
        if (true || isThisLocalhost(req)) {
            res.send(cache);
        }
    });

    app.listen(HTTP_PORT, () => console.log(`IOT HTTP listening on port ${HTTP_PORT}!`));
};

const runIOTService = async () => {
    const fortyDaysInMilli = 40 * 24 * 60 * 60 * 1000;
    const server = net.createServer();
    cache.data = (await sql.get('Mensajes')).sort((a, b) => b.ts - a.ts).slice(0, 10000);
    server.on('connection', (socket) => {
        console.log(`Remote Address: `, socket.remoteAddress);
        if (WHITELIST.includes(socket.remoteAddress)) {
            const onData = async (data) => {
                const hexData = data.toString('hex');
                log.info(hexData);
                cache.data.unshift({ ts: Date.now(), raw: hexData });
                if (cache.data.length > 10000) cache.data.pop();
                await sql.add('Mensajes', { Timestamp: Date.now(), Raw: hexData });
                socket.write(`OK`);
            }

            const onClose = (data) => { log.info(`Closed`, data); }

            const onError = (err) => { log.error(`Error: ${err.message}`) }

            socket.on('data', onData);
            socket.on('close', onClose);
            socket.on('error', onError);
        } else {
            log.warn(`Invalid IP: ${socket.remoteAddress}`);
        }

    })

    server.listen(IOT_PORT, () => log.info(`IOT Server listening on port:${IOT_PORT}`));
};

runIOTService();
runHTTPService();