draft.Shape = draft.Line.extend('Shape', {
  get map() {
    return [
      'x', 'y', 'z',
      'alpha',
      'width', 'height',
      'skewX', 'skewY',
      'fill', 'stroke'
    ];
  }
});

draft.Shape.mixin([
  'skew',
  'fill'
]);
