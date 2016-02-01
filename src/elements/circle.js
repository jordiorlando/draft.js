draft.Circle = class Circle extends draft.Shape {
  radius(r) {
    return this.prop('r', unitHack(r));
  }
};

draft.Group.mixin({
  circle(r = 50) {
    return this.push(new draft.Circle()).radius(r);
  }
});
