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
    expect(game.addCounter(2)).toBe(null);
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
    expect(game.checkIfFull()).toBeTruthy();
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
    expect(game.checkIfFull()).toBeFalsy();
  });
});

describe('checkForWinlines', () => { 
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
    expect(game.checkForWinlines()).toEqual(['horiz']);
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
    expect(game.checkForWinlines()).toEqual(['vert']);
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
    expect(game.checkForWinlines()).toEqual(['posDiag']);
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
    expect(game.checkForWinlines()).toEqual(['negDiag']);
  }); 

  // following test uses the same game board as the above test
  test('correctly identifies non-wins', () => {
    const testPoints = [[0, 0], [2, 0], [3, 2], [2, 5]];
    const results = [];
    for (point of testPoints) {
      game.lastPosPlayed = point
      results.push(game.checkForWinlines());
    }
    expect(results).toEqual([[], [], [], []]);
  });
});

describe('endTurn', () => {
  test('keeps the correct current player', () => {
    for (let i = 0; i < 6; i++) {
      game.endTurn();
    }
    expect(game.currentPlayer()).toBe('x');
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

describe('playableRowIndices', () => {
  test('provides the correct results', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['o' , 'x' , 'o' , null, null, null],
      ['x' , null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      ['o' , 'x' , null, null, null, null],
      [null, null, null, null, null, null],
    ];
    expect(game.playableRowIndices()).toEqual([1, 3, 1, 0, 0, 2, 0]);
  });
});

describe('grabWinLine', () => {
  test('correctly grabs the win line for a vertical win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['o' , 'x' , 'o' , null, null, null],
      ['x' , 'x' , 'x' , 'x' , null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      ['o' , 'x' , null, null, null, null],
      [null, null, null, null, null, null],
    ];
    game.lastPosPlayed = [2, 3];
    expect(game.getWinlines(['vert'])).toEqual([
      [[2, 3], [2, 2], [2, 1], [2, 0]]
    ]);
  });

  test('correctly grabs the win line for a horizontal win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['o' , 'x' , 'o' , null, null, null],
      ['x' , 'x' , 'x' , 'o' , null, null],
      ['o' , 'x' , null, null, null, null],
      ['o' , 'x' , null, null, null, null],
      ['o' , 'x' , null, null, null, null],
      [null, null, null, null, null, null],
    ];
    game.lastPosPlayed = [5, 1];
    expect(game.getWinlines(['horiz'])).toEqual([
      [[5, 1], [4, 1], [3, 1], [2, 1], [1, 1]]
    ]);
  });

  test('correctly grabs the win line for a pos diagonal win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['o' , 'x' , 'o' , null, null, null],
      ['x' , 'x' , 'x' , 'o' , null, null],
      ['o' , 'x' , null, null, null, null],
      ['o' , 'o' , 'x' , null, null, null],
      ['o' , 'x' , 'o' , 'x' , null, null],
      [null, null, null, null, null, null],
    ];
    game.lastPosPlayed = [4, 2];
    expect(game.getWinlines(['posDiag'])).toEqual([
      [[4, 2], [5, 3], [3, 1], [2, 0]]
    ]);
  });

  test('correctly grabs the win line for a neg diagonal win', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['o' , 'x' , 'o' , 'x' , 'x' , 'x' ],
      ['x' , 'x' , 'o' , 'o' , 'x' , null],
      ['o' , 'o' , 'o' , 'x' , null, null],
      ['o' , 'o' , 'x' , 'o' , 'x' , null],
      ['o' , 'x' , 'o' , 'x' , null, null],
      ['x' , null, null, null, null, null],
    ];
    game.lastPosPlayed = [3, 3];
    expect(game.getWinlines(['negDiag'])).toEqual([
      [[3, 3], [4, 2], [5, 1], [6, 0], [2, 4], [1, 5]]
    ]);
  });
});

describe('nextCounter', () => {
  test('vertical step of one correct', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['o' , 'x' , 'o' , 'x' , 'x' , 'x' ],
      ['x' , 'x' , 'o' , 'o' , 'x' , null],
      ['o' , 'o' , 'o' , 'x' , null, null],
      ['o' , 'o' , 'x' , 'o' , 'x' , null],
      ['o' , 'x' , 'o' , 'x' , null, null],
      ['x' , null, null, null, null, null],
    ];
    game.lastPosPlayed = [2, 2];
    expect(game.nextCounter('vert', 1)).toBe('o');
  });

  test('horizontal step of one correct', () => {
    // using same setup as above
    expect(game.nextCounter('horiz', 1)).toBe('o');
  });

  test('Pos diag step of one correct', () => {
    // using same setup as above
    expect(game.nextCounter('posDiag', 1)).toBe('x');
  });

  test('Neg diag step of one correct', () => {
    // using same setup as above
    expect(game.nextCounter('negDiag', 1)).toBe('o');
  });

  test('Vert step outside boundaries correct', () => {
    // using same setup as above
    expect(game.nextCounter('vert', 5)).toBe(undefined);
  });

  test('Horizontal step out of boundaries correct', () => {
    // using same setup as above
    expect(game.nextCounter('horiz', 5)).toBe(undefined);
  });
});