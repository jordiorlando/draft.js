draft.Circle = class Circle extends draft.Element {
  radius(r) {
    return this.prop('r', unit(r));
  }
};

draft.Group.mixin({
  circle(r) {
    return this.add(new draft.Circle()).radius(r);
  }
});
