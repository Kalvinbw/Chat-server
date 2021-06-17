const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

class User {
  constructor(id) {
    this.id = id;
  }
  name;
  addName(n) {
    this.name = n;
  }
}

let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    users.push(new User(socket.id));

    io.emit('update users', users);

    socket.on('chat message', (msg) => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == socket.id) {
          if (users[i].name) {
            io.emit('chat message', msg, users[i].name);
            break;
          } else {
            io.emit('chat message', msg, socket.id);
          break;
          }  
        }
      }
      
    });

    socket.on('added name', (name) => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == socket.id) {
          users[i].addName(name);
          break;
        }
      }
      io.emit('update users', users);
    })

    socket.on('disconnect', () => {
      users = users.filter(user => user.id !== socket.id);
      //delete users[socket.id];
      console.log('Someone disconnected ' + socket.id);
      io.emit('update users', users);
    });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});