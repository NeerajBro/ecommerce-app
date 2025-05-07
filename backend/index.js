const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your client's origin
        methods: ["GET", "POST"],
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join room', (roomName) => {
        socket.join(roomName);
        socket.room = roomName;
        console.log(`User joined room: ${roomName}`);
    });

    socket.on('chat message', (msg) => {
        console.log("message recvd", msg);
        io.to(socket.room).emit('chat message', { text: msg, sender: socket.id, status: 'sent' });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});
