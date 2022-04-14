const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Usuario Bot'

//Aqui é para quando os cliente se conectarem ao socket.io
io.on('connection', socket => {
    //console.log('Novo websocket conectado!');
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Mensagem de bem vindo a um usuario
        //socket.emit('message', 'Seja bem bindo ao chat!');
        socket.emit('message', formatMessage(botName, 'Seja bem bindo ao chat!'));

        //Broadcast para usuario novos conectados
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} conectado ao chat`));

        //enviando informações de quem está conectado a room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        //Ouvindo a mensagem pelo cliente do socket
        socket.on('chatMessage', (msg) => {
            const user = getCurrentUser(socket.id);
            //console.log(msg);
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        });

        //Desconexão de usuario
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if(user){
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} acabou de deixar o chat`));

                //enviando informações de quem está conectado a room
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });

    });

    
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Serviço está sendo executado na porta ${PORT}`));