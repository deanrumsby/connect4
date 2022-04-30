/**
 * Visual component of our Connect4 application.
 */
class View {
  /**
   * @param {number} numCols The number of columns of our board.
   * @param {number} numRows The number of rows of our board.
   */
  constructor(numCols = 7, numRows = 6) {
    /**
     * The number of columns of our board.
     * @type {number}
     */
    this.numCols = numCols;

    /**
     * The number of rows of our board.
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
     * Signals whether an end-game condition has been reached.
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
     *   slot in each column. Populated by the Controller.
     * @type {Array<number>}
     */
    this.availableMoves = [];

    /**
     * A collection of divs that create the visual structure of the game's board.
     * @type {HTMLDivElement}
     */
    this.board = this.createBoard(numCols, numRows);

    /**
     * A container that holds any messages we wish to display.
     * @type {HTMLDivElement}
     */
    this.message = document.createElement('div');
    this.message.classList.add('message');

    // Appending to the root element
    this.root.append(this.title, this.board, this.message);
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

    // Creating each column for this.board and this.slots
    for (let j = 0; j < numCols; j++) {
      this.slots[j] = [];
      const column = document.createElement('div');
      column.classList.add('board-col');
      board.append(column);

      // Creating each cell and slot of our column for this.board
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
      columns[j].addEventListener('click', () => {
        if (!this.gameOver) {
          handler(j);
        }
      });
    }
  }

  /**
   * Updates a given slot with the color provided.
   * @param {Array<number>} coordinates In the form [j, i], where j is the 
   *   column coordinate and i is the row coordinate.  
   * @param {string} color A color to use - Usually 'red' or 'yellow'. 
   */
  updateSlot(coordinates, color) {
    const [j, i] = coordinates;
    this.slots[j][i].style.backgroundColor = color;
  }

  /**
   * Displays a message underneath the board.
   * @param {number} code Code used to select the desired message.
   */
  displayMessage(code) {
    const lineOne = document.createElement('p');
    const lineTwo = document.createElement('p');
    switch (code) {
      case 0:
        lineOne.innerText = 'RED is the winner!';
        lineTwo.innerText = 'Press any key to reset the game.';
        break;
      case 1:
        lineOne.innerText = 'YELLOW is the winner!';
        lineTwo.innerText = 'Press any key to reset the game.';
        break;
      case 2:
        lineOne.innerText = 'The game is a draw!';
        lineTwo.innerText = 'Press any key to reset the game.';
        break;
      case 3:
        lineOne.innerText = 'Sorry, that column is full!';
        lineTwo.innerText = 'Please choose another column.';
        break;
    }
    this.message.append(lineOne, lineTwo);
  }

  /**
   * Clears any messages currently displayed under the board.
   */
  clearMessage() {
    this.message.replaceChildren();
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
   */
  slotHighlighting() {
    // Collecting the columns
    const columns = document.querySelectorAll('.board-col');
    for (let j = 0; j < this.numCols; j++) {
      // Add highlighting to the next available move within the column
      columns[j].addEventListener('mouseenter', () => {
        const i = this.availableMoves[j];
        // If the column is full, no highlighting occurs
        if (i === null) {
          return;
        }
        this.slots[j][i].classList.add('slot-highlight');
      });

      // Remove highlighting when cursor leaves the column
      columns[j].addEventListener('mouseleave', () => {
        const i = this.availableMoves[j];
        // If the column is full, no removal occurs
        if (i === null) {
          return;
        }
        this.slots[j][i].classList.remove('slot-highlight');
      });

      // Updates the highlighting when a player adds a counter 
      // to the column.
      // Because the addCounter event listener is attached first
      // this.availableMoves will contain the moves available after 
      // the next counter is dropped - since both listeners will fire in
      // the event of a click.
      columns[j].addEventListener('click', () => {
        const i = this.availableMoves[j];
        // If the last row has just been filled, remove the highlighting
        if (i === null) {
          this.slots[j][this.numRows - 1].classList.remove('slot-highlight');
          return;
        }
        // Else add the highlighting to the next available slot
        this.slots[j][i].classList.add('slot-highlight');
        // If the game is over, the next click will remove the highlighting
        // and begin highlighting from the bottom row again
        if (this.gameOver) {
          this.slots[j][i].classList.remove('slot-highlight');
          this.slots[j][0].classList.add('slot-highlight');
          return;
        }
        // Removing the highlighting from the previously highlighted slot
        this.slots[j][i - 1].classList.remove('slot-highlight');
      });
    }
  }

  /**
   * Resets the appearance of the board.
   * Clears any messages displayed under the board.
   */
  reset() {
    for (let column of this.slots) {
      for (let slot of column) {
        slot.style.backgroundColor = 'var(--body-bgcolor)';
      }
    }
    this.clearMessage();
  }
}