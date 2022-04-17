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
    // return 0 for success, return 1 if column is full
    for (let i = 0; i < numRows; i++) {
      if (this[i][column] === null) {
        this[i][column] = counter;
        return 0;
      }
    }
    return 1;
  }
}


game = new Connect4();