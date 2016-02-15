draft.Shape = class Shape extends draft.Line {
  get map() {
    return super.map.concat(...['height', 'skewX', 'skewY', 'fill']);
  }
};

draft.Shape.mixin([
  'skew',
  'fill'
]);
