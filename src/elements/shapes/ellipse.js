draft.Ellipse = class Ellipse extends draft.Shape {
  radius(rx, ry) {
    return this.prop({
      rx: draft.types.length(rx),
      ry: draft.types.length(ry)
    });
  }
};

draft.Group.mixin({
  ellipse(name) {
    return this.append(new draft.Ellipse(name)).radius(50, 25);
  }
});
