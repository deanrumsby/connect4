class View {
  constructor(numCols = 7, numRows = 6) {
    // the root element
    this.root = this.getElement('#connect4');

    // the title of the app
    this.title = this.createElement('h1', 'title');
    this.title.innerText = "Connect4";

    // the game's slots, in a 2D array
    // populated by this.createBoard
    this.slots = [];

    // the visual game board
    this.board = this.createBoard(numCols, numRows);

    // results container
    this.results = this.createElement('div', 'results');

    // append to the root element
    this.root.append(this.title, this.board, this.results);
  }

  // creates DOM element with optional class
  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }

  // retrieves an element from the DOM
  getElement(selector) {
    return document.querySelector(selector);
  }

  // retrieves all elements from the DOM with specified selector
  getAllElements(selector) {
    return document.querySelectorAll(selector);
  }

  // creates and returns the game's board element
  // populates this.slots 
  createBoard(numCols, numRows) {
    // creating the visual board
    const board = this.createElement('div', 'board');
    board.style.aspectRatio = `${numCols} / ${numRows}`;

    // creating each column of the board
    for (let j = 0; j < numCols; j++) {
      this.slots[j] = [];
      const column = this.createElement('div', 'board-col');

      // append it to the grid
      board.append(column);

      // create each cell and slot within each column
      for (let i = 0; i < numRows; i++) {
        const cell = this.createElement('div', 'cell');
        const slot = this.createElement('div', 'slot');
        cell.append(slot);
        column.append(cell);

        // add the slot to the 2D slots array
        this.slots[j][i] = slot;
      }
    }
    return board;
  }

  // gives a slot a given color styling class
  updateSlot(position, color) {
    const [j, i] = position;
    this.slots[j][i].style.backgroundColor = color;
  }

  // displays a results message underneath the game board
  displayResults(winner) {
    const winnerText = this.createElement('p');
    const resetText = this.createElement('p');
    if (winner === 'draw') {
      winnerText.innerText = 'The game is a draw!';
    } else {
      winnerText.innerText = `${winner.toUpperCase()} is the winner!`;
    }
    resetText.innerText = 'Press any key to reset the game.';
    this.results.append(winnerText, resetText);
  }

  reset() {
    for (let column of this.slots) {
      for (let slot of column) {
        slot.style.backgroundColor = 'var(--body-bgcolor)';
      }
    }
    this.results.replaceChildren();
  }

  // binds our click events to a handler in the controller
  bindAddCounter(handler) {
    const columns = this.getAllElements('.board-col');
    for (let j = 0; j < columns.length; j++) {
      columns[j].addEventListener('click', () => {
        handler(j);
      });
    }
  }

  // binds our reset event listeners to our handler in the controller
  bindReset(handler) {
    document.addEventListener('keydown', handler);
    document.addEventListener('click', handler);
  }

  unbindReset(handler) {
    document.removeEventListener('keydown', handler);
    document.removeEventListener('click', handler);
  }
}