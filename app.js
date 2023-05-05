
const net = require('net');
const PORT = 4000;
const server = net.createServer();
const db = [];

const getData = () => {

}

const runIOTService = async () => {
    //IOT Socket
    server.on('connection', (socket) => {

        console.log(`Address: ${socket.address}`)

        const valid = (socket) => {

            const validIP = () => {
                const whiteList = [];
                return whiteList.includes(socket.remoteAddress) || true;
            };

            const validTrama = () => {
                true;
                //checkeo largo;
            }

            return validIP() && validTrama();
        }

        if (valid(socket)) {
            const onData = (data) => {
                console.log(data);
                db.push({ ts: Date.now(), raw: [...data], hex: data.toString('hex') });
                // if (data.startsWith('CMD:')) {
                //     socket.write(`CMD Recibido!`)
                // } else {
                //     socket.write(`Recibido!`)
                // }
                socket.write(`Recibido!`)
            }

            const onError = (err) => {
                console.log(`Error: ${err.message}`)
            }

            socket.on('data', onData);
            //socket.on('close', onClose);
            socket.on('error', onError);
        }

    })

    server.listen(PORT, () => console.log(`IOT Server listening on port:${PORT}`));

    //HTTP Socket
    const express = require('express')
    const app = express()

    app.get('/', function (req, res) { res.send(getData()) })

    app.listen(3000)
}
runIOTService();