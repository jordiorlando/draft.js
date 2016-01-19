draft.Circle = class Circle extends draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

draft.Group.mixin({
  circle(r = 50) {
    return this.push(new draft.Circle()).radius(r);
  }
});
