/**
 * The visual component of our Connect4 application.
 */
class View {
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
     * @type {HTMLDivElement}
     */
    this.root = document.querySelector('#connect4');

    /**
     * @type {HTMLHeadingElement}
     */
    this.title = document.createElement('h1');
    this.title.classList.add('title');
    this.title.innerText = 'Connect4';

    /**
     * @type {Array<Counter>}
     */
    this.counters = [new Counter('red'), new Counter('yellow')];

    /**
     * @type {HTMLDivElement}
     */
    this.board = this.createBoard();

    /**
     * @type {NodeListOf<HTMLDivElement>}
     */
    this.columns = this.board.querySelectorAll('.column');
     
    /**
     * @type {Array<HTMLCollectionOf<HTMLDivElement>>}
     */
    this.cells = this.createCellsArray();
     
    /**
     * @type {HTMLDivElement}
     */
    this.messageDiv = document.createElement('div');
    this.messageDiv.classList.add('message-div');

    /**
     * @type {Object<string>}
     */
     this.messages = {
      RED: 'RED is the winner!',
      YELLOW: 'YELLOW is the winner!',
      DRAW: 'The game is a draw!',
      RESET: 'Please click / touch the screen to restart.',
      COLUMN_FULL: 'Sorry, that column is full!',
      TRY_AGAIN: 'Please try another column.'
    }

    this.root.append(this.title, this.board, this.messageDiv);
  }

  /**
   * Creates a visual board for the game.
   * @returns {HTMLDivElement}
   */ 
  createBoard() {
    const board = document.createElement('div');
    board.classList.add('board');
    board.style.aspectRatio = `${this.numCols} / ${this.numRows}`;

    for (let j = 0; j < this.numCols; j++) {
      const column = document.createElement('div');
      column.classList.add('column');
      board.append(column);

      for (let i = 0; i < this.numRows; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        column.append(cell);
      }
    }
    return board;
  }

  /**
   * Creates a 2D array that contains each cell on the board.
   * @returns {Array<HTMLCollectionOf<HTMLDivElement>>}
   */
  createCellsArray() {
    const cellsArray = [];
    for (let column of this.columns) {
      cellsArray.push(column.children);
    }
    return cellsArray;
  }

  /**
   * Used to bind an add counter handler from the controller.
   * @param {Function} handler 
   */
  bindAddCounter(handler) {
    for (let j = 0; j < this.numCols; j++) {
      this.columns[j].addEventListener('click', (event) => {
        handler(event, j);
      });
    }
  }

  /**
   * Used to bind a reset handler from the controller.
   * @param {Function} handler 
   */
  bindReset(handler) {
    document.addEventListener('click', handler);
  }

  /**
   * Returns the current player's counter.
   * @returns {Counter}
   */
  currentCounter() {
    return this.counters[0];
  }

  /**
   * Cycles the player counters queue.
   */
  changeCounter() {
    this.counters.push(this.counters.shift());
  }

  /**
   * Paints a cell with the current counter's color.
   * @param {Array<number>} coordinates 
   */
  updateCellColor(coordinates) {
    const [j, i] = coordinates;
    this.cells[j][i].style.backgroundColor = this.currentCounter().color;
  }

  /**
   * Displays messages underneath the board.
   * @param {Array<string>} messageKeys
   */
   displayMessages(...messageKeys) {
    for (let key of messageKeys) {
      const p = document.createElement('p');
      p.innerText = this.messages[key];
      this.messageDiv.append(p);
    }
  }

  /**
   * Clears any currently displayed messages.
   */
  clearMessages() {
    this.messageDiv.replaceChildren();
  }

  /**
   * Resets the board.
   */
  reset() {
    for (let column of this.cells) {
      for (let cell of column) {
        cell.style.backgroundColor = '';
      }
    }
    this.clearMessages();
  }
}