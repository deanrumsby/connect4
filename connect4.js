class Connect4 {
  constructor(numCols = 7, numRows = 6) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.board = [];
    // Creating the game board
    // our coordinates for the game board will be (j, i) ie. (col, row)
    // this may seem strange but it is more useful to work with when building a UI
    // as keeping each columns data in a single array is more natural for this game
    for (let j = 0; j < this.numCols; j++) {
      this.board[j] = [];
      for (let i = 0; i < this.numRows; i++) {
        this.board[j][i] = null;
      }
    }
  }

  addCounter(counter, j) {
    // returns counter position if successful
    // returns 1 if column is full
    for (let i = 0; i < this.numRows; i++) {
      if (this.board[j][i] === null) {
        this.board[j][i] = counter;
        return [j, i];
      }
    }
    return 1;
  }

  checkWin(pos, direction) {
    // checks for win at position [j, i] for a given direction (horizontal/vertical/diagonal)
    // returns true if win
    // returns false if no win
    // returns 1 if provided with a null counter position
   
    const [j, i] = pos;

    if (this.board[j][i] === null) {
      return 1;
    }

    const counter = this.board[j][i];
    let connected = 0;
    let alt_diag_connected = 0;

    for (let t = -3; t < 4; t++) {
      switch (direction) {
        case 'horizontal':
          if (j + t < 0 || j + t > 6) {
            break;
          } else if (this.board[j + t][i] === counter) {
            connected++;
          } else {
            connected = 0;
          }
          break;
        case 'vertical':
          if (this.board[j][i + t] === counter) {
            connected++;
          } else {
            connected = 0;
          }
          break;
        case 'diagonal':
          if (j + t < 0 || j + t > 6) {
            break;
          }
          if (this.board[j + t][i + t] === counter) {
            connected++;
          } else {
            connected = 0;
          }
          if (this.board[j + t][i - t] === counter) {
            alt_diag_connected++;
          } else {
            alt_diag_connected = 0;
          }
          break;
      }
      if (connected === 4 || alt_diag_connected === 4) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Connect4;