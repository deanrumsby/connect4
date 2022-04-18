// Note - the game's board state appears upside down when printing to the screen

const numRows = 6;
const numCols = 7;
const Connect4 = require('./connect4');

let game = new Connect4(6, 7);

describe('addCounter', () => {
  test('i can add a counter to each column', () => {
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

  test('returns the correct position of latest placement', () => {
    expect(game.addCounter('o', 4)).toEqual([1, 4]);
  });
});

game = new Connect4(6, 7); 

describe('checkWin', () => {
  test('correctly identifies a horizontal win', () => {
    game.board = [
      ['x' , 'o' , 'o' , 'x' , 'o' , 'x' , 'x' ],
      [null, null, 'o' , 'o',  'o' , 'o' , null],
      [null, null, 'o' , null, null, null, null],
      [null, null, 'x' , null, null, null, null],
      [null, null, 'o' , null, null, null, null],
      [null, null, null, null, null, null, null],
    ]
    expect(game.checkWin([1, 5], 'horizontal')).toBeTruthy();
  });
});


