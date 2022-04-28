class View {
  constructor(numCols = 7, numRows = 6) {
    // the root element
    this.root = this.getElement('#connect4');

    // the title of the app
    this.title = this.createElement('h1', 'title');
    this.title.innerText = "Connect4";

    // tracks if the game is over
    this.gameEnd = false;

    // the game's slots, in a 2D array
    // populated by this.createBoard
    this.slots = [];

    // the visual game board
    this.board = this.createBoard(numCols, numRows);

    // message container
    this.message = this.createElement('div', 'message');

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

  // creates and binds our click event listeners to a handler in the controller
  // will only activate whilst the game is in it's main phase
  bindAddCounter(handler) {
    if (this.gameEnd) {
      return;
    }
    const columns = this.getAllElements('.board-col');
    for (let j = 0; j < columns.length; j++) {
      columns[j].addEventListener('click', () => {
        handler(j);
      });
    }
  }

  // given coordinates [j, i], update it's slot with the color provided
  updateSlot(coordinates, color) {
    const [j, i] = coordinates;
    this.slots[j][i].style.backgroundColor = color;
  }

  // displays a message underneath the game board
  displayMessage(code) {
    const lineOne = this.createElement('p');
    const lineTwo = this.createElement('p');
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

  // clears the currently displayed message
  clearMessage() {
    this.message.replaceChildren();
  }

  // depending on the condition, calls to display the appropriate message
  endGame(condition) {
    switch (condition) {
      case 'red':
        this.displayMessage(0);
        break;
      case 'yellow':
        this.displayMessage(1);
        break;
      case 'draw':
        this.displayMessage(2);
        break;
    }
  }

  // allows for controller to bind to this reset function
  bindReset(handler) {
    if (!this.gameEnd) {
      return;
    }
    document.addEventListener('click', handler);
    document.addEventListener('keydown', handler);
  }

  // resets the appearance of the board
  reset() {
    for (let column of this.slots) {
      for (let slot of column) {
        slot.style.backgroundColor = 'var(--body-bgcolor)';
      }
    }
    this.results.replaceChildren();
  }
}