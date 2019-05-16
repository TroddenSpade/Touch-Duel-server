const mongoose = require('mongoose');

const DuelSchema = mongoose.Schema({
    round:{
        type:Number,
        default:0,
    },
    players:{
        type:[String],
    },
    wins:{
        type:[Number],
    },
    times:{
        type:[Number],
        default:[
            Math.random()*5000 + 1000,
            Math.random()*5000 + 1000,
            Math.random()*5000 + 1000,
            Math.random()*5000 + 1000,
            Math.random()*5000 + 1000
        ]
    }
});

const Duels = mongoose.model('Duels',DuelSchema);

module.exports = { Duels };