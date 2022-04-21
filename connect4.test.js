/* Note - the game's board state appears rotated by 90deg when printing to the screen */

const Connect4 = require('./connect4');
let game = new Connect4();

describe('createBoard', () => {
  test('can create default board of 7x6 in size', () =>{
    game.createBoard();
    expect(game.board).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ]);
  });
});

describe('addCounter', () => {
  test('can add a counter to each column', () => {
    for (let j = 0; j < game.numCols; j++) {
      game.addCounter('x', j);
    }
    expect(game.board).toEqual([
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ]);
  });
  
  test('can stack counters in a column', () => {
    for (let i = 0; i < 5; i++) {
      game.addCounter('x', 2);
    }
    expect(game.board).toEqual([
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , 'x' , 'x' , 'x' , 'x' , 'x' ],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ]);
  });
  
  test('gets the right return code when trying to put a counter in a full column', () => {
    expect(game.addCounter('x', 2)).toBe(1);
  });

  test('returns the correct position of latest placement', () => {
    expect(game.addCounter('o', 4)).toEqual([4, 1]);
  });
});

describe('checkFull', () => {
  test('correctly asserts when the board is full', () => {
    game.board = [
      ['x' , 'x' , 'o' , 'x' , 'o' , 'x' ],
      ['x' , 'o' , 'o' , 'x' , 'x' , 'x' ],
      ['o' , 'x' , 'x' , 'o' , 'x' , 'o' ],
      ['x' , 'x' , 'o' , 'o' , 'o' , 'o' ],
      ['x' , 'x' , 'o' , 'x' , 'o' , 'o' ],
      ['o' , 'x' , 'o' , 'x' , 'x' , 'x' ],
      ['x' , 'x' , 'o' , 'o' , 'o' , 'x' ],
    ];
    expect(game.checkFull()).toBeTruthy();
  });

  test('correctly asserts when the board is not full', () => {
    game.board = [
      ['x' , 'x' , 'o' , 'x' , 'o' , 'x' ],
      ['x' , 'o' , 'o' , 'x' , 'x' , 'x' ],
      ['o' , 'x' , 'x' , 'o' , 'x' , null],
      ['x' , 'x' , 'o' , 'o' , 'o' , 'o' ],
      ['x' , 'x' , 'o' , 'x' , 'o' , 'o' ],
      ['o' , 'x' , 'o' , 'x' , 'x' , 'x' ],
      ['x' , 'x' , 'o' , 'o' , 'o' , 'x' ],
    ];
    expect(game.checkFull()).toBeFalsy();
  });
});

describe('checkWin', () => { 
  test('correctly identifies a horizontal win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , 'x' , 'o' , 'x' , 'x' , 'x' ],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ];
    expect(game.checkWin([4, 0], 'horizontal')).toBeTruthy();
  });

  test('correctly identifies a vertical win', () => {
    game.board = [
      ['o' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , 'o' , 'x' , 'x' , 'x' , 'x' ],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ];
    expect(game.checkWin([2, 3], 'vertical')).toBeTruthy();
  });

  test('correctly identifies a diagonal win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , 'o' , 'o' , null, null, null],
      ['o' , 'x' , 'x' , 'o' , 'x' , 'o' ],
      ['x' , 'x' , 'o' , null, null, null],
      ['x' , 'o' , null, null, null, null],
      ['o' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ];
    expect(game.checkWin([5, 0], 'diagonal')).toBeTruthy();
  });  

  test('correctly identifies a diagonal win in the other direction', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , 'o' , 'o' , null, null, null],
      ['o' , 'x' , 'x' , 'o' , 'x' , 'o' ],
      ['x' , 'x' , 'x' , null, null, null],
      ['x' , 'x' , 'o' , 'x' , null, null],
      ['o' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ];
    expect(game.checkWin([4, 3], 'diagonal')).toBeTruthy();
  }); 

// following tests use the same game board as the above test
  test('correctly identifies a horizontal non-win', () => {
    expect(game.checkWin([0, 0], 'horizontal')).toBeFalsy();
  });

  test('correctly identifies a vertical non-win', () => {
    expect(game.checkWin([2, 2], 'vertical')).toBeFalsy();
  });

  test('correctly identifies a diagonal non-win', () => {
    expect(game.checkWin([1, 2], 'diagonal')).toBeFalsy();
  });
});

describe('reset', () => {
  test('the board resets correctly', () => {
    game.reset();
    expect(game.board).toEqual([
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ]);
  });
});