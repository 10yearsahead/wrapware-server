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

io.on('connection', (socket) => {
    console.log('Novo dispositivo conectado:', socket.id);

    // Quando você clica no botão do site, ele envia 'send-command'
    socket.on('send-command', (data) => {
        console.log('Comando recebido do painel:', data);
        // Repassa o comando para TODOS os outros conectados (incluindo o C++)
        socket.broadcast.emit('execute', data);
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
