draft.Circle = draft.Ellipse.extend('Circle', {
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
  },
  /* get propMap() {
    return {
      diameter: ['width', 'height']
    };
  }, */
  radius(r) {
    return this.size(r * 2, r * 2);
  }
});
