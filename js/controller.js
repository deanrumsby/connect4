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
    this.view.availableMoves = this.model.availableMoves();
    this.view.slotHighlighting();

    // Binding our event handlers and callbacks
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
  handleAddCounter = (column) => {
    // Clears messages, adds counter to model and receives 
    // the coordinates for the newly placed piece
    this.view.clearMessage();
    const coordinates = this.model.addCounter(column);
    
    // If no coordinates, will ask the view to display a column full message
    if (!coordinates) {
      this.view.displayMessage('COLUMN_FULL', 'TRY_AGAIN');
      return;
    }

    // Updates the slot given by the coordinates with the color
    // of the current player
    this.view.updateSlot(coordinates);

    // Updates the available moves in the view
    this.view.availableMoves = this.model.availableMoves();

    // Cycles the current color in the view
    this.view.cycleColors();

    // Updates the color of the player visual in the heading
    this.view.updatePlayerVisual();

    // Signals the model to end the turn
    this.model.endTurn();
  }

  /**
   * Handles the resetting of the view and model.
   * Resets the available moves in the view.
   * Resets the gameOver flag.
   */
  handleReset = () => {
    this.view.reset();
    this.model.reset();
    this.view.availableMoves = this.model.availableMoves();
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
    this.view.displayMessage(...this.winnerMessageKeys[winner]);

    // Add highlighting to winning counters
    this.view.winlines = this.model.getWinlines(winlines);
    this.view.addWinlineHighlighting();

    // Reset the player visual aid
    this.view.resetPlayerVisual();

    // Mark the game as over
    this.view.gameOver = true;
  }
}