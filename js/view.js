/**
 * Visual component of our Connect4 application.
 */
class View {
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
     * The container of the app.
     * @type {HTMLDivElement}
     */
    this.root = document.querySelector('#connect4');

    /**
     * The main heading of the game.
     * @type {HTMLHeadingElement}
     */
    this.title = document.createElement('h1');
    this.title.classList.add('title');
    this.title.innerText = "Connect4";

    /**
     * Flags whether an end-game condition has been reached.
     * @type {boolean}
     */
    this.gameOver = false;

    /**
     * A 2D array containing a div element for each slot on the game's board.
     * We use coordinates [j, i], such that j is the column index of the board
     *   and i is the row index.
     * It is populated by the method View.createBoard.
     * @type {Array<Array<HTMLDivElement>>} 
     */
    this.slots = [];

    /**
     * An array of this.numCols length, that holds the row index of the next available
     *   slot in each column. Populated by the Controller class.
     * @type {Array<number>}
     */
    this.availableMoves = [];

    /**
     * Any successful winlines are stored here, consisting of all the coordinates of
     *   the respective lines.
     * @type {Array<Array<Array<number>>>}
     */
    this.winlines = [];

    /**
     * The color queue of the counters that can be placed on our board.
     * @type {Array<string>}
     */
    this.colors = ['red', 'yellow'];

    /**
     * A collection of divs that create the visual structure of the game's board.
     * @type {HTMLDivElement}
     */
    this.board = this.createBoard(numCols, numRows);

    /**
     * A container that holds any messages we wish to display.
     * @type {HTMLDivElement}
     */
    this.messageDiv = document.createElement('div');
    this.messageDiv.classList.add('message');

    /**
     * Holds all the messages we can choose to display under
     *   the board.
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

    // Appending visual elements to the root element
    this.root.append(this.title, this.board, this.messageDiv);
  }

  /**
   * Creates a collection of divs that represents the structure of our game's
   *   board.
   * @param {number} numCols The number of columns of our board.
   * @param {number} numRows The number of rows of our board.
   * @returns {HTMLDivElement} The representation of our board.
   */ 
  createBoard(numCols, numRows) {
    // Creating the board element
    const board = document.createElement('div');
    board.classList.add('board');
    board.style.aspectRatio = `${numCols} / ${numRows}`;

    // Creating each column for the board and this.slots
    for (let j = 0; j < numCols; j++) {
      this.slots[j] = [];
      const column = document.createElement('div');
      column.classList.add('board-col');
      board.append(column);

      // Creating each cell and slot of our board's column
      for (let i = 0; i < numRows; i++) {
        const cell = document.createElement('div');
        const slot = document.createElement('div');
        cell.classList.add('cell');
        slot.classList.add('slot');
        cell.append(slot);
        column.append(cell);

        // Assigns the slot to our 2D array this.slots
        this.slots[j][i] = slot;
      }
    }
    return board;
  }

  /**
   * Attaches a listener to each column of our board, for adding counters
   *   to the game.
   * Used to bind the listeners to a method in the Controller.
   * The listeners will only fire when this.gameOver is false.
   * @param {function} handler Provided by the Controller to handle the event.
   */
  bindAddCounter(handler) {
    const columns = document.querySelectorAll('.board-col');
    for (let j = 0; j < this.numCols; j++) {
      columns[j].addEventListener('click', (e) => {
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
    this.slots[j][i].style.backgroundColor = this.currentColor();
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
   * Returns the current color to be placed.
   * @returns {string} The next color to be placed
   */
  currentColor() {
    return this.colors[0];
  }

  /**
   * Returns the color after the current color to be placed.
   * @returns {string} The color after next, to be placed.
   */
  nextColor() {
    return this.colors[1];
  }

  /**
   * Cycles the color queue.
   */
  cycleColors() {
    this.colors.push(this.colors.shift());
  }

  /**
   * Creates the event listener used to reset the board.
   * Used to bind the listener to a method in the Controller.
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
   */
  slotHighlighting() {
    const columns = document.querySelectorAll('.board-col');
    for (let j = 0; j < this.numCols; j++) {
      // Add highlighting to the next available move within the column
      columns[j].addEventListener('mouseenter', () => {
        const i = this.availableMoves[j];
        // If the column is full or the game is over, no highlighting occurs
        if (i === null || this.gameOver) {
          return;
        }
        this.slots[j][i].classList.add(`slot-highlight-${this.currentColor()}`);
      });

      // Remove highlighting when cursor leaves the column
      columns[j].addEventListener('mouseleave', () => {
        const i = this.availableMoves[j];
        // If the column is full, no removal occurs
        if (i === null) {
          return;
        }
        this.slots[j][i].classList.remove(`slot-highlight-${this.currentColor()}`);
      });

      // Updates the highlighting when a player adds a counter 
      // to the column.
      // Because the available moves are refreshed before the counter is placed,
      // this.slots[j][i] will be the position of the counter before the newly placed one.  
      columns[j].addEventListener('click', () => {
        const i = this.availableMoves[j];
        // If the column is full, do nothing.
        if (i === null) {
          return;
        }
        // If on the last row, only remove the highlighting.
        if (i === this.numRows - 1) {
          this.slots[j][i].classList.remove(`slot-highlight-${this.currentColor()}`);
          return;
        }
        // If the game is over, begin highlighting from the bottom row again
        if (this.gameOver) {
          this.slots[j][0].classList.add(`slot-highlight-${this.currentColor()}`);
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
          this.slots[j][i + 1].classList.add(`slot-highlight-${this.currentColor()}`);
        }, 5);
        // Removing the highlighting from the previously highlighted slot
        this.slots[j][i].classList.remove(`slot-highlight-${this.currentColor()}`);
      });
    }
  }

  /**
   * Highlights all the succesful winlines from this.winlines.
   */
  addWinlineHighlighting() {
    const slots = document.querySelectorAll('.slot');
    // reduces opacity of all slots that have been taken by a counter
    for (let slot of slots) {
      if (slot.style.backgroundColor) {
        slot.style.opacity = '0.75';
      }
    }
    // for all winning positions, we raise the opacity back to 1 and
    // add highlighting animation
    for (let winline of this.winlines) {
      for (let coordinates of winline) {
        const [j, i] = coordinates;
        this.slots[j][i].style.opacity = '1';
        this.slots[j][i].classList.add('win-line-highlight');
      }
    }
  }

  /**
   * Removes the highlighting from the winlines in this.winlines.
   */
  removeWinlineHighlighting() {
    // Resetting the opacities of every slot on the board
    const slots = document.querySelectorAll('.slot');
    for (let slot of slots) {
      if (slot.style.opacity) {
        slot.style.opacity = "";
      }
    }
    // Removing the highlighting animation from the winning
    // positions
    for (let winline of this.winlines) {
      for (let coordinates of winline) {
        const [j, i] = coordinates;
        this.slots[j][i].classList.remove('win-line-highlight');
      }
    }
  }

  /**
   * Resets the appearance of the board.
   * Clears any messages displayed under the board.
   */
  reset() {
    for (let column of this.slots) {
      for (let slot of column) {
        slot.style.backgroundColor = '';
      }
    }
    this.clearMessage();
    this.removeWinlineHighlighting();
    this.winlines = [];
  }
}