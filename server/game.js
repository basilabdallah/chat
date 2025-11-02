const world = {
  rooms: {
    start: {
      description: 'You are in a cozy room. There is a door to the north.',
      exits: { north: 'hallway' },
    },
    hallway: {
      description: 'You are in a long hallway. There are doors to the south and east.',
      exits: { south: 'start', east: 'kitchen' },
      npcs: ['chef'],
    },
    kitchen: {
      description: 'You are in a kitchen. There is a door to the west.',
      exits: { west: 'hallway' },
    },
  },
  npcs: {
    chef: {
      name: 'Chef',
      dialogue: 'Hello, I am the chef. I can make you a delicious meal.',
    },
  },
  players: {},
};

function getRoom(roomId) {
  return world.rooms[roomId];
}

function getInitialRoom() {
  return getRoom('start');
}

module.exports = {
  world,
  getRoom,
  getInitialRoom,
};
