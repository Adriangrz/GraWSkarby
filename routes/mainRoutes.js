const express = require('express');
const mainController = require('../controllers/mainController');

const router = express.Router();

router.get('/', mainController.mainGet);

const mainRoutesSocket = (io, socket) => {
    socket.on('playerJoined', (playerName) => {
        mainController.playerJoinedSocket(io, socket, playerName);
    });
    socket.on('gameStart', () => {
        mainController.gameStart(io, socket);
    });
    socket.on('getValueOfCell', (numberOfButton) => {
        mainController.getValueOfCell(io, socket, numberOfButton);
    });
    socket.on('disconnect', () => {
        mainController.disconnectFromGame(io, socket);
    });
};

module.exports = {
    router,
    mainRoutesSocket,
};
