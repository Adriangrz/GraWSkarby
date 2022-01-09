const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const mainRoutes = require('./routes/mainRoutes');
const dbURL = 'mongodb://localhost:27017/TreasureGame';
const Player = require('./models/player');
const GameBoard = require('./models/gameBoard');

const app = express();

const server = app.listen(8081);

mongoose
    .connect(dbURL)
    .then(async (result) => { 
        console.log("connected to database");
        await Player.deleteMany({});
        await GameBoard.deleteMany({});
    })
    .catch((err) => console.log(err));


//to delete second parameter
const io = socketIO(server, { cors: { origin: '*' } });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'dist/js')));
app.use('/styles', express.static(path.join(__dirname, 'dist/styles')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/nowy');
});
app.use('/nowy', mainRoutes.router);

const onConnection = (socket) => {
    mainRoutes.mainRoutesSocket(io, socket);
};

io.on('connection', onConnection);
