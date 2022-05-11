const Model = require('../js/cleanModel');
let game;

describe('createBoard', () => {
  beforeAll(() => {
    game = new Model();
  });

  test('can create a default board of 7x6', () => {
    expect(game.createBoard()).toEqual([
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
  beforeAll(() => {
    game = new Model();
  });

  test('can add counters to each column', () => {
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

  test('can stack counters in columns', () => {
    const columns = [3, 5, 3, 0, 0, 0, 0];
    for (let j of columns) {
      game.addCounter(j);
    }
    expect(game.board).toEqual([
      ['x' , 'x' , 'x' , 'x' , 'x' , null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , 'x' , 'x' , null, null, null],
      ['x' , null, null, null, null, null],
      ['x' , 'x' , null, null, null, null],
      ['x' , null, null, null, null, null],
    ]);
  });

  test('returns the correct coordinates when successful', () => {
    expect(game.addCounter(2)).toEqual([2, 1]);
  });

  test('returns null when attempting to add counter to full column', () => {
    game.addCounter(0);
    expect(game.addCounter(0)).toBe(null);
  });
});

describe('currentPlayer', () => {
  beforeAll(() => {
    game = new Model();
  });

  test('identifies the current player', () => {
    game.counters = ['o', 'x'];
    expect(game.currentPlayer()).toBe('o');
  });
});

describe('changePlayer', () => {
  beforeAll(() => {
    game = new Model();
  });
  
  test('cycles players correctly', () => {
    for (let t = 0; t < 7; t++) {
      game.changePlayer()
    }
    expect(game.counters).toEqual(['o', 'x']);
  });
});

describe('findWinlines', () => {
  beforeEach(() => {
    game = new Model();
  });

  test('finds vertical winline', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , 'o' , 'o' , 'o' , null, null],
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
    ];
    game.findWinlines([4, 1]);
    expect(game.winlines).toEqual([[[4, 1], [4, 2], [4, 3], [4, 0]]]);
  });

  test('finds horizontal winline', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , null, null, null, null, null],
      ['x' , 'o' , 'x' , null, null, null],
      ['o' , 'o' , 'x' , 'o' , null, null],
      ['x' , 'o' , 'x' , null, null, null],
      ['x' , 'x' , 'x' , null, null, null],
    ];
    game.findWinlines([6, 2]);
    expect(game.winlines).toEqual([[[6, 2], [5, 2], [4, 2], [3, 2]]]);
  });

  test('finds winline on positive diagonal', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , null, null, null, null, null],
      ['x' , 'o' , 'x' , null, null, null],
      ['o' , 'o' , 'o' , 'x' , null, null],
      ['x' , 'o' , 'x' , 'o' , null, null],
      ['x' , 'x' , 'x' , null, null, null],
    ];
    game.findWinlines([2, 0]);
    expect(game.winlines).toEqual([[[2, 0], [3, 1], [4, 2], [5, 3]]]);
  });

  test('finds winline on negative diagonal', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , 'o' , 'x' , 'x' , 'o' , null],
      ['x' , 'x' , 'x' , 'o' , null, null],
      ['o' , 'o' , 'o' , 'x' , null, null],
      ['x' , 'o' , 'x' , 'o' , null, null],
      ['x' , 'x' , 'x' , null, null, null],
    ];
    game.findWinlines([3, 3]);
    expect(game.winlines).toEqual([[[3, 3], [4, 2], [5, 1], [2, 4]]]);
  });

  test('finds multiple winlines at once', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , 'o' , 'x' , 'o' , 'o' , null],
      ['x' , 'x' , 'x' , 'o' , null, null],
      ['o' , 'o' , 'o' , 'o' , null, null],
      ['x' , 'x' , 'x' , 'o' , null, null],
      ['x' , 'x' , 'x' , null, null, null],
    ];
    game.findWinlines([4, 3]);
    expect(game.winlines).toEqual([
      [[4, 3], [4, 2], [4, 1], [4, 0]],
      [[4, 3], [5, 3], [3, 3], [2, 3]]
    ]);
  });

  test('finds winlines of length greater than four', () => {
    game.board = [
      ['x' , null, null, null, null, null],
      ['x' , null, null, null, null, null],
      ['o' , 'o' , 'x' , 'x' , 'o' , null],
      ['x' , 'x' , 'x' , 'o' , null, null],
      ['o' , 'o' , 'o' , 'o' , 'o' , 'o' ],
      ['x' , 'x' , 'x' , 'o' , null, null],
      ['x' , 'x' , 'x' , null, null, null],
    ];
    game.findWinlines([4, 0]);
    expect(game.winlines).toEqual([[[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]]]);
  });
});