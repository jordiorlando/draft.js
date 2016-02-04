draft.Line = class Line extends draft.Point {
  length(length) {
    return this.prop('length', unitHack(length));
  }
};

draft.Group.mixin({
  line(length = 100) {
    return this.push(new draft.Line()).length(length);
  }
});
