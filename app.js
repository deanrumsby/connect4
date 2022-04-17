class Connect4 {
  constructor() {
    this.numRows = 6;
    this.numCols = 7;

    // Creating the 6 x 7 game board
    for (let i = 0; i < this.numRows; i++) {
      this[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        this[i][j] = null;
      }
    }
  }

  addCounter(counter, column) {
    // returns counter position if successful
    // returns 1 if column is full
    for (let row = 0; row < this.numRows; row++) {
      if (this[row][column] === null) {
        this[row][column] = counter;
        return [row, column];
      }
    }
    return 1;
  }

  checkWin(i, j) {
    // checks for win on all possible win lines for some given counter position (i, j)
    // returns true if win
    // returns false if no win
    // returns 1 if provided with a null counter position

    if (this[i][j] === null) {
      return 1;
    }

    if (this.checkHorizWin(i,j)) {
      return true;
    }
  }
    
  checkHorizWin(i, j) {
    // checks for possible horizontal wins for some given counter position (i, j)
    // returns true if win
    // returns false if no win
    // returns 1 if provided with a null counter position

    if (this[i][j] === null) {
      return 1;
    }

    const counter = this[i][j];
    let connected = 0;

    for (let x = j - 3; x < j + 4; x++) {
      if (this[i][x] === counter) {
       connected++;
      } else {
       connected = 0;
      }
      if (connected === 4) {
        return true
      }
    }
    return false
  }
}


game = new Connect4();