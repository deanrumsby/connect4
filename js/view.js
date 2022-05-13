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
    this.title.innerHTML = "Connect<span class='player-indicator'>4</span>";

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
     * @type {Array<HTMLDivElement>}
     */
    this.coloredCells = [];
     
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

    // INITS FOR TOUCH DEVICES

    /**
     * @type {HTMLSpanElement}
     */
     this.playerIndicator = this.title.querySelector('.player-indicator');

     this.fixPlayerIndicatorWidth();     
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
   * Used to bind an addCounter handler from the controller.
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
   * Used to bind a cellHighlighting handler from the controller.
   * @param {Function} handler 
   */
  bindCellHighlighter(handler) {
    const types = ['mouseenter', 'mouseleave', 'click'];
    for (let j = 0; j < this.numCols; j++) {
      for (let type of types) {
        this.columns[j].addEventListener(type, (event) => {
          handler(event, j);
        });
      }
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
   * Updates the counter color CSS variable.
   */
  updateCssCounterColor() {
    const r = document.querySelector(':root');
    r.style.setProperty('--curr-counter-color', this.currentCounter().color);
  }

  /**
   * Paints a cell with the current counter's color.
   * @param {Array<number>} coordinates 
   */
  updateCellColor(coordinates) {
    const [j, i] = coordinates;
    this.cells[j][i].style.backgroundColor = this.currentCounter().color;
    this.coloredCells.push(this.cells[j][i]);
  }

  /**
   * Toggles the highlighting for the cell at the given coordinates.
   * @param {Array<Array<number>>} coordinates 
   */
  toggleCellHighlighting(coordinates) {
    const [j, i] = coordinates;
    this.cells[j][i].classList.toggle('cell-highlight');
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
   * Adds highlighting to the given winlines.
   * @param {Array<Array<Array<number>>>} winlines 
   * @returns
   */
  addWinlinesHighlighting(winlines) {
    for (let cell of this.coloredCells) {
      cell.classList.add('darken');
    }
    if (winlines.length === 0) {
      return;
    }
    for (let winline of winlines) {
      for (let coordinates of winline) {
        const [j, i] = coordinates;
        this.cells[j][i].classList.add('winline-highlight');
      }
    }
  }

  /**
   * Resets the board.
   */
  reset() {
    for (let cell of this.coloredCells) {
      cell.style.backgroundColor = '';
      cell.classList.remove('winline-highlight', 'darken');
    }
    this.coloredCells = [];
    this.clearMessages();
  }

  // METHODS FOR TOUCH DEVICES 

  /**
   * Ensures the player indicator is circular.
   */
  fixPlayerIndicatorWidth() {
    const indicHeight = window.getComputedStyle(this.playerIndicator).height;
    this.playerIndicator.style.width = indicHeight;
  }
}