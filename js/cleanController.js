/**
 * The controller of our Connect4 application.
 */
class Controller {
  /**
   * @param {Object} view 
   * @param {Object} model 
   */
  constructor(view, model) {
    /**
     * @type {Object}
     */
    this.view = view;

    /**
     * @type {Object}
     */
    this.model = model;

    // Binding handlers
    this.view.bindCellHighlighter(this.handleCellHighlighting);
    this.view.bindAddCounter(this.handleAddCounter);
    this.view.bindReset(this.handleReset);
  }

  /**
   * Adds a counter to the model and updates the view.
   * Checks if a winning move has been made and responds accordingly.
   * @param {Event} event
   * @param {number} column 
   */
  handleAddCounter = (event, column) => {
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
    this.view.updateCellColor(coordinates);

    const winlines = this.model.findWinlines(coordinates);
    if (winlines.length > 0 || this.model.isBoardFull()) {
      this.endGame(winlines);
    } 
    this.endTurn();
  }

  /**
   * Highlights the next available move in the column.
   * @param {Event} event 
   * @param {number} column 
   */
  handleCellHighlighting = (event, column) => {
    const toggleNextCell = () => {
      const nextRow = this.model.nextRows[column];
      if (nextRow === null || this.model.gameOver) {
        return;
      }
      this.view.toggleCellHighlighting([column, nextRow]);
    }

    toggleNextCell();

    if (event.type === 'click') {
      setTimeout(toggleNextCell, 10);
    }
  }

  /**
   * Resets the view and the model.
   * @returns 
   */
  handleReset = () => {
    if (!this.model.gameOver) {
      return;
    }
    this.model.reset();
    this.model.updateNextRows();
    this.view.reset();
  }

  /**
   * Ends the current game.
   * @param {Array<Array<Array<number>>>} winlines 
   */
  endGame = (winlines) => {
    if (winlines.length > 0) {
      const winner = this.view.currentCounter().color;
      this.view.displayMessages(winner.toUpperCase(), 'RESET');
    } else {
      this.view.displayMessages('DRAW', 'RESET');
    }
    this.view.addWinlinesHighlighting(winlines);
    this.model.gameOver = true;
  }

  /**
   * Ends the current turn.
   */
  endTurn = () => {
    this.model.updateNextRows();
    this.model.changePlayer();
    this.view.changeCounter();
    this.view.updateCssCounterColor();
  }
}