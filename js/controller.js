class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddCounter(this.handleAddCounter);
  }

  endGame(winner) {
    this.view.displayResults(winner);
  }

  handleAddCounter = (column) => {
    const position = this.model.addCounter(column);
    if (!position || !this.model.stillPlaying) {
      return;
    }
    const counter = this.model.currentPlayer();
    this.view.updateSlot(position, counter);
    const winner = this.model.endTurn();
    if (winner) {
      this.endGame(winner);
    }
  }

  handleReset = () => {
    this.model.reset();
  }
}