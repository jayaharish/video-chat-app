const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const port = 9999;
let app = express();
let server = http.createServer(app);
let io = socketio(server);
server.listen(port);

let users = [];

io.on('connection',function(socket){
    io.sockets.emit('user-in',socket.id);
    users.push(socket.id);
    io.to(socket.id).emit('user-list',users);
    console.log("user came");
    socket.on('image',function(image){
        io.sockets.emit('new-image',socket.id,image);
    })
    socket.on('disconnect',function(){
        console.log("user left");
        users = users.filter(user=>user!=socket.id);
        io.sockets.emit('user-out',socket.id);
    })
})