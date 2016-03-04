draft.Square = draft.Rectangle.extend('Square', {
  construct(width) {
    this.size(width || 100);
  },
  get map() {
    return [
      'x', 'y', 'z',
      'alpha',
      'width',
      'skewX', 'skewY',
      'fill', 'stroke'
    ];
  }
});
