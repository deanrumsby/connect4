/* Note - the game's board state appears rotated by 90deg clockwise 
 * when printing to the screen */

const Connect4 = require('../js/model');
let game = new Connect4();

describe('createBoard', () => {
  test('can create default board of 7x6 in size', () => {
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

describe('currentPlayer', () => {
  test('correctly identifies the current player', () => {
    game.turns = 20; 
    expect(game.currentPlayer()).toBe('x');
  });
});

describe('addCounter', () => {
  test('can add a counter to each column', () => {
    for (let j = 0; j < game.numCols; j++) {
      game.addCounter(j);
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
      game.addCounter(2);
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
    expect(game.addCounter(2)).toBe(1);
  });

  test('returns the correct position of latest placement', () => {
    expect(game.addCounter(4)).toEqual([4, 1]);
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

describe('checkForWin', () => { 
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
    game.lastPosPlayed = [4, 0];
    expect(game.checkForWin()).toBeTruthy();
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
    game.lastPosPlayed = [2, 3];
    expect(game.checkForWin()).toBeTruthy();
  });

  test('correctly identifies a positive diagonal win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , 'o' , 'o' , null, null, null],
      ['o' , 'x' , 'x' , 'o' , 'x' , 'o' ],
      ['x' , 'x' , 'x' , null, null, null],
      ['x' , 'o' , 'o' , 'x' , null, null],
      ['o' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ];
    game.lastPosPlayed = [3, 2];
    expect(game.checkForWin()).toBeTruthy();
  });  

  test('correctly identifies a negative diagonal win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , 'o' , 'o' , 'x' , null, null],
      ['o' , 'o' , 'x' , 'o' , 'x' , 'o' ],
      ['x' , 'x' , 'x' , null, null, null],
      ['x' , 'x' , 'o' , 'x' , null, null],
      ['o' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ];
    game.lastPosPlayed = [1, 3];
    expect(game.checkForWin()).toBeTruthy();
  }); 

  // following test uses the same game board as the above test
  test('correctly identifies non-wins', () => {
    const testPoints = [[0, 0], [2, 0], [3, 2], [2, 5]];
    const results = [];
    for (point of testPoints) {
      game.lastPosPlayed = point
      results.push(game.checkForWin());
    }
    expect(results).toEqual([false, false, false, false]);
  });
});

describe('endTurn', () => {
  test('keeps the correct turn counter', () => {
    game.turns = 0;
    for (let i = 0; i < 6; i++) {
      game.endTurn();
    }
    expect(game.turns).toBe(6);
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