import { informAboutJoinedPlayer, informAboutGameStart, getValueOfCell } from './operationsOnSocket';
import { displayError } from './errorHandler';

const joinBtn = document.querySelector('.joining-form__button-join');
joinBtn.addEventListener("click", showAllPlayersInRoom);
let name = "";
let listOfPlayers = [];

function showAllPlayersInRoom(){
    name = document.querySelector('.joining-form__input-user-name').value;
    const joiningForm = document.querySelector('.joining-form');
    joiningForm.remove();
    informAboutJoinedPlayer(name);
    const pageMainContainer = document.querySelector('.game-lobby');
    pageMainContainer.className += " w-100";
    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'game-lobby__button btn btn-secondary';
    playButton.textContent = 'Graj';
    playButton.onclick = () => {
        informAboutGameStart();
    };
    pageMainContainer.appendChild(playButton);
}

export function showListOfPlayersInHtml(playersListToShow){
    const playersList = document.querySelector('.players-list');
    playersListToShow.forEach(playerName => {
        addPlayerToListInHtml(playerName,playersList);
    });
}

function addPlayerToListInHtml(playerName,playerList){
    const listItem = document.createElement('li');
    listItem.className = 'players-list__item list-group-item text-center';
    listItem.textContent = `${playerName}`;
    playerList.appendChild(listItem);
}

export function addPlayerToList(playerName){
    const playersList = document.querySelector('.players-list');
    listOfPlayers.push(playerName);
    addPlayerToListInHtml(playerName,playersList);
}

export function deletePlayerFromList(playersListFromServer){
    listOfPlayers = playersListFromServer;
    const playersList = document.querySelector('.players-list');
    playersList.innerHTML = '';
    showListOfPlayersInHtml(listOfPlayers);
}

export function startGame(){
    const pageMainContainer = document.querySelector('.game-lobby');
    pageMainContainer.remove();
    renderGameBoard();
}

function renderGameBoard() {
    const gameBoard = document.querySelector('.game-board');
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        const cellButton = document.createElement('button');
        cellButton.type = 'button';
        cellButton.className = 'game-board__button btn btn-secondary';
        cellButton.id = `game-board__button-${i + 1}`;
        cellButton.textContent = `${i + 1}`;
        cellButton.onclick = () => {
            cellButtonClick(i);
        };
        cell.id = `game-board__cell-${i + 1}`;
        cell.className = 'game-board__cell col';
        cell.appendChild(cellButton);
        gameBoard.appendChild(cell);
    }
}

function cellButtonClick(numberOfButton) {
    getValueOfCell(numberOfButton);
}

export function showValueOfCell(value, numberOfButton) {
    const cell = document.querySelector(`#game-board__cell-${numberOfButton + 1}`);
    cell.textContent = `${value}`;
}
