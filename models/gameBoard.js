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

gameBoardSchema.statics.saveGameBoard = async (sizeOfBoard,board) =>{
    for (let i = 0; i < sizeOfBoard; i++) {
        const gameBoard = new GameBoard({ number: i, value: board[i].toString() });
        await gameBoard.save();
    }
}

const GameBoard = mongoose.model('GameBoard', gameBoardSchema);
module.exports = GameBoard;
