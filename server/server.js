const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../client')));

io.on('connection', (socket) => {
  console.log('A user connected');
  const player = {
    id: socket.id,
    currentRoom: 'start',
  };
  game.world.players[socket.id] = player;

  socket.emit('message', 'Welcome to the game!');
  socket.emit('message', game.getRoom(player.currentRoom).description);

  socket.on('command', (command) => {
    const [action, ...args] = command.split(' ');
    const arg = args.join(' ');

    switch (action) {
      case 'go':
        const room = game.getRoom(player.currentRoom);
        if (room.exits[arg]) {
          player.currentRoom = room.exits[arg];
          socket.emit('message', game.getRoom(player.currentRoom).description);
        } else {
          socket.emit('message', 'You can\'t go that way.');
        }
        break;
      case 'look':
        const currentRoom = game.getRoom(player.currentRoom);
        let description = currentRoom.description;
        if (currentRoom.npcs) {
            description += ' You see ' + currentRoom.npcs.map(npcId => game.world.npcs[npcId].name).join(', ') + '.';
        }
        socket.emit('message', description);
        break;
      case 'talk':
        const npcId = arg.toLowerCase();
        const roomNpcs = game.getRoom(player.currentRoom).npcs || [];
        if (roomNpcs.includes(npcId) && game.world.npcs[npcId]) {
            socket.emit('message', `You talk to ${game.world.npcs[npcId].name}.`);
            socket.emit('message', `"${game.world.npcs[npcId].dialogue}"`);
        } else {
            socket.emit('message', 'There is no one here by that name to talk to.');
        }
        break;
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete game.world.players[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
