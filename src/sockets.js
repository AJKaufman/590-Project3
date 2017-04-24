// Credit to 590-Project2 by Aidan Kaufman and simple-server-collision by Cody Van De Mark
const xxh = require('xxhashjs');

let hashList = {};
// num to hold all of our connected users
const roomList = {};
let nextRoom = 0;
let currentRoomCount = 0;

let io;


const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.on('requestAccess', () => {
      // new user in this room
      currentRoomCount++;

      // send the user to their room
      socket.join(`room${nextRoom}`);

      // if the room isn't in the roomList
      if (!roomList[`room${nextRoom}`]) {
        console.log(`adding room${nextRoom} to roomList`);
        roomList[`room${nextRoom}`] = {};
      }

      // generate the user's unique hash code
      const idString = `${socket.id}${new Date().getTime()}`;
      const hash = xxh.h32(idString, 0xCAFEBABE).toString(16);

      //socket.hash = hash; // is there a way to access this or is it a useless line?
      hashList[currentRoomCount] = hash;

      if (currentRoomCount < 3) {
        // send back that a new player has joined the room
        io.sockets.in(`room${nextRoom}`).emit('joined', {
          playerCount: currentRoomCount,
          hash,
          room: `room${nextRoom}`,
        });
      } else {
        // send back that the players have joined with the list of hashes
        io.sockets.in(`room${nextRoom}`).emit('gameStart', {
          hashList,
          room: `room${nextRoom}`,
          primaryPotato: hashList[currentRoomCount],
        });

        hashList = {};
        currentRoomCount = 0;
        nextRoom++;
      }
    });

  });
};

console.log('Websocket server started');


module.exports.setupSockets = setupSockets;

