class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddCounter(this.handleAddCounter);
  }

  handleAddCounter = (column) => {
    this.model.addCounter(column);
  }

  handleReset = () => {
    this.model.reset();
  }
}