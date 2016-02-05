draft.Circle = class Circle extends draft.Shape {
  radius(r) {
    return this.prop('r', draft.types.length(r));
  }
};

draft.Group.mixin({
  circle(r = 50) {
    return this.push(new draft.Circle()).radius(r);
  }
});
