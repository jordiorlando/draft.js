Draft.Circle = class Circle extends Draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

Draft.Container.mixin({
  circle: function(r) {
    return this.add(new Draft.Circle()).radius(r);
  }
});
