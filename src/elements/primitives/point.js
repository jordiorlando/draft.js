draft.Point = class Point extends draft.Element {};

draft.Point.mixin('stroke');

draft.Group.mixin({
  point(name) {
    return this.append(new draft.Point(name));
  }
});
