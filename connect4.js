class Connect4 {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    // Creating the game board
    for (let i = 0; i < this.numRows; i++) {
      this[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        this[i][j] = null;
      }
    }
  }

  addCounter(counter, j) {
    // returns counter position if successful
    // returns 1 if column is full
    for (let i = 0; i < this.numRows; i++) {
      if (this[i][j] === null) {
        this[i][j] = counter;
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

    if (this[i][j] === null) {
      return 1;
    }

    const counter = this[i][j];
    let connected = 0;

    for (let t = -3; t < 4; t++) {
      switch (direction) {
        case 'horizontal':
          if (this[i][j + t] === counter) {
            connected++;
            break;
          } else {
            connected = 0;
            break;
          }
        case 'vertical':
          if (i + t < 0) {
            break;
          } else if (this[i + t][j] === counter) {
            connected++;
            break;
          } else {
            connected = 0;
            break;
          }
        case 'diagonal':
          if (i + t < 0) {
            break;
          } else if (this[i + t][j + t] === counter) {
            connected++;
            break
          } else {
            connected = 0;
            break;
          }
      }
      if (connected === 4) {
        return true;
      }
    }
    return false;
  }
}