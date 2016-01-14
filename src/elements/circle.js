Draft.Circle = class Circle extends Draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

Draft.Group.mixin({
  circle(r) {
    return this.add(new Draft.Circle()).radius(r);
  }
});
