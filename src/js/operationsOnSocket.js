import * as io from 'socket.io-client';
const socket = io.connect('http://localhost:8081');

socket.on('connect', () => {
    console.log('Connected to Server');
});