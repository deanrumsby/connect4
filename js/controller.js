class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddCounter(this.handleAddCounter);
  }

  endGame(winner) {
    this.view.displayResults(winner);
    setTimeout(() => {
      this.view.bindReset(this.handleReset);
    }, 200);
  }

  handleAddCounter = (column) => {
    const position = this.model.addCounter(column);
    if (!position || !this.model.stillPlaying) {
      return;
    }
    let counter;
    if (this.model.currentPlayer() === 'x') {
      counter = 'red';
    } else {
      counter = 'yellow'
    }
    this.view.updateSlot(position, counter);
    const winner = this.model.endTurn();
    if (winner) {
      this.endGame(winner);
    }
  }

  handleReset = () => {
    this.view.reset();
    this.model.reset();
    this.view.unbindReset(this.handleReset);
  }
}