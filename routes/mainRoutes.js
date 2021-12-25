const express = require('express');
const mainController = require('../controllers/mainController');

const router = express.Router();

router.get('/', mainController.mainGet);

const mainRoutesSocket = (io, socket) => {
    socket.on("test", mainController.testSocket);
}

module.exports = {
    router,
    mainRoutesSocket,
}
