/**
 * All the main logic for playing a game of Connect4.
 */
class Connect4 {
  /**
   * @param {number} numCols The number of columns of our game's board.
   * @param {number} numRows The number of rows of our game's board.
   */
  constructor(numCols = 7, numRows = 6) {
    /**
     * The number of columns of our game's board.
     * @type {number}
     */
    this.numCols = numCols;

    /**
     * The number of rows of our game's board.
     * @type {number}
     */
    this.numRows = numRows;

    /**
     * The number of turns that have been played.
     * @type {number}
     */
    this.turns = 0;

    /**
     * The most recently occupied position on the board.
     * @type {null|Array<number>}
     */
    this.lastPosPlayed = null
    
    /**
     * The player counters.
     * @type {Array<string>}
     */ 
    this.counters = ['x', 'o'];
  
    /**
     * Holds the state of the game's board. A 2D array.
     * @type {Array<Array<null>>}
     */
    this.board = this.createBoard();
  }
  
  /**
   * Creates a 2D array that serves as our game's board.
   * Our first index j corresponds to the column number of the board.
   * The second index i corresponds to the row number of the board.
   * For example - this.board[3][4] represents the cell on the fourth column and 
   *  fifth row of the board (we start counting at 0).
   * @returns {Array<Array<null>>} Our 2D array, representing the game's empty board.
   */
  createBoard() {
    const board = []
    for (let j = 0; j < this.numCols; j++) {
      board[j] = [];
      for (let i = 0; i < this.numRows; i++) {
        board[j][i] = null;
      }
    }
    return board;
  }

  /**
   * Returns the current player's counter
   * @returns {string} The current player's counter.
   */
  currentPlayer() {
    return this.counters[this.turns % 2];
  }

  /**
   * Ends the current turn - checks for a winner or if the board is full.
   * Then increments the turn counter by one.
   * @returns {string} The winner.
   */
  endTurn() {
    if (this.checkForWin()) {
      return this.currentPlayer();
    } else if (this.checkIfFull()) {
      return 'draw';
    }
    this.turns++;
  }

  /**
   * Adds the current player's counter to a given column on the board.
   * Sets this.lastPosPlayed with the resulting coordinates.
   * @param {number} j The column number to which we are adding a counter. 
   * @returns {Array<number>|null} The coordinates of the placed counter [j, i]; or null if the 
   *  column is full.
   */
  addCounter(j) {
    for (let i = 0; i < this.numRows; i++) {
      if (this.board[j][i] === null) {
        this.board[j][i] = this.currentPlayer();
        this.lastPosPlayed = [j, i];
        return [j, i];
      }
    }
    return null;
  }

  /**
   * Checks if the board is full with player counters.
   * @returns {boolean} If the board is full, or not.
   */
   checkIfFull() {
    for (let j = 0; j < this.numCols; j++) {
      if (this.board[j][this.numRows - 1] === null) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks for a win on all possible win lines that pass through this.lastPosPlayed. 
   * @returns {boolean} True if there is a win, false if not.
   */
  checkForWin() {
    const [j, i] = this.lastPosPlayed;
    const counter = this.board[j][i];
    const connected = {horiz: 0, vert: 0, posDiag: 0, negDiag: 0};

    for (let t = -3; t < 4; t++) {
      /* vertical win line */
      if (this.board[j][i + t] === counter) {
        connected.vert++;
      } else {
        connected.vert = 0;
      }

      /* guards against trying to access a non-existant column */
      if (this.board[j + t] === undefined) {
        continue;
      }

      /* horizontal win line */
      if (this.board[j + t][i] === counter) {
        connected.horiz++;
      } else {
        connected.horiz = 0;
      }

      /* positive diagonal win line */
      if (this.board[j + t][i + t] === counter) {
        connected.posDiag++;
      } else {
        connected.posDiag = 0;
      }

      /* negative diagonal win line */
      if (this.board[j + t][i - t] === counter) {
        connected.negDiag++;
      } else {
        connected.negDiag = 0;
      }

      /* checking if any win line has won */
      for (let direction in connected) {
        if (connected[direction] === 4) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Resets the board.
   */
  reset() {
    this.board = this.createBoard();
  }
}

module.exports = Connect4;