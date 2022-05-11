/**
 * The controller of our Connect4 application.
 */
class Controller {
  /**
   * @param {View} view 
   * @param {Model} model 
   */
  constructor(view, model) {
    /**
     * @type {View}
     */
    this.view = view;

    /**
     * @type {Model}
     */
    this.model = model;

    // Binding handlers and callbacks
    this.view.bindAddCounter(this.handleAddCounter);
  }

  /**
   * Adds a counter to the model and updates the view.
   * Checks if a winning move has been made and responds accordingly.
   * @param {Number} column 
   */
  handleAddCounter = (column) => {
    const coordinates = this.model.addCounter(column);
    if (!coordinates) {
      return;
    }
    this.view.updateCellColor(coordinates);

    this.model.findWinlines(coordinates);
    
    if (this.model.winlines.length > 0 || this.model.isBoardFull()) {
      this.endGame()
    } else {
      this.endTurn();
    }
  }

  /**
   * Ends the current turn.
   */
  endTurn = () => {
    this.model.changePlayer();
    this.view.changeCounter();
  }
}