/**
 * All the game logic for our Connect4 application.
 */
class Model {
  /**
   * @param {number} numCols 
   * @param {number} numRows 
   */
  constructor(numCols = 7, numRows = 6) {
    /**
     * @type {number}
     */
    this.numCols = numCols;

    /**
     * @type {number}
     */
    this.numRows = numRows;

    /**
     * @type {Array<string>}
     */ 
     this.counters = ['x', 'o'];

    /**
     * @type {Array<Array<null>>}
     */
     this.board = this.createBoard();
  }

  /**
   * Creates a 2D array that acts as our board.
   * @returns {Array<Array<null|string>>}
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
   * Adds the current player's counter to a column.
   * @param {number} j 
   * @returns {Array<number>|null}
   */
  addCounter(j) {
    for (let i = 0; i < this.numRows; i++) {
      if (!this.board[j][i]) {
        this.board[j][i] = this.currentPlayer();
        return [j, i];
      }
    }
    return null;
  }

  /**
   * Returns the current player's counter.
   * @returns {string}
   */
  currentPlayer() {
    return this.counters[0];
  }

  /**
   * Cycles the player counters queue.
   */
  changePlayer() {
    this.counters.push(this.counters.shift());
  }

  /**
   * Finds all successful winlines passing through some coordinates.
   * @param {Array<Number>} coordinates 
   * @returns {Array<Array<Array<Number>>>}
   */
  findWinlines(coordinates) {
    const winlines = [];
    const [j, i] = coordinates;
    const counter = this.board[j][i];
    for (let vector of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      const line = [];
      line.push([j, i]);
      const [vectorJ, vectorI] = vector;
      for (let directionMultiplier of [1, -1]) {
        let numSteps = 1;
        let nextJ = () => j + (numSteps * directionMultiplier * vectorJ);
        let nextI = () => i + (numSteps * directionMultiplier * vectorI);
        while (this.board[nextJ()] && this.board[nextJ()][nextI()] === counter) {
          line.push([nextJ(), nextI()]);
          numSteps++;
        }  
      }
      if (line.length >= 4) {
        winlines.push(line);
      }
    }
    return winlines;
  }
}

module.exports = Model;