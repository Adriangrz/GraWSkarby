const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameBoardSchema = new Schema({
    number: {
        type: Number
    },
    value: {
        type: String
    }
});

const GameBoard = mongoose.model('GameBoard', gameBoardSchema);
module.exports = GameBoard;
