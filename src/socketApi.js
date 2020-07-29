//SERVER TARAFI

const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
const io = socketio();

const socketApi = {
    io      //io:io
};

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

    socket.broadcast.emit('sa');

});

module.exports = socketApi;