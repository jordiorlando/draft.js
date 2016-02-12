draft.Line = class Line extends draft.Point {
  length(length) {
    return this.prop('length', draft.types.length(length));
  }
};

draft.Group.mixin({
  line(name) {
    return this.append(new draft.Line(name)).length(100);
  }
});
