class View {
  constructor(numCols, numRows) {
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

  bindAddCounter(handler) {
    const columns = this.getAllElements('.board-col');
    for (let j = 0; j < columns.length; j++) {
      columns[j].addEventListener('click', () => {
        handler(j);
      });
    }

  }
}