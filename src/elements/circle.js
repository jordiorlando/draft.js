Draft.Circle = class Circle extends Draft.Element {
  radius(r) {
    return this.prop('r', r);
  }
};

Draft.Container.extend({
Draft.Container.mixin({
  circle: function(r) {
    return this.add(new Draft.Circle()).radius(r);
  }
});
