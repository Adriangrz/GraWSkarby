const express = require('express');
const path = require('path');
const socketIO = require('socket.io');

const mainRoutes = require('./routes/mainRoutes');

const app = express();
const server = app.listen(8081);
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