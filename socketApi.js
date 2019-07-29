var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');

    socket.on('chat:pesan', function(pesan) {
        console.log(pesan);
        io.emit('chat:pesan', pesan);
    }); 
});

module.exports = socketApi;