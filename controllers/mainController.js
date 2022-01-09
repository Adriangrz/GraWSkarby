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
    const player = new Player({
        socketId: socket.id,
        name: playerName,
        points: 0,
    });
    await player.save();
    socket.join('game');
    io.to('game').emit('newPlayerJoined', playerName);
};

const gameStart = async (io, socket) => {
    isGameStart = true;
    createGameBoard();
    io.to('game').emit('gameStart');
    playerInThisTurn = await Player.findOne({ socketId: socket.id }, 'name');
    socket.emit('yourTurn');
    countToEnd = setTimeout(() => {
        endOfGame(io, socket);
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

async function endOfGame(io, socket) {
    if (!isGameStart) return;
    clearTimeout(countToEnd);
    isGameStart = false;
    let max = 0;
    let winners = [];
    let players = await Player.find().sort({ points: -1 }).limit(2);
    players.forEach((element) => {
        if (element.points === max) {
            winners.push(element.name);
        }
        if (element.points > max) {
            winners = [];
            winners.push(element.name);
            max = element.points;
        }
    });
    io.to('game').emit('endOfGame', winners);
    await Player.deleteMany({});
    await GameBoard.deleteMany({});
}

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
    for (let i = 0; i < 100; i++) {
        const gameBoard = new GameBoard({ number: i, value: board[i].toString() });
        await gameBoard.save();
    }
}

const getValueOfCell = async (io, socket, numberOfButton) => {
    let player = await Player.findOne({ socketId: socket.id });
    if (!socket.rooms.has('game') || !isGameStart || player.name !== playerInThisTurn.name) return;
    socket.broadcast.to('game').emit('cellWasDiscovered', numberOfButton);
    let cell = await GameBoard.findOne({ number: numberOfButton });
    socket.emit('cellValue', cell.value, numberOfButton);
    if (cell.value === '') cell.value = 0;
    if (cell.value === 'P') {
        await Player.deleteOne({ name: playerInThisTurn.name });
        socket.emit('defeatByMonster');
    } else {
        let currentPoints = player.points;
        player.points = currentPoints + parseInt(cell.value);
        await player.save();
    }
    let numberOfPlayers = await Player.count({});
    if (numberOfPlayers <= 1) {
        endOfGame(io, socket);
        return;
    }
    let nextPlayer = await Player.findOne({ _id: { $gt: player._id } }).sort({ _id: 1 });
    if (!nextPlayer) nextPlayer = await Player.findOne({}).sort({ _id: 1 });
    playerInThisTurn = nextPlayer;
    socket.broadcast.to(nextPlayer.socketId).emit('yourTurn');
};

module.exports = {
    mainGet,
    playerJoinedSocket,
    getValueOfCell,
    gameStart,
    disconnectFromGame,
};
