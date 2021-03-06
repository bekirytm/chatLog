//SERVER TARAFI

const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
const io = socketio();

const socketApi = {
    io      //io:io
};

// libs
const Users = require('./lib/Users');
const Rooms = require('./lib/Rooms');
const Messages = require('./lib/Messages');

//SOCKET.IO MIDDLEWARE
io.use(socketAuthorization);

//Redis Adapter (redis-socket.io)

const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT
}));

io.on('connection' , (socket) => {
    console.log("a user login with name " + socket.request.user.name);

    Rooms.list(rooms => {
        io.emit('roomList' , rooms);
    });

    Users.upsert(socket.id, socket.request.user);   //REDİSE EKLEME

    Users.list(users => {   //REDİSTE LİSTELEME(Online olanları gösterir)
        io.emit('onlineList' , users);
    });

    //ROOM İŞLEMLERİ
    socket.on('newRoom' , roomName => {
        Rooms.upsert(roomName);
        Rooms.list(rooms => {
            io.emit('roomList' , rooms);
        });
    });

    //MESAJ İŞLEMİ
    socket.on('newMessage' , (data) => {
        const messageData = {
            ...data,
            userId: socket.request.user._id,
            username:  socket.request.user.name,
            surname: socket.request.user.surname
        };
        Messages.upsert(messageData);

        socket.broadcast.emit('receiveMessage' , messageData);  //Mesajların anlık herkese gitmesi.

    });

    socket.on('disconnect' , () => {
        Users.remove(socket.request.user._id); //REDİSTEN SİLME

        Users.list(users => {   //REDİSTE SİLİNİNCE LİSTELEME
            io.emit('onlineList' , users);
        });
    })
});

module.exports = socketApi;