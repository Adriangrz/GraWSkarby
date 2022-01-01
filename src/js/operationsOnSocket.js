import * as io from 'socket.io-client';
import {
    addPlayerToList,
    showListOfPlayersInHtml,
    startGame,
    deletePlayerFromList,
    showValueOfCell,
} from './gameLogic';
const socket = io.connect('http://localhost:8081');

socket.on('connect', () => {});
socket.on('newPlayerJoined', (playerName) => onPlayerJoined(playerName));
socket.on('listOfPlayers', (playersListFromServer) => onPlayersList(playersListFromServer));
socket.on('gameStart', () => startGame());
socket.on('playerLeftGame', (playersList) => onPlayerLeftGame(playersList));
socket.on('cellValue', (valueOfCell, numberOfButton) =>
    showValueOfCell(valueOfCell, numberOfButton)
);

export function informAboutCell(numberOfCell) {
    socket.emit('selectedCell', numberOfCell);
}

function onPlayersList(playersListFromServer) {
    if (playersListFromServer.length == 0) return;
    showListOfPlayersInHtml(playersListFromServer);
}

function onPlayerJoined(playerName) {
    addPlayerToList(playerName);
}

function onPlayerLeftGame(playersList) {
    deletePlayerFromList(playersList);
}

export function getValueOfCell(numberOfButton) {
    socket.emit('getValueOfCell', numberOfButton);
}

export function informAboutGameStart() {
    socket.emit('gameStart');
}

export function informAboutJoinedPlayer(playerName) {
    socket.emit('playerJoined', playerName);
}
