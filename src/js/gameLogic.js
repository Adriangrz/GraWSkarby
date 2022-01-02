import { informAboutJoinedPlayer, informAboutGameStart, getValueOfCell } from './operationsOnSocket';
import { displayError } from './errorHandler';

const joinBtn = document.querySelector('.joining-form__button-join');
joinBtn.addEventListener("click", () => {
    name = document.querySelector('.joining-form__input-user-name').value;
    informAboutJoinedPlayer(name);
});
let name = "";
let listOfPlayers = [];
let isGameStart = false;

export function showAllPlayersInRoom(playersListFromServer){
    const joiningForm = document.querySelector('.joining-form');
    joiningForm.remove();
    const gameLobby = document.querySelector('.game-lobby');
    gameLobby.className += " w-100";
    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'game-lobby__button btn btn-secondary';
    playButton.textContent = 'Graj';
    playButton.onclick = () => {
        informAboutGameStart();
    };
    gameLobby.appendChild(playButton);
    if (playersListFromServer.length === 0) return;
    showListOfPlayersInHtml(playersListFromServer);
}

function showListOfPlayersInHtml(playersListToShow){
    if(isGameStart) return;
    const playersList = document.querySelector('.players-list');
    playersListToShow.forEach(playerName => {
        addPlayerToListInHtml(playerName,playersList);
    });
}

function addPlayerToListInHtml(playerName,playerList){
    if(isGameStart) return;
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
    if(!isGameStart){
        const playersList = document.querySelector('.players-list');
        playersList.innerHTML = '';
    }
    showListOfPlayersInHtml(listOfPlayers);
}

export function startGame(){
    const gameLobby = document.querySelector('.game-lobby');
    gameLobby.remove();
    renderGameBoard();
    isGameStart = true;
}

export function endOfGame(winnerOrWinners){
    const gameBoard = document.querySelector('.game-board');
    gameBoard.remove();
    const pageMainContainer = document.querySelector('.page-main__container');
    const winInformation = document.createElement('h3');
    winInformation.className = 'winner-information';
    if(winnerOrWinners.length > 1){
        let winnerText = 'Wygrali';
        for (let winner of winnerOrWinners) {
            winnerText += ` ${winner},`;
        }
        winInformation.textContent = winnerText;
        pageMainContainer.appendChild(winInformation);
        return;
    }
    winInformation.textContent = `Wygrał ${winnerOrWinners[0]}`;
    pageMainContainer.appendChild(winInformation);
}

function renderGameBoard() {
    const gameBoard = document.querySelector('.game-board');
    const turnInformation = document.createElement('h3');
    turnInformation.className = 'game-board__turn-info';
    turnInformation.textContent = 'Czekaj na swoją kolej';
    gameBoard.appendChild(turnInformation);
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
    const turnInformation = document.querySelector('.game-board__turn-info');
    turnInformation.textContent = 'Czekaj na swoją kolej';
    getValueOfCell(numberOfButton);
}

export function showValueOfCell(value, numberOfButton) {
    const cell = document.querySelector(`#game-board__cell-${numberOfButton + 1}`);
    cell.textContent = `${value}`;
}

export function changeTurnInfo(text){
    const turnInformation = document.querySelector('.game-board__turn-info');
    turnInformation.textContent = `${text}`;
}
