const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    users.push(socket.id);

    io.emit('update users', users);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg, socket.id);
    });

    socket.on('disconnect', () => {
      users = users.filter(user => user !== socket.id);
      console.log(users);
      io.emit('update users', users);
    });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});