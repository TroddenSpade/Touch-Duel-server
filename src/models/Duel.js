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
    }
});

const Duels = mongoose.model('Duels',DuelSchema);

module.exports = { Duels };