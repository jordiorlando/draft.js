draft.Line = class Line extends draft.Point {
  get map() {
    // TODO: remove angles from element properties
    return super.map.concat(...['alpha', 'width']);
  }
};

// TODO: skew transformation?
draft.Line.mixin([
  'rotate',
  'scale'
]);

draft.Group.mixin({
  line(name) {
    return this.append(new draft.Line(name)).size(100);
  }
});
