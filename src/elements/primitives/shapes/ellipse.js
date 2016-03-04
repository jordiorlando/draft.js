draft.Ellipse = draft.Shape.extend('Ellipse', {
  construct(width, height) {
    this.size(width || 75, height || 100);
  }
});
