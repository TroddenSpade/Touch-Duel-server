const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const config = require('./src/configs/config').get();
const port = config.PORT ;

const app = express();
const server = app.listen(port,()=>{
    console.log("It's Working !")
});

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE,
    { useNewUrlParser: true }
);

const io = socket(server);

const {Duels} = require('./src/models/Duel');

io.on('connection', (socket) => {
    console.log("connected");
    console.log("userid : " + socket.id);

    socket.on('CreateDuel', function(){
        const duel = new Duels({players:[socket.id]});
        duel.save((err,doc)=>{
            if(err){
                io.emit('DuelCreated');
            }else{
                io.emit('DuelCreated',doc);  
                socket.join(doc._id);
                io.emit('lobby',doc._id);
            }
        });
    });

    socket.on('deleteLobby',(id)=>{
        Duels.findOneAndDelete({_id:id},(err,doc)=>{
            return ;
        });
    });

    socket.on('joinLobby',(lobbyID)=>{
        socket.join(lobbyID);
        Duels.findByIdAndUpdate(lobbyID,{$push:{players:socket.id}},{new:true},(err,doc)=>{
            socket.emit("lobbyInfo",doc);
        });
        io.to(lobbyID).emit("playerJoined",socket.id);
    });

    socket.on('startDuel',(lobbyID)=>{
        Duels.findById(lobbyID,(err,duel)=>{
            io.to(lobbyID).emit("start",duel);
        })
    })

    socket.on('missed',(id)=>{
        socket.broadcast.to(id).emit('missed');
    })

    socket.on('shoot',(id)=>{
        console.log('one is dead')
        io.to(id).emit('dead',socket.id);
    })

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});