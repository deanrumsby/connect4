/**
 * Controller for our Connect4 app.
 */
class Controller {
  /**
   * @param {Object} model A Connect4 model object. 
   * @param {Object} view A Connect4 view object.
   */
  constructor(model, view) {
    /**
     * A Connect4 model object.
     * @type {Object}
     */
    this.model = model;

    /**
     * A Connect4 view object.
     * @type {Object}
     */
    this.view = view;

    /**
     * The message keys used by this.view.displayMessage for the winning
     *   counters.
     * @type {Object<Array<string>>}
     */
    this.winnerMessageKeys = {
      x: ['RED_WIN', 'RESET'],
      o: ['YELLOW_WIN', 'RESET'],
      null: ['DRAW', 'RESET'],
    }

    // Initialising slot highlighting.
    this.view.playableRowIndices = this.model.playableRowIndices();

    // Binding our event handlers and callbacks
    this.view.bindCellHighlighting(this.handleCellHighlighting);
    this.view.bindReset(this.handleReset);
    this.view.bindAddCounter(this.handleAddCounter);
    this.model.bindEndGame(this.endGame);
  }

  /**
   * Handles the adding of counters to a chosen column. 
   * Adds a counter to the model and updates the correct slot in the view.
   * Clears any currently displayed messages.
   * @param {number} column The index of the column chosen. 
   * @returns {undefined} Returns if no coordinates were given to update.
   */
  handleAddCounter = (column, event) => {
    if (this.model.gameOver) {
      return;
    }
    event.stopPropagation();
    this.view.clearMessages();
    const coordinates = this.model.addCounter(column);
    
    if (!coordinates) {
      this.view.displayMessages('COLUMN_FULL', 'TRY_AGAIN');
      return;
    }

    this.view.updateCell(coordinates);

    // Updates the available moves in the view
    this.view.playableRowIndices = this.model.playableRowIndices();

    // Update the available moves in the model
    this.model.playableRows = this.model.playableRowIndices();

    // Cycles the current color in the view
    this.view.cycleCounters();

    // Updates the color of the player visual in the heading
    this.view.updatePlayerIndicator();

    // Signals the model to end the turn
    this.model.endTurn();
  }

  handleCellHighlighting = (column, type) => {
    const row = this.model.playableRows[column];
    const cells = this.view.cells;
    switch (type) {
      case 'click':
        if (row === null && !this.model.gameOver) {
          return;
        } else if (row === this.model.numRows - 1) {
          this.view.toggleCellHighlight(cells[column][row]);
          return;
        } else if (this.model.gameOver) {
          this.view.toggleCellHighlight(cells[column][0]);
          return;
        }
        setTimeout(() => {
          if (this.model.gameOver) {
            return;
          }
          this.view.toggleCellHighlight(cells[column][row + 1]);
        }, 10);
        this.view.toggleCellHighlight(cells[column][row]);
        break;

      default:
        if (row === null || this.model.gameOver) {
          return;
        }
        this.view.toggleCellHighlight(cells[column][row]);
    }
  }

  handleCursorHighlighting = (column) => {
    const row = this.model.playableRows[column];
    const cells = this.view.cells;
    if (row === null || this.model.gameOver) {
      return;
    }
    this.view.toggleCellHighlight(cells[column][row]);
  }

  handleClickHighlighting = (column) => {
    const row = this.model.playableRows[column];
    const cells = this.view.cells;
    if (row === null && !this.model.gameOver) {
      return;
    }
    if (row === this.model.numRows - 1) {
      this.view.toggleCellHighlight(cells[column][row]);
      return;
    }
    if (this.model.gameOver) {
      this.view.toggleCellHighlight(cells[column][0]);
      return;
    }
    setTimeout(() => {
      if (this.model.gameOver) {
        return;
      }
      this.view.toggleCellHighlight(cells[column][row + 1]);
    }, 10);
    this.view.toggleCellHighlight(cells[column][row]);
  }

  /**
   * Handles the resetting of the view and model.
   * Resets the available moves in the view.
   * Resets the gameOver flag.
   */
  handleReset = () => {
    if (!this.view.gameOver) {
      return;
    }
    this.view.reset();
    this.model.reset();
    this.view.gameOver = false;
  }

  /**
   * Updates the view when signalled by the model that the
   *   game has ended.
   * @param {string|undefined} winner The winner's counter, 
   *   or null if the game is a draw. 
   * @param {Array<string>} winlines The directions a win has been found on.
   *   Can be empty or contain 'vert', 'horiz', 'posDiag' and 'negDiag'.
   */
  endGame = (winner, winlines) => {
    // Displaying winner message
    this.view.displayMessages(...this.winnerMessageKeys[winner]);

    // Add highlighting to winning counters
    this.view.winlines = this.model.getWinlines(winlines);
    this.view.addWinlineHighlighting();

    // Reset the player visual aid
    this.view.resetPlayerIndicator();

    // Mark the game as over
    this.view.gameOver = true;
  }
}