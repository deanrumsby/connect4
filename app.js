const game = new Connect4();
const main = document.querySelector('main');
let counter = 'x';

function createBoard(numCols, numRows, parent) {
  // Creates the visual grid on which the game is played
  // Adds event listeners to each column that will add a counter when clicked
  // Returns an array 'gameArray' that is a DOM rep of our game.board attribute
  const gameArray = [];
  const gameBoard = document.createElement('div');
  gameBoard.classList.add('game-board');
  for (let j = 0; j < game.numCols; j++) {
    gameArray[j] = [];
    const column = document.createElement('div');
    column.classList.add('game-col');
    column.addEventListener('click', () => {
      const pos = game.addCounter(counter, j);
      if (pos === 1) {
        return;
      }
      updateCell(pos);
      if (
        game.checkWin(pos, 'horizontal')
        || game.checkWin(pos, 'vertical')
        || game.checkWin(pos, 'diagonal')) 
        {
          console.log('WINNER FOUND!');
        }
      if (counter === 'x') {
        counter = 'o';
      } else if (counter === 'o') {
        counter = 'x';
      }
    });
    gameBoard.append(column);
    for (let i = 0; i < game.numRows; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      column.append(cell);
      gameArray[j][i] = cell;
    }
  }
  parent.append(gameBoard);
  return gameArray;
}

function updateCell(pos) {
  [j, i] = pos;
  cellCounter = game.board[j][i];
  if (cellCounter === 'x') {
    gameArray[j][i].classList.add('red');
  } else if (cellCounter === 'o') {
    gameArray[j][i].classList.add('yellow');
  }
}

const gameArray = createBoard(game.numCols, game.numRows, main);