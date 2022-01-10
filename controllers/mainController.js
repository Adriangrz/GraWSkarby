const path = require('path');
let { isGameStart, playerInThisTurn } = require('../models/game');
const Player = require('../models/player');
const GameBoard = require('../models/gameBoard');

let countToEnd;

const mainGet = (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
};

const playerJoinedSocket = async (io, socket, playerName) => {
    if (await Player.findOne({ name: playerName })) return;
    const players = await Player.find({}, '-_id name');
    if (players) socket.emit('listOfPlayers', players);
    await Player.addPlayer(socket.id,playerName,0);
    socket.join('game');
    io.to('game').emit('newPlayerJoined', playerName);
};

const gameStart = async (io, socket) => {
    isGameStart = true;
    createGameBoard();
    io.to('game').emit('gameStart');
    playerInThisTurn = await Player.findOne({ socketId: socket.id });
    socket.emit('yourTurn');
    countToEnd = setTimeout(() => {
        endOfGame(io);
    }, 240000);
};

const disconnectFromGame = async (io, socket) => {
    let playerName = await Player.findOne({ socketId: socket.id }, 'name');
    if (!playerName) {
        return;
    }
    Player.deleteOne({ socketId: socket.id });
    io.to('game').emit('playerLeftGame', await Player.find({}, 'name'));
};

const getValueOfCell = async (io, socket, numberOfButton) => {
    if (!socket.rooms.has('game') || !isGameStart || socket.id !== playerInThisTurn.socketId) return;
    socket.broadcast.to('game').emit('cellWasDiscovered', numberOfButton);
    let cell = await GameBoard.findOne({ number: numberOfButton });
    socket.emit('cellValue', cell.value, numberOfButton);
    if (cell.value === '') cell.value = 0;
    if (cell.value === 'P') {
        await Player.deleteOne({ name: playerInThisTurn.name });
        socket.emit('defeatByMonster');
    } else {
        await Player.addPointsToPlayer(socket.id,cell.value);
    }
    if ((await Player.count({})) <= 1) {
        endOfGame(io);
        return;
    }
    let nextPlayer = await Player.findNextPlayer(socket.id);
    playerInThisTurn = nextPlayer;
    socket.broadcast.to(nextPlayer.socketId).emit('yourTurn');
};

async function createGameBoard() {
    let availableFields = [];
    let board = [];
    for (let i = 0; i < 100; i++) {
        availableFields.push(i);
        board.push('');
    }

    for (let i = 0; i < 100; i++) {
        let index = Math.floor(Math.random() * availableFields.length);
        if (i < 40) {
            board[availableFields[index]] = Math.floor(Math.random() * 10) + 1;
        }
        if (i >= 40 && i < 50) {
            board[availableFields[index]] = 'P';
        }
        if (index > -1) {
            availableFields.splice(index, 1);
        }
    }
    await GameBoard.saveGameBoard(100,board);
}

async function endOfGame(io) {
    if (!isGameStart) return;
    clearTimeout(countToEnd);
    isGameStart = false;
    let winners = await Player.getPlayerOrPlayersWithMaxPoints();
    io.to('game').emit('endOfGame', winners);
    await Player.deleteMany({});
    await GameBoard.deleteMany({});
}

module.exports = {
    mainGet,
    playerJoinedSocket,
    getValueOfCell,
    gameStart,
    disconnectFromGame,
};
