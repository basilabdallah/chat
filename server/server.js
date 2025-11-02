const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..')));

const players = {};
const npc = {
    name: "Wizard",
    dialogue: [
        "Welcome, traveler!",
        "This world is full of secrets. Can you uncover them?",
        "Beware the Whispering Woods to the north...",
        "I can offer you a quest, if you are brave enough. Just say 'quest'."
    ],
    dialogueIndex: 0
};

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    players[socket.id] = { id: socket.id, position: { x: 0, y: 1, z: 0 }, rotation: { x: 0, y: 0, z: 0 } };
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });

    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].position = movementData.position;
            players[socket.id].rotation = movementData.rotation;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('chatMessage', (msg) => {
        // Check for commands
        if (msg.toLowerCase().trim() === 'talk') {
            const dialogue = npc.dialogue[npc.dialogueIndex];
            npc.dialogueIndex = (npc.dialogueIndex + 1) % npc.dialogue.length; // Cycle through dialogue
            io.emit('chatMessage', { id: 'NPC', message: dialogue });
        } else if (msg.toLowerCase().trim() === 'quest') {
             io.emit('chatMessage', { id: 'NPC', message: "A quest will be available in a future update! For now, explore." });
        }
        else {
            // Broadcast normal chat message
            io.emit('chatMessage', { id: socket.id, message: msg });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
