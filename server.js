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
    console.log("userid : " + socket.id);

    socket.on('CreateDuel', function(){
        var id;
        const duel = new Duels();
        console.log("Duel : " + socket.id);
        duel.save((err,doc)=>{
            if(err){
                io.emit('DuelCreated',{
                    username: socket.username,
                    DuelID: null
                }); 
            }else{
                io.emit('DuelCreated',{
                    username: socket.username,
                    DuelID: doc._id
                });   
            }
            id = err;
        });
        io.to('abcd123').emit('lobby',"duel");
        io.emit('lobby',duel);
    });

    socket.on('joinLoby',(lobyID)=>{
        socket.join(`abcd123`);
        console.log("joinded")
    });


    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});