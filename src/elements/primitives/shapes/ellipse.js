draft.Ellipse = class Ellipse extends draft.Shape {};

draft.Group.mixin({
  ellipse(name) {
    return this.append(new draft.Ellipse(name)).size(100, 75);
  }
});
