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
    socket.on('connection', ()=>{console.log("connected")});

    socket.on('CreateDuel', function(){
        const duel = new Duels();
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
        });
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});