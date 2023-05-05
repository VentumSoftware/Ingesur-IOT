var net = require('net');
//var options = { port:4000, host: '127.0.0.1'} local
var options = { port:4000, host: '18.118.184.2'}

var client = net.createConnection(options);
client.on('connect', ()=> {
	console.log('Conectado!');
	client.write('Hola Servidor!'); // kill client after server's response
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('error', (err) => {
	console.log('Error: ' + err.message);
});

client.on('close', function() {
	console.log('Connection closed');
});


