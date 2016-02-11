draft.Circle = class Circle extends draft.Ellipse {
  radius(r) {
    return this.prop('r', draft.types.length(r));
  }
};

draft.Group.mixin({
  circle(name) {
    return this.append(new draft.Circle(name)).radius(50);
  }
});
