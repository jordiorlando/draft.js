draft.Line = class Line extends draft.Element {
  length(length) {
    return this.prop('length', unitHack(length));
  }
};

draft.Group.mixin({
  line(length) {
    return this.push(new draft.Line()).length(length);
  }
});
