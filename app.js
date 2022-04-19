const game = new Connect4();
const main = document.querySelector('main');
let counter = 'x';
let gameOn = true;

function createBoard(numCols, numRows, parent) {
  // creates the visual game board and returns gameArray - a 2D array that contains
  // a div representing each cell of our game.board attribute
  const gameArray = [];
  const gameBoard = document.createElement('div');
  gameBoard.classList.add('game-board');

  // create each column and add classes
  for (let j = 0; j < numCols; j++) {
    gameArray[j] = [];
    const column = document.createElement('div');
    column.classList.add('game-col');

    // adding a click event listener to each column of the game board
    column.addEventListener('click', () => {
      if (gameOn) {
        clickColumn(j);
      }
    });

    gameBoard.append(column);

    // for each column create each cell and add classes
    for (let i = 0; i < numRows; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      column.append(cell);
      gameArray[j][i] = cell;
    }
  }
  parent.append(gameBoard);
  return gameArray;
}

function clickColumn(j) {
  // when a column is clicked in game
  // first we add a counter to the column and store it's position
  const pos = game.addCounter(counter, j);
  // if the column is full we go no further
  if (pos === 1) {
    return;
  }
  // update the cell visually via the DOM
  updateCell(pos);
  // check if there are any successful win lines
  if (
    game.checkWin(pos, 'horizontal')
    || game.checkWin(pos, 'vertical')
    || game.checkWin(pos, 'diagonal')) {
      endGame();
  }
  // if not, switch the counter to the next player
  if (counter === 'x') {
    counter = 'o';
  } else if (counter === 'o') {
    counter = 'x';
  }

}

function updateCell(pos) {
  // changes a cell red or yellow depending on which player counter it contains
  [j, i] = pos;
  cellCounter = game.board[j][i];
  if (cellCounter === 'x') {
    gameArray[j][i].classList.add('red');
  } else if (cellCounter === 'o') {
    gameArray[j][i].classList.add('yellow');
  }
}

function endGame() {
  gameOn = false;
}

const gameArray = createBoard(game.numCols, game.numRows, main);