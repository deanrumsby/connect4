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
      this.endGame(currentPlayer, winlines);
    } else if (this.checkIfFull()) {
      this.endGame();
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

  nextCounter(direction, steps) { 
    const [j, i] = this.lastPosPlayed;
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
      // Vertical win line
      if (this.board[j][i + t] === counter) {
        connected.vert++;
      } else {
        connected.vert = 0;
      }

      // Guards against trying to access a non-existant column
      if (this.board[j + t] === undefined) {
        continue;
      }

      // Horizontal win line
      if (this.board[j + t][i] === counter) {
        connected.horiz++;
      } else {
        connected.horiz = 0;
      }

      // Positive diagonal win line
      if (this.board[j + t][i + t] === counter) {
        connected.posDiag++;
      } else {
        connected.posDiag = 0;
      }

      // Negative diagonal win line
      if (this.board[j + t][i - t] === counter) {
        connected.negDiag++;
      } else {
        connected.negDiag = 0;
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
    this.board = this.createBoard();
  }

  /**
   * Determines the row index of each column's next available slot.
   * @returns {Array<number|null>} The row indices of each available slot,
   *  or null if no slot is available.
   */
  availableMoves() {
    const moves = [];
    for (let j = 0; j < this.numCols; j++) {
      for (let i = 0; i < this.numRows; i++) {
        // checking if slot is empty
        if (!this.board[j][i]) {
          moves.push(i);
          break;
        }
        // if all slots are taken then push null
        if (i === this.numRows - 1) {
          moves.push(null);
        }
      }
    }
    return moves;
  }

  getWinlines(directions) {
    const winlines = [];
    const [j, i] = this.lastPosPlayed;
    for (let direction of directions) {
      const winline = [];
      const counter = this.board[j][i];
      winline.push([j, i]);
      let t = 1;
      let looping = true;
      while (looping) {
        switch (direction) {
          case 'vert':


      } 
     


      }
    }
  }

  grabWinLine(direction) {
    const winline = [];
    const [j, i] = this.lastPosPlayed;
    const counter = this.board[j][i];
    winline.push([j, i]);
    let t = 1;
    switch (direction) {
      case 'vert':
        while (this.board[j][i - t] === counter) {
          winline.push([j, i - t]);
          t++;
          if (this.board[j][i - t] === undefined) {
            break;
          }
        }
        break;
      case 'horiz':
        for (let m of [1, -1]) {
          t = 1;
          if (this.board[j + (m * t)] === undefined) {
            continue;
          }
          while (this.board[j + (m * t)][i] === counter) {
            winline.push([j + (m * t), i]);
            t++;
            if (this.board[j + (m * t)] === undefined) {
              break;
            }
          }
        }
        break;
      case 'posDiag':
        for (let m of [1, -1]) {
          t = 1;
          if (
            this.board[j + (m * t)] === undefined
            || this.board[j + (m * t)][i + (m * t)] === undefined
            ) {
            continue;
          }
          while (this.board[j + (m * t)][i + (m * t)] === counter) {
            winline.push([j + (m * t), i + (m * t)]);
            t++;
            if (
              this.board[j + (m * t)] === undefined
              || this.board[j + (m * t)][i + (m * t)] === undefined 
              ) {
              break;
            }
          }
        }
        break;
      case 'negDiag':
        for (let m of [1, -1]) {
          t = 1;
          if (
            this.board[j + (m * t)] === undefined
            || this.board[j + (m * t)][i - (m * t)] === undefined
            ) {
            continue;
          }
          while (this.board[j + (m * t)][i - (m * t)] === counter) {
            winline.push([j + (m * t), i - (m * t)]);
            t++;
            if (
              this.board[j + (m * t)] === undefined
              || this.board[j + (m * t)][i - (m * t)] === undefined 
              ) {
              break;
            }
          }
        }
        break;
    }
    return winline;
  }
}

module.exports = Connect4;