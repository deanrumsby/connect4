class Connect4 {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.board = [];
    // Creating the game board
    for (let i = 0; i < this.numRows; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        this.board[i][j] = null;
      }
    }
  }

  addCounter(counter, j) {
    // returns counter position if successful
    // returns 1 if column is full
    for (let i = 0; i < this.numRows; i++) {
      if (this.board[i][j] === null) {
        this.board[i][j] = counter;
        return [i, j];
      }
    }
    return 1;
  }

  checkWin(pos, direction) {
    // checks for win at position [i, j] for a given direction (horizontal/vertical/diagonal)
    // returns true if win
    // returns false if no win
    // returns 1 if provided with a null counter position
   
    const [i, j] = pos;

    if (this.board[i][j] === null) {
      return 1;
    }

    const counter = this.board[i][j];
    let connected = 0;
    let alt_diag_connected = 0;

    for (let t = -3; t < 4; t++) {
      switch (direction) {
        case 'horizontal':
          if (this.board[i][j + t] === counter) {
            connected++;
          } else {
            connected = 0;
          }
          break;
        case 'vertical':
          if (i + t < 0) {
            break;
          } else if (this.board[i + t][j] === counter) {
            connected++;
          } else {
            connected = 0;
          }
          break;
        case 'diagonal':
          if (i + t < 0) {
            break;
          }
          if (this.board[i + t][j + t] === counter) {
            connected++;
          } else {
            connected = 0;
          }
          if (this.board[i + t][j - t] === counter) {
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