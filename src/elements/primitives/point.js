draft.Point = class Point extends draft.Element {
  get map() {
    // TODO: remove xyz from element properties
    return ['x', 'y', 'z', 'stroke'];
  }
};

draft.Point.mixin([
  'translate',
  'stroke'
]);

draft.Group.mixin({
  point(name) {
    return this.append(new draft.Point(name));
  }
});
