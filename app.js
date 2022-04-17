function Connect4() {
  const numRows = 6;
  const numCols = 7;

  // Creating the 6 x 7 game board
  for (let i = 0; i < numRows; i++) {
    this[i] = [];
    for (let j = 0; j < numCols; j++) {
      this[i][j] = null;
    }
  }

  this.addCounter = function(counter, column) {
    // returns counter position if successful
    // returns 1 if column is full
    for (let row = 0; row < numRows; row++) {
      if (this[row][column] === null) {
        this[row][column] = counter;
        return [row, column];
      }
    }
    return 1;
  }

  this.checkWin = function(i, j) {
    // checks for win on all possible win lines for some given counter position (i, j)
    // returns true if win
    // returns false if no win
    // returns 1 if provided with a null counter position

    if (this[i][j] === null) {
      return 1;
    }

    const counter = this[i][j];
    
    this.checkHorizWin = function() {
      // checks for possible horizontal wins
      // returns true if win
      // returns false if no win
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
    if (this.checkHorizWin()) {
      return true;
    } else {
      return false;
    }
  }
}


game = new Connect4();