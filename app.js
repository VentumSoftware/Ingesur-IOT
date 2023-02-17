const net = require('net');
const PORT = 4000;
const server = net.createServer();
const db = [];

//IOT Socket
server.on('connection', (socket) => {

    const onData = (data) => {
        console.log(`onData: ${data}`);
        db.push(data);
        // if (data.startsWith('CMD:')) {
        //     socket.write(`CMD Recibido!`)
        // } else {
        //     socket.write(`Recibido!`)
        // }
        socket.write(`Recibido!`)
    }
    const onClose = (data) => {
        console.log(`Comunication closed!`)
        console.log(data)
    }
    const onError = (err) => {
        console.log(`Error: ${err.message}`)
    }

    socket.on('data', onData);
    socket.on('close', onClose);
    socket.on('error', onError);
})

server.listen(PORT, () => console.log(`Server listening on PORT:${PORT}`));

//HTTP Socket
const express = require('express')
const app = express()

app.get('/', function (req, res) {res.json(db)})

app.listen(3000)