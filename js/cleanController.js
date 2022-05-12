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

    // Binding handlers and callbacks
    this.view.bindAddCounter(this.handleAddCounter);
  }

  /**
   * Adds a counter to the model and updates the view.
   * Checks if a winning move has been made and responds accordingly.
   * @param {number} column 
   */
  handleAddCounter = (column) => {
    if (!this.model.on) {
      return;
    }
    const coordinates = this.model.addCounter(column);
    if (!coordinates) {
      this.view.displayMessages('COLUMN_FULL', 'TRY_AGAIN');
      return;
    }
    this.view.updateCellColor(coordinates);
    const winlines = this.model.findWinlines(coordinates);
    if (winlines.length > 0 || this.model.isBoardFull()) {
      this.endGame(winlines);
    } else {
      this.endTurn();
    }
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
    this.model.gameOver();
  }

  /**
   * Ends the current turn.
   */
  endTurn = () => {
    this.model.changePlayer();
    this.view.changeCounter();
  }
}