const path = require('path');
const { gameBoard } = require('../models/gameBoard');
let { nameOfPlayerIndexInThisTurn } = require('../models/gameBoard');
const { playersList, playersDetailsList } = require('../models/playersList');
let isGameStart = require('../models/game');

const mainGet = (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
};

const playerJoinedSocket = (io, socket, playerName) => {
    if (playersList.includes(playerName)) return;
    if (playersList) socket.emit('listOfPlayers', playersList);
    playersList.push(playerName);
    playersDetailsList.set(socket.id, playerName);
    socket.join('game');
    io.to('game').emit('newPlayerJoined', playerName);
};

const gameStart = (io, socket) => {
    isGameStart = true;
    createGameBoard();
    io.to('game').emit('gameStart');
    nameOfPlayerIndexInThisTurn = playersList.indexOf(playersDetailsList.get(socket.id));
    socket.emit('yourTurn');
};

const disconnectFromGame = (io, socket) => {
    let playerName = playersDetailsList.get(socket.id);
    if (!playerName) {
        return;
    }
    const index = playersList.indexOf(playerName);
    if (index > -1) {
        playersList.splice(index, 1);
    }
    playersDetailsList.delete(socket.id);
    io.to('game').emit('playerLeftGame', playersList);
};

function createGameBoard() {
    let availableFields = [];
    for (let i = 0; i < 100; i++) {
        availableFields.push(i);
        gameBoard.push('');
    }

    for (let i = 0; i < 100; i++) {
        let index = Math.floor(Math.random() * availableFields.length);
        if (i < 40) {
            gameBoard[availableFields[index]] = Math.floor(Math.random() * 10) + 1;
        }
        if (i >= 40 && i < 50) {
            gameBoard[availableFields[index]] = 'P';
        }
        if (index > -1) {
            availableFields.splice(index, 1);
        }
    }
}

const getValueOfCell = (io, socket, numberOfButton) => {
    if (
        !socket.rooms.has('game') ||
        !isGameStart ||
        playersDetailsList.get(socket.id) !== playersList[nameOfPlayerIndexInThisTurn]
    )
        return;
    socket.broadcast.to('game').emit('cellWasDiscovered', numberOfButton);
    socket.emit('cellValue', gameBoard[numberOfButton], numberOfButton);
    if (nameOfPlayerIndexInThisTurn < (playersList.length-1)) nameOfPlayerIndexInThisTurn++;
    else nameOfPlayerIndexInThisTurn = 0;
    playersDetailsList.forEach(function (value, key) {
        if (playersList[nameOfPlayerIndexInThisTurn] === value) {
            socket.broadcast.to(key).emit('yourTurn');
            return;
        }
    });
};

module.exports = {
    mainGet,
    playerJoinedSocket,
    getValueOfCell,
    gameStart,
    disconnectFromGame,
};
