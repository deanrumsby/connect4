class View {
  constructor(numCols = 7, numRows = 6) {
    // the root element
    this.root = document.querySelector('#connect4');

    // the title of the app
    this.title = document.createElement('h1');
    this.title.classList.add('title');
    this.title.innerText = "Connect4";

    // tracks if the game is over
    this.gameOver = false;

    // the game's slots, in a 2D array
    // populated by this.createBoard
    this.slots = [];

    // the visual game board
    this.board = this.createBoard(numCols, numRows);

    // message container
    this.message = document.createElement('div');
    this.message.classList.add('message');

    // append to the root element
    this.root.append(this.title, this.board, this.message);
  }

  // creates and returns the game's board element
  // populates this.slots 
  createBoard(numCols, numRows) {
    // creating the visual board
    const board = document.createElement('div');
    board.classList.add('board');
    board.style.aspectRatio = `${numCols} / ${numRows}`;

    // creating each column of the board
    for (let j = 0; j < numCols; j++) {
      this.slots[j] = [];
      const column = document.createElement('div');
      column.classList.add('board-col');

      // append it to the grid
      board.append(column);

      // create each cell and slot within each column
      for (let i = 0; i < numRows; i++) {
        const cell = document.createElement('div');
        const slot = document.createElement('div');
        cell.classList.add('cell');
        slot.classList.add('slot');
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
    const columns = document.querySelectorAll('.board-col');
    for (let j = 0; j < columns.length; j++) {
      columns[j].addEventListener('click', () => {
        if (!this.gameOver) {
          handler(j);
        }
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
    for (let event of ['click', 'keydown']) {
      document.addEventListener(event, () => {
        if (this.gameOver) {
          handler();
        }
      });
    }
  }

  // resets the appearance of the board
  reset() {
    for (let column of this.slots) {
      for (let slot of column) {
        slot.style.backgroundColor = 'var(--body-bgcolor)';
      }
    }
    this.clearMessage();
  }
}