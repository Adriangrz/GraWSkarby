const path = require('path');
const gameBoard = require('../models/gameBoard');
const { playersList, playersDetailsList } = require('../models/playersList');
let isGameStart = require('../models/game');

const mainGet = (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
};

const playerJoinedSocket = (io, socket, playerName) => {
    if(playersList){
        socket.emit('listOfPlayers', playersList);
    }
    playersList.push(playerName);
    playersDetailsList.set(socket.id, playerName);
    socket.join('game');
    io.to('game').emit('newPlayerJoined', playerName);
};

const gameStart = (io, socket) => {
    isGameStart = true;
    createGameBoard();
    io.to('game').emit('gameStart');
};

const disconnectFromGame = (io, socket) => {
    let playerName = playersDetailsList.get(socket.id);
    console.log(playerName);
    if(!playerName){
        return;
    }
    const index = playersList.indexOf(playerName);
    if (index > -1) {
        playersList.splice(index, 1);
    }
    playersDetailsList.delete(socket.id);
    io.to('game').emit('playerLeftGame',playersList);
};

function createGameBoard(){
    let availableFields = [];
    for (let i = 0; i < 100; i++) {
        availableFields.push(i);
        gameBoard.push('');
    }

    for (let i = 0; i < 100; i++) {
        let index = Math.floor(Math.random()*availableFields.length);
        if(i < 40){
            gameBoard[availableFields[index]] = Math.floor(Math.random() * 10) + 1;
        }
        if(i >= 40 && i < 50){
            gameBoard[availableFields[index]] = 'P';
        }
        if (index > -1) {
            availableFields.splice(index, 1);
        }
    }
}

const getValueOfCell =(io, socket, numberOfButton) => {
    io.to('game').emit('cellValue', gameBoard[numberOfButton], numberOfButton);
};

module.exports = {
    mainGet,
    playerJoinedSocket,
    getValueOfCell,
    gameStart,
    disconnectFromGame,
};
