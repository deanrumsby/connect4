/**
 * The styling information of our Connect4 counters
 */
class Counter {
  /**
   * @param {string} color
   */
  constructor(color) {
    this.color = color
    this.playerIndicatorClass = `player-indicator-${color}`;
    this.cellHighlightingClass = `cell-highlight-${color}`;
  }
}

/**
 * Visual component of our Connect4 application.
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
     * @type {boolean}
     */
    this.gameOver = false;

    /**
     * An array of this.numCols length, that holds the row index of the next available
     *   slot in each column. Populated by the Controller class.
     * @type {Array<number>}
     */
    this.availableMoves = [];

    /**
     * Any successful winlines are stored here, consisting of all the coordinates [j, i] of
     *   the respective lines.
     * @type {Array<Array<Array<number>>>}
     */
    this.winlines = [];

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
      RED_WIN: 'RED is the winner!',
      YELLOW_WIN: 'YELLOW is the winner!',
      DRAW: 'The game is a draw!',
      RESET: 'Please click / touch the screen to restart.',
      COLUMN_FULL: 'Sorry, that column is full!',
      TRY_AGAIN: 'Please try another column.'
    }

    this.root.append(this.title, this.board, this.messageDiv);

    // INITIALISATIONS FOR TOUCH DEVICES

    /**
     * @type {HTMLSpanElement}
     */
    this.playerIndicator = this.title.querySelector('.player-indicator');

    this.fixPlayerIndicatorWidth();

    setTimeout(() => {
      this.updatePlayerIndicator();
    }, 2000);
  }

  /**
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
   * Attaches a listener to each column of our board, for adding counters
   *   to the game.
   * Used to bind the listeners to a method in the Controller.
   * The listeners will only fire when this.gameOver is false.
   * @param {function} handler Provided by the Controller to handle the event.
   */
  bindAddCounter(handler) {
    for (let j = 0; j < this.numCols; j++) {
      this.columns[j].addEventListener('click', (e) => {
        if (!this.gameOver) {
          // we stop event bubbling so that a reset event isn't 
          // immediately and unintentionally triggered on a winning move.
          e.stopPropagation();
          handler(j);
        }
      });
    }
  }

  /**
   * Updates a given slot with the color of the current player.
   * @param {Array<number>} coordinates In the form [j, i], where j is the 
   *   column coordinate and i is the row coordinate.   
   */
  updateSlot(coordinates) {
    const [j, i] = coordinates;
    this.cells[j][i].style.backgroundColor = this.currentCounter().color;
  }

  /**
   * Displays messages underneath the board.
   * @param {Array<string>} messages Keys used to display message from 
   *   this.messages.
   */
  displayMessage(...messages) {
    for (let message of messages) {
      const p = document.createElement('p');
      p.innerText = this.messages[message];
      this.messageDiv.append(p);
    }
  }

  /**
   * Clears any messages currently displayed under the board.
   */
  clearMessage() {
    this.messageDiv.replaceChildren();
  }

  /**
   * Returns the current counter type to be placed.
   * @returns {Object<Counter>} The current counter type to be placed
   */
  currentCounter() {
    return this.counters[0];
  }

  /**
   * Returns the counter type after the current counter type to be placed.
   * @returns {Object<Counter>} The counter type after next, to be placed.
   */
  nextCounter() {
    return this.counters[1];
  }

  /**
   * Cycles the counter queue.
   */
  cycleCounters() {
    this.counters.push(this.counters.shift());
  }

  /**
   * Creates the event listener used to reset the board.
   * Used to bind the listener to a method in the Controller.
   * Will only fire when this.gameOver is true.
   * @param {function} handler Provided by the Controller to handle the event.
   */
  bindReset(handler) {
    document.addEventListener('click', () => {
      if (this.gameOver) {
        handler();
      }
    });
  }

  /**
   * Attaches listeners to each column of the board that will handle the
   *   highlighting of any possible moves. 
   * Highlighting changes color depending on the next player to move.
   * Highlighting does not occur during the game over screen.
   * NOTE: This must be initialised in the controller before the addCounter
   *   method has been bound to get the event firing order correct.
   * Highlighting will only appear on devices using a mouse pointer.
   */
  slotHighlighting() {
    for (let j = 0; j < this.numCols; j++) {
      // Add highlighting to the next available move within the column
      this.columns[j].addEventListener('mouseenter', () => {
        const i = this.availableMoves[j];
        // If the column is full or the game is over, no highlighting occurs
        if (i === null || this.gameOver) {
          return;
        }
        this.cells[j][i].classList.add(this.currentCounter().cellHighlightingClass);
      });

      // Remove highlighting when cursor leaves the column
      this.columns[j].addEventListener('mouseleave', () => {
        const i = this.availableMoves[j];
        // If the column is full, no removal occurs
        if (i === null) {
          return;
        }
        this.cells[j][i].classList.remove(this.currentCounter().cellHighlightingClass);
      });

      // Updates the highlighting when a player adds a counter 
      // to the column.
      // Because the available moves are refreshed before the counter is placed,
      // this.slots[j][i] will be the position of the counter before the newly placed one.  
      this.columns[j].addEventListener('click', () => {
        const i = this.availableMoves[j];
        // If the column is full, do nothing.
        if (i === null) {
          return;
        }
        // If on the last row, only remove the highlighting.
        if (i === this.numRows - 1) {
          this.cells[j][i].classList.remove(this.currentCounter().cellHighlightingClass);
          return;
        }
        // If the game is over, begin highlighting from the bottom row again
        if (this.gameOver) {
          this.cells[j][0].classList.add(this.currentCounter().cellHighlightingClass);
          return;
        }
        // Else add the highlighting to the next available slot
        // The very small timeout is used to check if the move just made has
        // triggered the game to end, in which case we do not want to highlight
        // the slot above. 
        setTimeout(() => {
          if (this.gameOver) {
            return;
          }
          this.cells[j][i + 1].classList.add(this.currentCounter().cellHighlightingClass);
        }, 5);
        // Removing the highlighting from the previously highlighted slot
        this.cells[j][i].classList.remove(this.currentCounter().cellHighlightingClass);
      });
    }
  }

  /**
   * Highlights all the succesful winlines from this.winlines.
   */
  addWinlineHighlighting() {
    const cells = document.querySelectorAll('.cell');
    // reduces opacity of all slots that have been taken by a counter
    for (let cell of cells) {
      if (cell.style.backgroundColor) {
        cell.style.opacity = '0.75';
      }
    }
    // If the game is a draw, no extra highlighting added
    if (this.winlines.length === 0) {
      return;
    }
    // for all winning positions, we raise the opacity back to 1 and
    // add highlighting animation
    for (let winline of this.winlines) {
      for (let coordinates of winline) {
        const [j, i] = coordinates;
        this.cells[j][i].style.opacity = '1';
        this.cells[j][i].classList.add('win-line-highlight');
      }
    }
  }

  /**
   * Removes the highlighting from the winlines in this.winlines.
   */
  removeWinlineHighlighting() {
    // Resetting the opacities of every slot on the board
    const cells = document.querySelectorAll('.cell');
    for (let cell of cells) {
      if (cell.style.opacity) {
        cell.style.opacity = "";
      }
    }
    // If the game is a draw, no extra highlighting needs to be removed
    if (this.winlines.length === 0) {
      return;
    }
    // Removing the highlighting animation from the winning
    // positions
    for (let winline of this.winlines) {
      for (let coordinates of winline) {
        const [j, i] = coordinates;
        this.cells[j][i].classList.remove('win-line-highlight');
      }
    }
  }

  /**
   * Resets the appearance of the board.
   * Clears any messages displayed under the board.
   * Resets the player visual in the heading for touch devices.
   */
  reset() {
    for (let column of this.cells) {
      for (let cell of column) {
        cell.style.backgroundColor = '';
      }
    }
    this.clearMessage();
    this.updatePlayerIndicator();
    this.removeWinlineHighlighting();
    this.winlines = [];
  }

  // METHODS FOR TOUCH DEVICES

  fixPlayerIndicatorWidth() {
    const indicatorHeight = window.getComputedStyle(this.playerIndicator).height;
    this.playerIndicator.style.width = indicatorHeight;
  }

  updatePlayerIndicator() {
    this.playerIndicator.classList.remove(this.nextCounter().playerIndicatorClass);
    this.playerIndicator.classList.add(this.currentCounter().playerIndicatorClass);
  }

  resetPlayerIndicator() {
    this.playerIndicator.classList.remove(this.currentCounter().playerIndicatorClass);
    this.playerIndicator.classList.remove(this.nextCounter().playerIndicatorClass);
  }
}