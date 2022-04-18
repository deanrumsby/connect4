// Note - the game's board state appears upside down when printing to the screen

const numRows = 6;
const numCols = 7;
const Connect4 = require('./connect4');

let game = new Connect4(6, 7);

test('can i add a counter to each column', () => {
  for (let j = 0; j < numCols; j++) {
    game.addCounter('x', j);
  }
  expect(game.board).toEqual([
    ['x' , 'x' , 'x' , 'x' , 'x' , 'x' , 'x' ],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ]);
});

test('i can stack counters in a column', () => {
  for (let i = 0; i < 5; i++) {
    game.addCounter('x', 2);
  }
  expect(game.board).toEqual([
    ['x' , 'x' , 'x' , 'x' , 'x' , 'x' , 'x' ],
    [null, null, 'x' , null, null, null, null],
    [null, null, 'x' , null, null, null, null],
    [null, null, 'x' , null, null, null, null],
    [null, null, 'x' , null, null, null, null],
    [null, null, 'x' , null, null, null, null],
  ]);
});

test('i get the right return code when trying to put a counter in a full column', () => {
  expect(game.addCounter('x', 2)).toBe(1);
});