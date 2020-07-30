//SERVER TARAFI

const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
const io = socketio();

const socketApi = {
    io      //io:io
};

// libs
const Users = require('./lib/Users');

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

    Users.upsert(socket.id, socket.request.user);   //REDİSE EKLEME

    Users.list(users => {   //REDİSTE LİSTELEME(Online olanları gösterir)
        io.emit('onlineList' , users);
    });

    socket.on('disconnect' , () => {
        Users.remove(socket.request.user.googleId); //REDİSTEN SİLME

        Users.list(users => {   //REDİSTE SİLİNİNCE LİSTELEME
            io.emit('onlineList' , users);
        });
    })
});

module.exports = socketApi;