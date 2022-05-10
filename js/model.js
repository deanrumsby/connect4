/**
 * All the main logic for playing a game of Connect4.
 */
class Connect4 {
  /**
   * @param {number} numCols The number of columns in our board.
   * @param {number} numRows The number of rows in our board.
   */
  constructor(numCols = 7, numRows = 6) {
    /**
     * The number of columns in our board.
     * @type {number}
     */
    this.numCols = numCols;

    /**
     * The number of rows in our board.
     * @type {number}
     */
    this.numRows = numRows;

    /**
     * The most recently occupied position on the board.
     * @type {null|Array<number>}
     */
    this.lastPosPlayed = null

    this.gameOver = false;
    
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

    this.playableRows = this.playableRowIndices();
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
    return this.counters[0];
  }

  /**
   * Ends the current turn - checks for any succesful winlines 
   *   or if the board is full.
   * Then rotates the couter queue by one. 
   * If an endgame condition is met, it will signal the Controller.
   */
  endTurn() {
    const currentPlayer = this.counters.shift();
    const winlines = this.checkForWinlines();
    if (winlines.length > 0) {
      this.gameOver = true;
      this.endGame(currentPlayer, winlines);
    } else if (this.checkIfFull()) {
      this.gameOver = true;
      this.endGame(null, winlines);
    }
    this.counters.push(currentPlayer);
  }

  /**
   * Allows us to signal the Controller that the game has met an 
   *   endgame condition and to respond accordingly.
   * @param {function} callback Provided by the Controller.
   */
  bindEndGame(callback) {
    this.endGame = callback;
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
   * Determines the next counter in a given direction by a number of steps.
   * Relative to this.lastPosPlayed
   * @param {string} direction The direction to check - can be
   *   'vert', 'horiz', 'posDiag' or 'negDiag'.
   * @param {number} steps The number of steps away to check.
   * @returns {string} Counter - either 'x' or 'o'.
   */
  nextCounter(direction, steps) { 
    const [j, i] = this.lastPosPlayed;
    // checking the column we want to access exists
    const columnExists = (this.board[j + steps] !== undefined); 
    switch (direction) {
      case 'vert':
        return this.board[j][i + steps];
      case 'horiz':
        if (columnExists) {
          return this.board[j + steps][i];
        }
        break;
      case 'posDiag':
        if (columnExists) {
          return this.board[j + steps][i + steps];
        }
        break;
      case 'negDiag':
        if (columnExists) {
          return this.board[j + steps][i - steps];
        }
        break;
    }
  }

  /**
   * Checks for wins on all possible win lines that pass through this.lastPosPlayed.
   * @returns {Array<string>} The directions of any successful winlines.
   */
  checkForWinlines() {
    const [j, i] = this.lastPosPlayed;
    const counter = this.board[j][i];
    const connected = {horiz: 0, vert: 0, posDiag: 0, negDiag: 0};
    const winDirections = [];

    for (let t = -3; t < 4; t++) {
      // Checking the next counter in each direction
      for (let direction in connected) {
        if (this.nextCounter(direction, t) === counter) {
          connected[direction]++;
        } else {
          connected[direction] = 0;
        }
      }
      // Checking if any win lines have won
      for (let direction in connected) {
        if (connected[direction] === 4) {
          winDirections.push(direction);
        }
      }
    }
    return winDirections;
  }

  /**
   * Resets the board.
   */
  reset() {
    this.gameOver = false;
    this.board = this.createBoard();
    this.playableRows = this.playableRowIndices();
  }

  /**
   * Determines the row index of each column's next available slot.
   * @returns {Array<number|null>} The row indices of each available slot,
   *  or null if no slot is available.
   */
  playableRowIndices() {
    const playableRowIndices = [];
    for (let j = 0; j < this.numCols; j++) {
      for (let i = 0; i < this.numRows; i++) {
        // checking if slot is empty
        if (!this.board[j][i]) {
          playableRowIndices.push(i);
          break;
        }
        // if all slots are taken then push null
        if (i === this.numRows - 1) {
          playableRowIndices.push(null);
        }
      }
    }
    return playableRowIndices;
  }

  /**
   * Creates an array of winlines, each containing all of the coordinates
   *   on the board that belong to that winline.
   * @param {Array<string>} directions An array of directions to check
   * @returns {Array<Array<Array<number>>>} The winlines and their coordinates.
   */
  getWinlines(directions) {
    // If no directions are provided, don't proceed.
    if (!directions) {
      return;
    }
    // Determine starting position and counter
    const winlines = [];
    const [j, i] = this.lastPosPlayed;
    const counter = this.board[j][i];
    // Loop over each win direction provided
    for (let direction of directions) {
      const winline = [];
      winline.push([j, i]);
      let t = 1;
      switch (direction) {
        case 'vert':
          // We only look at counters below when considering vertical wins
          while (this.nextCounter('vert', -t) === counter) {
            winline.push([j, i - t])
            t++;
          }
          break;
        case 'horiz':
          // We check from the last move going right to begin with ie. m = 1
          //   so that we only check until hitting a counter that isn't ours.
          for (let m of [1, -1]) {
            t = 1;
            while (this.nextCounter('horiz', m * t) === counter) {
              winline.push([j + (m * t), i]);
              t++;
            }
          }
          break;
        case 'posDiag':
          // Same idea as the comment for horizontal case.
          for (let m of [1, -1]) {
            t = 1;
            while (this.nextCounter('posDiag', m * t) === counter) {
              winline.push([j + (m * t), i + (m * t)]);
              t++;
            }
          }
          break;
        case 'negDiag':
          // Same idea as the comment for horizontal case.
          for (let m of [1, -1]) {
            t = 1;
            while (this.nextCounter('negDiag', m * t) === counter) {
              winline.push([j + (m * t), i - (m * t)]);
              t++;
            }
          }
          break;
      }
      winlines.push(winline);
    }
    return winlines; 
  }
}   

module.exports = Connect4;