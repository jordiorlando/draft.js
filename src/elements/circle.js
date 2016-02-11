draft.Circle = class Circle extends draft.Shape {
  radius(r) {
    return this.prop('r', draft.types.length(r));
  }
};

draft.Group.mixin({
  circle(name) {
    return this.push(new draft.Circle(name)).radius(50);
  }
});
