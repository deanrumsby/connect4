class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddCounter(this.handleAddCounter);
    this.view.bindReset(this.handleReset);
    this.model.bindEndGame(this.endGame);
  }

  handleAddCounter = (column) => {
    this.view.clearMessage();
    const coordinates = this.model.addCounter(column);
    
    if (!coordinates) {
      this.view.displayMessage(3);
      return;
    }

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
    this.model.endTurn();
  }

  handleReset = () => {
    this.view.reset();
    this.model.reset();
    this.view.gameOver = false;
  }

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
    setTimeout(() => {
      this.view.gameOver = true;
    }, 200);
  }
}