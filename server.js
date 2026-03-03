
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let rooms = {};

function createRoom(mode) {
  return {
    mode,
    players: {},
    score: { red: 0, blue: 0 },
    time: 300,
    overtime: false
  };
}

io.on('connection', socket => {
  socket.on('join', mode => {
    let room = Object.values(rooms).find(r => r.mode === mode && Object.keys(r.players).length < mode * 2);
    if (!room) {
      room = createRoom(mode);
      rooms[socket.id] = room;
    }
    room.players[socket.id] = { x: Math.random()*800, y: 450 };
    socket.join(socket.id);
  });
});

server.listen(3000, () => console.log('Server running on 3000'));
