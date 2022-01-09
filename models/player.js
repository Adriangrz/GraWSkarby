const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    socketId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number
    }
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;