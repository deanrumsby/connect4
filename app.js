function createBoard(parent) {
  // creates the visual game board and returns gameArray - a 2D array that contains
  // a div representing each cell of our game.board attribute
  const gameArray = [];
  const gameBoard = document.createElement('div');
  gameBoard.classList.add('game-board');

  // create each column and add classes
  for (let j = 0; j < game.numCols; j++) {
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
    for (let i = 0; i < game.numRows; i++) {
      const cell = document.createElement('div');
      const hole = document.createElement('div');
      cell.classList.add('cell');
      hole.classList.add('hole');
      cell.append(hole);
      column.append(cell);

      gameArray[j][i] = hole;
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
  // or if the board is full
  if (
    game.checkWin(pos, 'horizontal')
    || game.checkWin(pos, 'vertical')
    || game.checkWin(pos, 'diagonal')
    || game.checkFull()) {
      endGame();
  }
  // if not, switch the counter to the next player
  switch (counter) {
    case 'x':
      counter = 'o';
      break;
    case 'o':
      counter = 'x';
  }

}

function updateCell(pos) {
  // changes a cell red or yellow depending on which player counter it contains
  [j, i] = pos;
  cellCounter = game.board[j][i];
  if (cellCounter === 'x') {
    gameArray[j][i].style.backgroundColor = 'red';
  } else if (cellCounter === 'o') {
    gameArray[j][i].style.backgroundColor = 'yellow';
  }
}

function endGame() {
  // halts the game and adds key down event listener to reset the board
  // declares the winner underneath the game
  gameOn = false;
  document.addEventListener('keydown', reset);
  const winnerText = document.createElement('p');
  winnerText.id = 'winner-text';
  let winner
  switch (counter) {
    case 'x':
      winner = 'RED';
      break;
    case 'o':
      winner = 'YELLOW';
      break;
  }
  const resultContainer = document.createElement('div');
  resultContainer.id = 'results';
  resultContainer.classList.add('results');
  if (game.checkFull()) {
    winnerText.innerText = 'The game is a draw!';
  } else {
    winnerText.innerText = `${winner} is the winner!`;
  }
  const resetText = document.createElement('p');
  resetText.id = 'reset-text';
  resetText.innerText = 'Press any key to reset the game.';
  resultContainer.append(winnerText);
  resultContainer.append(resetText);
  main.append(resultContainer);
}

function reset() {
  // resets the board, removes the winner declaration and continues play
  game.reset();
  for (column of gameArray) {
    for (hole of column) {
      hole.style.backgroundColor = 'var(--body-bgcolor)';
    }
  }
  gameOn = true;
  document.removeEventListener('keydown', reset);
  const resultContainer = document.querySelector('#results');
  resultContainer.remove(); 
}

let counter = 'x';
let gameOn = true;
const game = new Connect4();
const main = document.querySelector('main');
const gameArray = createBoard(main);