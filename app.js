const numCols = 7;
const numRows = 6;
const game = new Connect4(numCols, numRows);
const gameBoard = document.querySelector('#game-board');

function createBoard(numCols, numRows, container) {
  container.classList.add('game-board');
  for (let j = 0; j < numCols; j++) {
    const column = document.createElement('div');
    column.classList.add('game-col');
    container.append(column);
    for (let i = 0; i < numRows; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      column.append(cell);
    }
  }
}

createBoard(numCols, numRows, gameBoard);