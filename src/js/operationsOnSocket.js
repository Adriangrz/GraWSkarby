import * as io from 'socket.io-client';
import {
    addPlayerToList,
    startGame,
    deletePlayerFromList,
    showValueOfCell,
    showAllPlayersInRoom,
    changeTurnInfo,
    endOfGame,
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
socket.on('cellWasDiscovered', (numberOfButton) => showValueOfCell('', numberOfButton));
socket.on('yourTurn', () => changeTurnInfo('Twoja tura'));
socket.on('defeatByMonster', () => changeTurnInfo('Zostałeś pokonany przez potwora'));
socket.on('endOfGame', (winnerOrWinners) => endOfGame(winnerOrWinners));

function onPlayersList(playersListFromServer) {
    showAllPlayersInRoom(playersListFromServer);
}

function onPlayerJoined(playerName) {
    addPlayerToList(playerName);
}

function onPlayerLeftGame(playersList) {
    deletePlayerFromList(playersList);
}


export function informAboutJoinedPlayer(playerName) {
    socket.emit('playerJoined', playerName);
}

export function informAboutGameStart() {
    socket.emit('gameStart');
}

export function getValueOfCell(numberOfButton) {
    socket.emit('getValueOfCell', numberOfButton);
}

export function informAboutCell(numberOfCell) {
    socket.emit('selectedCell', numberOfCell);
}