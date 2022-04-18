const numCols = 7;
const numRows = 6;
const game = new Connect4(numCols, numRows);

const gameBoard = document.querySelector('#game-board');
gameBoard.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
gameBoard.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
// for (let i = 0; i < numRows; i++) {
//   for (let j = 0; j < numCols; j++) {
//     const cell = document.createElement('div');
//     cell.id = `${i}${j}`;
//   }

function createGameGrid(numRows, numCols, gameBoardElt) {
  // creates a CSS grid for playing connect4
}

gameBoard.addEventListener('click', (e) => {
  console.log(e);
})


