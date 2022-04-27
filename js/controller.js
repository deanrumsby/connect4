class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddCounter(this.handleAddCounter);
  }

  handleAddCounter = (column) => {
    const position = this.model.addCounter(column);
    const counter = this.model.currentPlayer();
    this.view.updateSlot(position, counter);
    this.model.endTurn();
  }

  handleReset = () => {
    this.model.reset();
  }
}