/**
 * All the DOM related logic for playing a game of Connect4.
 */
class View {
  /**
   * @param {number} numCols The number of columns of our game's board.
   * @param {number} numRows The number of rows of our game's board.
   */
  constructor(numCols = 7, numRows = 6) {
    /**
     * The root element, to which the app will be a descendant of.
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
     * Flag that lets us know if the game has finished.
     * @type {boolean}
     */
    this.gameOver = false;

    /**
     * A 2D array containing div elements for each slot on the game's board.
     * @type {Array<Array<HTMLDivElement>>} 
     */
    this.slots = [];

    /**
     * A collection divs that represents the game's board.
     * @type {HTMLDivElement}
     */
    this.board = this.createBoard(numCols, numRows);

    /**
     * A container that holds any messages we wish to display.
     * @type {HTMLDivElement}
     */
    this.message = document.createElement('div');
    this.message.classList.add('message');

    /* Appending title, board and message container to the root element */
    this.root.append(this.title, this.board, this.message);
  }

  /**
   * Creates the collection of divs that represents our board and
   *   populates this.slots.
   * @param {number} numCols The number of columns of our game's board.
   * @param {number} numRows The number of rows of our game's board.
   * @returns {HTMLDivElement} The representation of our board.
   */ 
  createBoard(numCols, numRows) {
    /* Creating the board element */
    const board = document.createElement('div');
    board.classList.add('board');
    board.style.aspectRatio = `${numCols} / ${numRows}`;

    /* Creating each column of the board
     * and creates a column within this.slots */
    for (let j = 0; j < numCols; j++) {
      this.slots[j] = [];
      const column = document.createElement('div');
      column.classList.add('board-col');
      board.append(column);

      /* Creating each cell and slot of our column */
      for (let i = 0; i < numRows; i++) {
        const cell = document.createElement('div');
        const slot = document.createElement('div');
        cell.classList.add('cell');
        slot.classList.add('slot');
        cell.append(slot);
        column.append(cell);

        /* Adds the slot to our 2D array this.slots */
        this.slots[j][i] = slot;
      }
    }
    return board;
  }

  /**
   * Creates the event listeners used to add a counter to each column on 
   *   the board. 
   * Used to bind the listeners to a method in the Controller.
   * Will only fire when this.gameOver is false.
   * @param {function} handler A handler method used in the Controller.
   */
  bindAddCounter(handler) {
    const columns = document.querySelectorAll('.board-col');
    for (let j = 0; j < columns.length; j++) {
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
   * Displays a message underneath the game's board.
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
   * Clears any messages currently displayed under the game's board.
   */
  clearMessage() {
    this.message.replaceChildren();
  }

  /**
   * Creates the event listeners used to reset the board.
   * Used to bind the listeners to a method in the Controller.
   * @param {function} handler 
   */
  bindReset(handler) {
    for (let event of ['click', 'keydown']) {
      document.addEventListener(event, () => {
        if (this.gameOver) {
          handler();
        }
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