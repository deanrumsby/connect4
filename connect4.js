/**
 * All the main logic for playing a game of Connect4
 */
class Connect4 {
  /**
   * @param {number} numCols The number of columns of our game's board
   * @param {number} numRows The number of rows of our game's board
   */
  constructor(numCols = 7, numRows = 6) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.board = [];
    this.createBoard();
  }
  
  /**
   * Creates a 2D array that serves as our game's board.
   * Our first index j corresponds to the column number of the board.
   * The second index i corresponds to the row number of the board.
   * For example - this.board[3][4] represents the cell on the fourth column and 
   *  fifth row of the board (we start counting at 0).
   */
  createBoard() {
    for (let j = 0; j < this.numCols; j++) {
      this.board[j] = [];
      for (let i = 0; i < this.numRows; i++) {
        this.board[j][i] = null;
      }
    }
  }

  /**
   * Adds a player counter to a given column on the board.
   * @param {string} counter The player counter: must be 'x' or 'o'.
   * @param {number} j The column number to which we are adding a counter. 
   * @returns {Array<number>|number} The coordinates of the placed counter or 1 if the 
   *  column is full.
   */
  addCounter(counter, j) {
    for (let i = 0; i < this.numRows; i++) {
      if (this.board[j][i] === null) {
        this.board[j][i] = counter;
        return [j, i];
      }
    }
    return 1;
  }

  /**
   * Checks if the board is full with player counters.
   * @returns {boolean}
   */
  checkFull() {
    for (let j = 0; j < this.numCols; j++) {
      if (this.board[j][this.numRows - 1] === null) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks the possible win lines for a given board position and direction.
   * @param {Array<number>} position An array [j, i] of board coordinates. 
   * @param {string} direction A direction - either 'horizontal', 'vertical', or 'diagonal'. 
   * @returns {number|boolean} 1 if the position checked contains a null counter, otherwise a 
   *  boolean, if there is a win or not.
   */
  checkWin(position) {
    const [j, i] = position;

    if (this.board[j][i] === null) {
      return 1;
    }

    const counter = this.board[j][i];
    const connected = {horiz: 0, vert: 0, posDiag: 0, negDiag: 0};

    for (let t = -3; t < 4; t++) {
      if (this.board[j][i + t] === counter) {
        connected.vert++;
      } else {
        connected.vert = 0;
      }

      if (this.board[j + t] === undefined) {
        continue;
      }

      if (this.board[j + t][i] === counter) {
        connected.horiz++;
      } else {
        connected.horiz = 0;
      }

      if (this.board[j + t][i - t] === counter) {
        connected.posDiag++;
      } else {
        connected.posDiag = 0;
      }

      if (this.board[j + t][i + t] === counter) {
        connected.negDiag++;
      } else {
        connected.negDiag = 0;
      }

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
    this.createBoard();
  }
}

module.exports = Connect4;