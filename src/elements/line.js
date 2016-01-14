draft.Line = class Line extends draft.Element {
  length(length) {
    return this.prop('length', unit(length));
  }
};

draft.Group.mixin({
  line(length) {
    return this.add(new draft.Line()).length(length);
  }
});
