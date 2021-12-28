const game = document.querySelector('.game-board');
for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    const cellButton = document.createElement('button');
    cellButton.type = 'button';
    cellButton.className = 'game-board__button btn btn-secondary';
    cellButton.textContent = `${i + 1}`;
    cell.className = 'game-board__cell col';
    cell.appendChild(cellButton);
    game.appendChild(cell);
}
