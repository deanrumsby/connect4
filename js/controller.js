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

    /* Binding our event handlers and callbacks */
    this.view.bindAddCounter(this.handleAddCounter);
    this.view.bindReset(this.handleReset);
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
    /* Clears messages, adds counter to model and receives 
     * the coordinates for the newly placed piece */
    this.view.clearMessage();
    const coordinates = this.model.addCounter(column);
    
    /* If no coordinates, will ask the view to display a column full message */
    if (!coordinates) {
      this.view.displayMessage(3);
      return;
    }

    /* Updates the slot given by the coordinates with the color
     * of the current player */
    const currentPlayer = this.model.currentPlayer();
    const [player1, player2] = this.model.counters;
    
    switch (currentPlayer) {
      case player1:
        this.view.updateSlot(coordinates, 'red');
        break;
      case player2:
        this.view.updateSlot(coordinates, 'yellow');
        break;
    }
    /* Signals the model to end the turn */
    this.model.endTurn();
  }

  /**
   * Handles the resetting of the view and model.
   */
  handleReset = () => {
    this.view.reset();
    this.model.reset();
    this.view.gameOver = false;
  }

  /**
   * Updates the view when signalled by the model that the
   *   game has ended.
   * @param {string|undefined} winner The winner's counter, 
   *   or undefined if the game is a draw. 
   */
  endGame = (winner) => {
    const [player1, player2] = this.model.counters;
    switch (winner) {
      case player1:
        this.view.displayMessage(0);
        break;
      case player2:
        this.view.displayMessage(1);
        break;
      default:
        this.view.displayMessage(2);
        break;
    }
    /* Timeout given so that the reset events aren't unintentionally
     * fired by a game ending keypress */
    setTimeout(() => {
      this.view.gameOver = true;
    }, 200);
  }
}