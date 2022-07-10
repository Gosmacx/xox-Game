const http = require('http');
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"]
  }
});

const PORT = process.env.PORT || 5000;

const Room = require('./models/Room')
const User  = require('./models/User')

const rooms = new Map()

const positions = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
  [1,4,7],
  [2,5,8],
  [3,6,9],
  [1,5,9],
  [3,5,7]
]

function checkGame(moves) {
  return positions.some(position => {
      return position.every(index => {
          return moves.map(item => item.index).includes(index)
      })
  })
}

io.on("connection", (socket) => {

  let _room;
  
  socket.on('create-room', (username) => {

    const uid = Math.round(Math.random() * (999 - 100) + 100)

    if (rooms.has(uid)) return socket.emit('error', 'Error');

    const newRoom = new Room(uid)
    rooms.set(uid, newRoom)

    const roles = ['X', 'O']
    const role = roles[Math.floor(Math.random() * roles.length)]

    if (role === 'X') {
      newRoom.turn = socket.id // Game start always with X
      newRoom.x = new User(socket.id, username, role)
    }
    else if(role === 'O') {
      newRoom.o =  new User(socket.id, username, role)
    }

    _room = newRoom
    socket.join(uid)

    socket.emit('room-created', newRoom)

  })  

  socket.on('get-room', id => {
    const room = rooms.get(parseInt(id))
    if (!room) return socket.emit('error', 'Error');

    socket.emit('room-data', room)
  })

  socket.on('join-room', ({id, username}) => {   

    const room = rooms.get(parseInt(id))
    if (!room) return socket.emit('room-notfound');

    if (!room.x) room.x = new User(socket.id, username, 'X')
    else room.o = new User(socket.id, username, 'O')

    if (!room.turn) room.turn = socket.id

    socket.join(parseInt(id))
    _room = room

    io.to(parseInt(id)).emit('room-joined', room)

  })

  socket.on('move', ({id, index, roomID}) => {

    const room = rooms.get(roomID)
    if (!room) return socket.emit('error', 'Error');
    
    const player = room.getPlayer(id)
    if (!player) return socket.emit('error', 'Error');

    if (room.moves.find(i => i.index == index)) return; // if move already exists return
    if (room.turn !== id) return // if it's not your turn return

    player.moves.push(index) // add move to player moves
    room.moves.push({
      index,
      player: player.role
    })

    // Change turn
    if (player.role === 'X') room.turn = room.o.id
    else room.turn = room.x.id
    
    io.to(roomID).emit('playerMoved', {
      player,
      index,
      room
    })
    
    // Check the Winner
    const isWin = checkGame(room.moves.filter(move => move.player === player.role ))
    if (isWin) return io.to(roomID).emit('game-finished', player)
    else if (room.moves.length === 9) return io.to(roomID).emit('game-finished')


  })

  socket.on('again-play', (roomPacket) => {
  
      const room = rooms.get(roomPacket.id)
      if (!room) return socket.emit('error', 'Error');

      // Set new random turn
      const mixPlayer = [room.x, room.o]
      const newTurn = mixPlayer[Math.floor(Math.random() * mixPlayer.length)]
    
      room.turn = newTurn.id
      room.moves = []
      room.x.moves = []
      room.o.moves = []
  
      io.to(room.id).emit('refresh-game', room)
  
  })

  socket.on('disconnect', () => {

    if (!_room) return;
    const room = rooms.get(_room.id)
    if (!room) return;


    if (room.x?.id === socket.id) {
      room.x = null
    }
    else if (room.o?.id === socket.id) {
      room.o = null
    }

    room.moves = []
    room.turn = null

    io.to(room.id).emit('player-disconnected', room)


    if (!room.x && !room.o) {
      rooms.delete(room.id)
    }

  })

})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
